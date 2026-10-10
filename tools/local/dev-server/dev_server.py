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
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[3]
STATE = ROOT / '.coursekit-server.json'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    secret = secrets.token_urlsafe(32)

    class Handler(SimpleHTTPRequestHandler):
        # Development files must never be served from an HTTP cache.
        # This covers CSS/JS/XML/JSON, conditional 304 replies and errors.
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.send_header('X-CourseKit-Root', str(ROOT))
            super().end_headers()

        def do_GET(self):
            path = urlsplit(self.path).path
            if path == '/__coursekit/health':
                payload = json.dumps({
                    'application': 'CourseKit', 'pid': os.getpid(),
                    'root': str(ROOT), 'host': args.host, 'port': args.port,
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
    server = ThreadingHTTPServer((args.host, args.port), partial(Handler, directory=str(ROOT)))
    state = {'pid': os.getpid(), 'host': args.host, 'port': args.port, 'token': secret}
    try:
        fd = os.open(str(STATE), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as output:
            json.dump(state, output)
        print(f'CourseKit listening on http://{args.host}:{args.port}/', flush=True)
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
