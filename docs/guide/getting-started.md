# Local setup

1. Clone the `dev` branch of `https://github.com/aznam/brightspace-coursekit` or extract the repository.
2. Run `start-server.bat`, `start-server.ps1`, or `./start-server.sh` from the repository root (Python 3 is required).
3. Open `http://127.0.0.1:8000/example-course/index.html`.
4. Copy `example-course/` to create your course. Edit `course.json`, the three configuration paths in `bootstrap-config.js`, and your semantic files under `content/`.

The host page loads `<script src="bootstrap-config.js" data-content="content/overview.xml"></script>` and mounts the result in `#coursekit-root`. The HTML host does not define the layout.

To run this documentation separately:

```bash
cd docs
npm install
npm run docs:dev
```

The repository’s existing server scripts serve the CourseKit example, not the VitePress documentation.