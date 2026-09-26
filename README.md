# Brightspace HTML Kit

A lightweight, dependency-free framework for building consistent, responsive course pages hosted in D2L Brightspace.

Developed at the School of Computer Science, University of Windsor.

## Why this kit

Brightspace lets instructors upload full HTML pages into a course's content folder (`/content/enforced/<course-id>/`). In practice, each page ends up carrying its own copy of the styles, layout, and scripts. Over a semester, pages drift apart visually, small fixes have to be repeated across dozens of files, and moving a course to a new offering means editing every page by hand.

This kit separates what is shared from what is specific:

- **One shared framework** (CSS + JS) defines the layout, components, and behaviours for every course.
- **One configuration file per course** sets the identity: code, title, colours, font, hero images, emojis, sprites.
- **Each HTML page contains only its own content.** The navigation bar, hero banner, and interactive behaviours are injected at runtime.

The result: zero style discrepancy between pages, a new course set up by editing a single file, and pages that can be written (or generated) by focusing on content alone.

The framework is modular by design and produces HTML content fully compatible with Brightspace. It also provides tools to generate HTML descriptors for Brightspace sections that do not accept full HTML pages, while keeping the same visual style as the main course content.

## Features

- Sticky navigation bar with course code, page title, section dropdown, and module label
- Hero banner with course-level defaults, overridable per page
- Two-column layout (content + sidebar) with a single-column variant
- Mobile-aware sidebar ordering (cards before or after the main content), driven by DOM order with no JavaScript
- Optional summary box and inline table of contents
- Automatic section numbering across headings, ToC, and navbar menu
- Six boxnote styles (info, warning, success, error, dark, neutral) with a float-right modifier
- Hoverable terms with explanation panels, clamped to the viewport, usable on touch devices
- Accordions based on native `<details>`
- Sidebar cards: generic, key/value facts, resource links
- Sprite sheet support for pixel-art icons with automatic aspect ratio
- Portable asset references (`data-asset`, `data-bg-asset`) so pages survive course copies
- No horizontal scrolling at any breakpoint

## Repository structure

```
bootstrap.js           Locates the framework and the course configuration
brightspace/
├── assets/            Page images (body.avif, hero.avif, sprites/…)
├── fonts/             Local fonts (optional)
├── scripts/
│   ├── course-config.js   Course-specific settings (the only file to edit per course)
│   └── framework.js       Shared behaviours (do not modify)
└── styles/
    └── framework.css      Shared styles (do not modify)
attachments/           Downloadable course documents
template.html          Starting point for a standard page
FRAMEWORK.md           Full reference guide
```

## Getting started

### Bootstrap configuration

Each deployment uses two bootstrap files:

- `bootstrap-config.js` — deployment-specific paths;
- `bootstrap.js` — generic loader.

Configure deployment paths in `bootstrap-config.js`:

```js
window.BRIGHTSPACE_BOOTSTRAP_CONFIG = {
  frameworkBase: './brightspace',
  courseConfig: './brightspace/scripts/course-config.js',

  moduleRegistries: [
    './brightspace/modules.js'
  ]
};
```

Use these fields as follows:

- `frameworkBase` — path to the shared `brightspace` framework folder. Change this when the framework is stored somewhere else, for example in a shared development directory.
- `courseConfig` — path to the `course-config.js` file for the course using the framework.
- `moduleRegistries` — list of additional module registry files used by the course or project. Use `[]` if no extra modules are needed.

Paths are written relative to `bootstrap.js`.

### Minimal page

```html
<div class="edtech-wrapper">
  <div id="fw-sticky-bar"></div>
  <div id="fw-hero"></div>

  <div class="edtech-container no-sidebar">
    <main class="main-content">
      <h2 id="section-intro">Introduction</h2>
      <p>Page content.</p>
    </main>
  </div>
</div>

<script>
  window.PAGE_CONFIG = {
    pageShortTitle: 'Welcome',
    moduleTitle: 'Getting Started',
    navSections: [
      { id: 'section-intro', label: 'Introduction' }
    ],
  };
</script>

<script src="bootstrap-config.js"></script>

<script
  src="bootstrap.js"
  data-page-type="course-page">
</script>
```
Each page declares its base page type through `data-page-type`. Pages may request optional features with `data-modules`:

```html
<script src="bootstrap-config.js"></script>

<script
  src="bootstrap.js"
  data-page-type="assignment-page"
  data-modules="quest">
</script>
```

See [`FRAMEWORK.md`](FRAMEWORK.md) for page types, module registration, available modules, configuration objects, components, and advanced usage.


## Templates

Ready-to-use HTML templates are provided to help create course content.

They include examples for the supported page types and already contain the expected framework structure, configuration blocks, optional page-specific CSS, and before/after framework script hooks.

Use the template closest to the content you want to create, then adapt its configuration and page content.

See `FRAMEWORK.md` for the available page types, optional modules, and configuration options.

## Customisation

| Level | Mechanism |
| --- | --- |
| Deployment paths | `bootstrap-config.js` |
| Page type | `data-page-type` |
| Optional features | `data-modules` |
| Course | `course-config.js` |
| Page | `window.PAGE_CONFIG` |
| Assignment | `window.ASSIGNMENT_CONFIG` |
| Document | `window.DOCUMENT_CONFIG` |

Shared framework CSS and JavaScript files are not edited per course.

## Documentation

`FRAMEWORK.md` is the complete reference: component markup, configuration options, responsive behaviour, and a generation checklist. It is also written to serve as context for LLM-assisted page generation.

## Compatibility

- Full pages target Brightspace hosted HTML content (pages with `<head>`, scripts, and stylesheets).
- Section descriptors target the sanitised Brightspace editor, which strips scripts and CSS variables; they reproduce the framework's look with inline styles only.
- Plain ES5 JavaScript, no build step, no dependencies. Tabler Icons and Google Fonts are optional CDN includes.

## Author

Aznam Yacoub, School of Computer Science, University of Windsor.

## License

Copyright © 2026 Aznam Yacoub.

This project is licensed under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0). See [`LICENSE`](LICENSE) for the full text.

You may use, modify, and redistribute this software for any noncommercial purpose. Commercial use is not permitted.

Any copy or derivative work must include the license terms (or their URL) and the following notice:

Required Notice: Copyright © 2026 Aznam Yacoub (https://github.com/aznam/brigthspace-coursekit)
