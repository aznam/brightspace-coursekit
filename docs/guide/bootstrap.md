# Bootstrap configuration

The course-local `bootstrap-config.js` is the deployment boundary. **Only edit its three USER CONFIGURATION constants.**

```js
const frameworkPath = '../framework/';
const courseRoot = './';
const courseConfig = 'course.json';
```

| Setting | Base for resolution | Purpose |
| --- | --- | --- |
| `frameworkPath` | URL of `bootstrap-config.js` | Shared framework directory containing `bootstrap.js` |
| `courseRoot` | URL of `bootstrap-config.js` | Explicit course directory; not inferred from `siteId` |
| `courseConfig` | Resolved `courseRoot` | Course JSON configuration |

The unchanged initialization code reads the current script URL, loads `framework/bootstrap.js`, and passes `data-course-root`, `data-course-config`, and `data-content` on the generated loader script. The HTML host supplies `data-content`.

```html
<script src="./bootstrap-config.js" data-content="content/overview.xml"></script>
<div id="coursekit-root"></div>
```

`data-content` is resolved by the content resource path rules; it is independent of the bootstrap script location. **Do not modify the initialization IIFE** to configure deployments. For Brightspace, explicitly configure `courseRoot` for the deployed course directory.

See [managers](../architecture/managers.md) for what `bootstrap.js` initializes.