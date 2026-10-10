#!/usr/bin/env python3
"""Start/stop CourseKit HTTP server independently from the invoking terminal."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.error import URLError, HTTPError
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
                and identity.get('root') == str(ROOT))


def status():
    state = read_state()
    if not state:
        print(f'No tracked CourseKit process for {ROOT}')
    else:
        print(f'Tracked server: PID={state.get("pid")}, root={ROOT}')
    identity = server_identity({'host': '127.0.0.1', 'port': 8000})
    if identity:
        print(f'Port 8000 server: PID={identity.get("pid")}, root={identity.get("root")}')
        if identity.get('root') != str(ROOT):
            print('WARNING: port 8000 belongs to another CourseKit directory.')
    else:
        print('Port 8000 does not respond as the diagnostic CourseKit server; it may be another process.')
    return 0


def start():
    previous = read_state()
    if previous and health(previous):
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

    command = [sys.executable, str(SERVER), '--host', '127.0.0.1', '--port', '8000']
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
            print(f"CourseKit started (PID {process.pid}): http://127.0.0.1:8000/")
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
    args = parser.parse_args()
    sys.exit(start() if args.action == 'start' else stop() if args.action == 'stop' else status())
