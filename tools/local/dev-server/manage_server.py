#!/usr/bin/env python3
"""Start/stop CourseKit HTTP server independently from the invoking terminal."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.error import URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[3]
STATE = ROOT / '.coursekit-server.json'
LOG = ROOT / '.coursekit-server.log'
SERVER = Path(__file__).with_name('dev_server.py')


def read_state():
    try:
        return json.loads(STATE.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return None


def server_identity(state):
    try:
        with urlopen(f"http://{state['host']}:{state['port']}/__coursekit/health", timeout=0.5) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data if data.get('application') == 'CourseKit' else None
    except (OSError, URLError, KeyError, ValueError, TypeError):
        return None


def health(state):
    identity = server_identity(state)
    return bool(identity and identity.get('pid') == state.get('pid')
                and identity.get('root') == state.get('root', str(ROOT))
                and identity.get('mounts', {}) == state.get('mounts', {}))


def status():
    state = read_state()
    if not state:
        print(f'No tracked CourseKit process for {ROOT}')
    else:
        print(f'Tracked server: PID={state.get("pid")}, serving={state.get("root", str(ROOT))}')
    identity = server_identity({'host': '127.0.0.1', 'port': 8000})
    if identity:
        print(f'Port 8000 server: PID={identity.get("pid")}, root={identity.get("root")}')
        if not state or identity.get('pid') != state.get('pid'):
            print('WARNING: port 8000 is not the tracked CourseKit instance.')
    else:
        print('Port 8000 does not respond as the diagnostic CourseKit server; it may be another process.')
    return 0


def start(root=ROOT, framework=None, courses=None, course_names=None):
    root = Path(root).expanduser().resolve()
    if not root.is_dir():
        print(f'Cannot serve nonexistent directory: {root}', file=sys.stderr)
        return 2

    framework = Path(framework).expanduser().resolve() if framework else None
    courses = [Path(path).expanduser().resolve() for path in (courses or [])]
    course_names = list(course_names or [])
    if course_names and len(course_names) != len(courses):
        print('Provide either no --course-name or one --course-name per --course', file=sys.stderr)
        return 2
    for label, location in [('--framework', framework), *[(f'--course #{i + 1}', c) for i, c in enumerate(courses)]]:
        if location is not None and not location.is_dir():
            print(f'{label} directory does not exist: {location}', file=sys.stderr)
            return 2

    names = course_names or [course.name for course in courses]
    requested_mounts = {}
    if framework:
        requested_mounts['/framework/'] = str(framework)
    for name, course in zip(names, courses):
        if name in ('.', '..') or '/' in name or '\\' in name or not name.strip():
            print(f'Invalid --course-name: {name!r}', file=sys.stderr)
            return 2
        key = f'/courses/{name}/'
        if key in requested_mounts:
            print(f'Duplicate course name: {name}', file=sys.stderr)
            return 2
        requested_mounts[key] = str(course)
    previous = read_state()
    if previous and health(previous):
        if previous.get('root') != str(root) or previous.get('mounts', {}) != requested_mounts:
            print('CourseKit already runs with different mounts. Stop it before restarting.', file=sys.stderr)
            return 1
        print(f"CourseKit already running: http://{previous['host']}:{previous['port']}/")
        return 0
    port_owner = server_identity({'host': '127.0.0.1', 'port': 8000})
    if port_owner:
        print(f"Port 8000 is already occupied by CourseKit PID {port_owner.get('pid')} at {port_owner.get('root')}", file=sys.stderr)
        print('Stop that server from its own project directory before starting this one.', file=sys.stderr)
        return 1
    if previous:
        print('Stale server state detected; removing it.')
        STATE.unlink(missing_ok=True)

    command = [sys.executable, str(SERVER), '--host', '127.0.0.1', '--port', '8000', '--root', str(root)]
    if framework: command += ['--framework', str(framework)]
    for name, course in zip(names, courses):
        command += ['--course', str(course), '--course-name', name]
    options = {'cwd': str(ROOT), 'stdin': subprocess.DEVNULL}
    if os.name == 'nt':
        options['creationflags'] = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS
    else:
        options['start_new_session'] = True
    with LOG.open('ab') as output:
        options['stdout'] = output
        options['stderr'] = subprocess.STDOUT
        process = subprocess.Popen(command, **options)

    for _ in range(60):
        state = read_state()
        if state and state.get('pid') == process.pid and health(state):
            print(f"CourseKit started (PID {process.pid}): http://127.0.0.1:8000/ serving {root}")
            return 0
        if process.poll() is not None:
            print(f'CourseKit failed to start. Check {LOG}', file=sys.stderr)
            return 1
        time.sleep(0.1)
    print(f'CourseKit did not become ready. Check {LOG}', file=sys.stderr)
    return 1


def stop():
    state = read_state()
    if not state:
        print('No CourseKit server state found; nothing to stop.')
        return 0
    if not health(state):
        print('No responding CourseKit server; removing stale state.')
        STATE.unlink(missing_ok=True)
        return 0
    try:
        request = Request(
            f"http://{state['host']}:{state['port']}/__coursekit/shutdown",
            data=b'', method='POST', headers={'X-CourseKit-Token': state['token']},
        )
        with urlopen(request, timeout=3) as response:
            if response.status != 200:
                raise RuntimeError('Shutdown request rejected')
    except (OSError, URLError, KeyError, RuntimeError) as exc:
        print(f'Unable to stop CourseKit: {exc}', file=sys.stderr)
        return 1
    for _ in range(50):
        if not health(state):
            print('CourseKit stopped.')
            return 0
        time.sleep(0.1)
    print('Shutdown requested, but server is still responding.', file=sys.stderr)
    return 1


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['start', 'stop', 'status'])
    parser.add_argument('--root', type=Path, default=ROOT, help='Fallback directory served (start only)')
    parser.add_argument('--framework', type=Path, help='Mount framework at /framework/')
    parser.add_argument('--course', type=Path, action='append', default=[],
                        help='Course root directory; repeat to mount multiple courses')
    parser.add_argument('--course-name', action='append', default=[],
                        help='Virtual course name; provide one per --course if used')
    args = parser.parse_args()
    sys.exit(start(args.root, args.framework, args.course, args.course_name) if args.action == 'start' else stop() if args.action == 'stop' else status())
