#!/usr/bin/env python3
"""CourseKit local HTTP server; managed by manage_server.py."""
import argparse
import json
import os
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import secrets
import threading
from urllib.parse import urlsplit, unquote
import posixpath

ROOT = Path(__file__).resolve().parents[3]
STATE = ROOT / '.coursekit-server.json'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--root', type=Path, default=ROOT, help='Fallback document root')
    parser.add_argument('--framework', type=Path, help='Physical framework directory mounted at /framework/')
    parser.add_argument('--course', type=Path, help='Physical course directory mounted at /courses/<course-name>/')
    parser.add_argument('--course-name', help='URL segment for the course (default: course directory name)')
    args = parser.parse_args()
    serve_root = args.root.expanduser().resolve(strict=True)
    if not serve_root.is_dir():
        parser.error('--root must refer to an existing directory')
    def existing_directory(path, label):
        if path is None:
            return None
        resolved = path.expanduser().resolve(strict=True)
        if not resolved.is_dir():
            parser.error(f'{label} must be a directory')
        return resolved

    framework_dir = existing_directory(args.framework, '--framework')
    course_dir = existing_directory(args.course, '--course')
    course_name = args.course_name or (course_dir.name if course_dir else None)
    if args.course_name and not course_dir:
        parser.error('--course-name requires --course')
    if course_name and (course_name in ('.', '..') or '/' in course_name or '\\' in course_name or not course_name.strip()):
        parser.error('--course-name must be a single nonempty URL path segment')
    mounts = {}
    if framework_dir:
        mounts['/framework/'] = framework_dir
    if course_dir:
        mounts[f'/courses/{course_name}/'] = course_dir
    secret = secrets.token_urlsafe(32)

    class Handler(SimpleHTTPRequestHandler):
        def translate_path(self, path):
            # The selected virtual mount determines the physical root.
            # Reject dot segments after percent-decoding; never escape mounted roots.
            request_path = unquote(urlsplit(path).path)
            if '\x00' in request_path or '\\' in request_path:
                return str(serve_root / '__coursekit_invalid_path__')
            parts = request_path.split('/')
            if any(part in ('.', '..') for part in parts):
                return str(serve_root / '__coursekit_invalid_path__')
            for prefix, physical in sorted(mounts.items(), key=lambda item: -len(item[0])):
                if request_path == prefix[:-1] or request_path.startswith(prefix):
                    suffix = request_path[len(prefix):] if request_path.startswith(prefix) else ''
                    target = physical.joinpath(*filter(None, suffix.split('/'))).resolve()
                    if not target.is_relative_to(physical):
                        return str(serve_root / '__coursekit_invalid_path__')
                    return str(target)
            # No match for an unmounted virtual area: do not leak a stale
            # /framework or /courses folder from the fallback document root.
            if request_path.startswith('/framework/') or request_path == '/framework' or request_path.startswith('/courses/'):
                return str(serve_root / '__coursekit_unmounted_path__') if mounts else super().translate_path(path)
            return super().translate_path(path)

        # Development files must never be served from an HTTP cache.
        # This covers CSS/JS/XML/JSON, conditional 304 replies and errors.
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.send_header('X-CourseKit-Root', str(serve_root))
            super().end_headers()

        def do_GET(self):
            path = urlsplit(self.path).path
            if path == '/__coursekit/health':
                payload = json.dumps({
                    'application': 'CourseKit', 'pid': os.getpid(),
                    'root': str(serve_root), 'mounts': {k: str(v) for k, v in mounts.items()}, 'host': args.host, 'port': args.port,
                    'server': 'coursekit-local-v2-diagnostic',
                }).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            else:
                super().do_GET()

        def do_POST(self):
            if self.path != '/__coursekit/shutdown' or self.client_address[0] not in ('127.0.0.1', '::1'):
                self.send_error(404)
                return
            if self.headers.get('X-CourseKit-Token') != secret:
                self.send_error(403)
                return
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Stopping CourseKit')
            self.wfile.flush()
            threading.Thread(target=self.server.shutdown, daemon=True).start()

    # Bind BEFORE publishing state, so failed starts cannot leave stale state.
    server = ThreadingHTTPServer((args.host, args.port), partial(Handler, directory=str(serve_root)))
    state = {'pid': os.getpid(), 'host': args.host, 'port': args.port, 'token': secret, 'root': str(serve_root), 'mounts': {k: str(v) for k, v in mounts.items()}}
    try:
        fd = os.open(str(STATE), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            json.dump(state, output)
        print(f'CourseKit serving {serve_root} on http://{args.host}:{args.port}/', flush=True)
        for prefix, physical in mounts.items():
            print(f'  {prefix} -> {physical}', flush=True)
        server.serve_forever(poll_interval=0.1)
    finally:
        server.server_close()
        try:
            if STATE.exists() and json.loads(STATE.read_text(encoding='utf-8')).get('token') == secret:
                STATE.unlink()
        except (OSError, ValueError):
            pass


if __name__ == '__main__':
    main()
