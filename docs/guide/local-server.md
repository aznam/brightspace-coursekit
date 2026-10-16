# Local development server

CourseKit includes a **local Python HTTP server** for previewing courses in a browser. It serves HTML, XML, JSON, XSD, XSLT, JavaScript, CSS and other resources. The server is distinct from the VitePress documentation development server and is **not deployed to Brightspace**.

Two Python programs implement the server:

- `tools/local/dev-server/manage_server.py` starts, checks, and stops a detached process.
- `tools/local/dev-server/dev_server.py` serves files and implements virtual mounts, diagnostics, and controlled shutdown.

Only the Python standard library is used by these two programs. Python 3 is required; the code uses `Path.is_relative_to()`, which requires **Python 3.9 or later**.

## Quick start

From the repository root, use the wrapper matching your operating system:

::: code-group

```bat [Windows CMD]
start-server.bat
```

```powershell [Windows PowerShell]
.\start-server.ps1
```

```sh [Linux / macOS]
./start-server.sh
```

:::

The controller defaults to **`127.0.0.1:8000`**. With the repository root as the document root, the example course can be opened at:

```text
http://127.0.0.1:8000/example-course/index.html
```

The Python controller can also be used directly:

```sh
python tools/local/dev-server/manage_server.py start
python tools/local/dev-server/manage_server.py status
python tools/local/dev-server/manage_server.py stop
```

On systems using `python3` instead of `python`, substitute `python3`.

## Commands and options

`manage_server.py` accepts the following action and options:

| Command or option | Meaning |
| --- | --- |
| `start` | Start the server as a detached process; if an equivalent tracked server is already healthy, reuse it |
| `stop` | Stop the tracked server by calling its authenticated local shutdown endpoint |
| `status` | Report the tracked process and inspect the CourseKit identity on port 8000 |
| `--root <directory>` | Fallback document root; defaults to the repository root |
| `--framework <directory>` | Mount that physical directory at `/framework/` |
| `--course <directory>` | Mount that physical directory at `/courses/<course-name>/` |
| `--course-name <name>` | Override the URL segment used with `--course`; by default it is the course directory name |

The `--root`, `--framework`, `--course`, and `--course-name` arguments are for `start`. The controller uses **fixed host `127.0.0.1` and port `8000`**: it does not expose `--host` or `--port` arguments. The underlying `dev_server.py` does expose these arguments, but it is intended to be managed through the controller.

For example, to preview a course stored outside the repository while keeping the framework in the repository:

```sh
python tools/local/dev-server/manage_server.py start \
  --root . \
  --framework ./framework \
  --course ../my-course \
  --course-name my-course
```

This maps `/framework/` to `./framework/` and `/courses/my-course/` to `../my-course/` (both resolved to absolute physical paths).

> [!IMPORTANT]
> When using explicit mounts, make sure the paths in the course's `bootstrap-config.js` resolve to the corresponding **HTTP URLs**. Virtual mount paths are server routes, not automatic rewrites of the bootstrap configuration.

## Request resolution and virtual mounts

The server evaluates configured mounts before falling back to the document root. A mount maps an HTTP URL prefix to a physical directory:

| URL prefix | Physical source |
| --- | --- |
| `/framework/` | Value of `--framework`, if supplied |
| `/courses/<course-name>/` | Value of `--course`, if supplied |
| All other paths | Value of `--root` |

If mounts are present, unmounted `/framework` or `/courses` routes are blocked rather than being served accidentally from a matching folder under the fallback root. Requests containing decoded `.` or `..` segments, backslashes or NUL characters are rejected through an invalid-path target; resolved mounted paths are also confined to their physical mount directory.

Mounts are **optional**. Without them, the repository root is served normally, so the example course is accessible at `/example-course/index.html`.

## Process lifecycle and diagnostics

The controller starts a **detached process**, so closing the invoking terminal does not by itself stop the server. It writes process output to `.coursekit-server.log` and tracks the process in `.coursekit-server.json`, both at the repository root.

When starting, the controller:

1. Checks the supplied directories and course name.
2. Reads any previous state and verifies that the tracked process responds as CourseKit with the expected PID, root, and mounts.
3. Reuses a healthy instance with the same configuration, but requires the current server to be stopped before starting with different mounts.
4. Refuses to start if another identifiable CourseKit instance already owns port 8000.
5. Removes stale tracked state and starts the server.
6. Waits for the server's authenticated identity checks to succeed.

The HTTP server publishes two internal endpoints:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/__coursekit/health` | GET | Returns JSON with application identity, PID, root, mounts, host, port and server version marker |
| `/__coursekit/shutdown` | POST | Requests graceful shutdown; only localhost with the correct per-process token is accepted |

The shutdown token is stored in the state file; the server creates that file with restrictive file permissions (`0600` on platforms honoring POSIX permissions). Avoid committing or publishing `.coursekit-server.json` because it contains the shutdown token.

To check the current process:

```sh
python tools/local/dev-server/manage_server.py status
```

To stop it, use a wrapper or the controller:

::: code-group

```bat [Windows CMD]
stop-server.bat
```

```powershell [Windows PowerShell]
.\stop-server.ps1
```

```sh [Linux / macOS]
./stop-server.sh
```

:::

```sh
python tools/local/dev-server/manage_server.py stop
```

`stop` does not kill an arbitrary process occupying port 8000: it checks the recorded CourseKit identity and uses the authenticated shutdown endpoint. Stale state is removed when the tracked server is no longer responding.

## Development behaviour

- **No HTTP caching:** all responses receive `Cache-Control: no-store, no-cache, must-revalidate`, `Pragma: no-cache`, and `Expires: 0` headers.
- **Resource MIME types:** `.js` and `.mjs` use `text/javascript`; `.wasm` uses `application/wasm`.
- **Concurrent requests:** the server uses Python's `ThreadingHTTPServer`.
- **No application-side rendering:** semantic XML validation/transformation and component rendering remain the responsibility of the **browser-side CourseKit runtime**.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Startup failure | `.coursekit-server.log` in the repository root |
| Port 8000 already in use | Run `manage_server.py status`; stop the owner before starting another instance |
| Server already running with different mounts | Stop the existing server and start it again with the desired arguments |
| HTTP 404 under `/framework/` or `/courses/` | Confirm the mount arguments and the course's `bootstrap-config.js` paths |
| Resource changes do not appear | Inspect browser network requests; the local server disables HTTP caching |
| Stale tracked state | The controller removes stale state during `start` or `stop` |

## Distinction from VitePress

The CourseKit Python server previews **course pages**. VitePress is used to build and preview the **documentation website**; its development command is `npm run docs:dev`. They are independent servers with different purposes.

See [Getting started](/guide/getting-started) and [Bootstrap configuration](/guide/bootstrap).
