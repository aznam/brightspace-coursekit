# Brightspace Course HTML Kit — Reference Guide & Architecture Manual

> Comprehensive technical reference for creating, configuring, and extending Brightspace course pages, interactive assignments, printable documents, and custom modules.

# 1. Architecture & Page Lifecycle

The framework uses an automated loader (**Bootstrap**) that eliminates manual script and stylesheet management. Instead of hardcoding `<link>` and `<script>` tags for each framework component, pages declare their requirements through `bootstrap.js`.

---
## 1.1 Placement & Deployment Configuration

### Recommended File Placement
`bootstrap.js` and `bootstrap-config.js` **should be placed at the root of the course**, in the same directory as your HTML pages:

```text
/content/enforced/<course-site-id>/
├── bootstrap-config.js   ← Alongside pages (recommended)
├── bootstrap.js          ← Alongside pages (recommended)
├── page-overview.html    ← Root page
├── page-syllabus.html    ← Root page
└── brightspace/          ← Framework subfolder
```

### Writing `bootstrap-config.js`
This file contains deployment-specific paths only. Unless stated otherwise, all paths are **resolved relative to `bootstrap.js`**:

```javascript
/*
 * BRIGHTSPACE BOOTSTRAP — DEPLOYMENT CONFIGURATION
 * ------------------------------------------------
 * This file contains deployment-specific paths only.
 *
 * Unless stated otherwise, paths are resolved relative to bootstrap.js.
 */
window.BRIGHTSPACE_BOOTSTRAP_CONFIG = {

  /*
   * Root directory of the shared framework.
   *
   * The bootstrap normalizes this value as a DIRECTORY, so both
   * "./brightspace" and "./brightspace/" are valid.
   */
  frameworkBase: './brightspace',

  /*
   * Course-specific configuration.
   * Resolved relative to bootstrap.js.
   */
  courseConfig: './brightspace/scripts/course-config.js',

  /*
   * Additional module registries.
   * Resolved relative to bootstrap.js.
   *
   * Use [] when the deployment has no additional registries.
   */
  moduleRegistries: []
};
```

* **`frameworkBase`**: Root directory of the framework.
* **`courseConfig`**: Path to the course-level configuration script (`course-config.js`). Should be placed in `<frameworkBase>/scripts` (recommended).
* **`moduleRegistries`**: Array of paths pointing to optional custom module registry files (e.g., `['./brightspace/modules.js']`). Set to `[]` if the course does not use custom module registries.

---

## 1.2 The Bootstrap Pipeline

When a page loads `bootstrap-config.js` and `bootstrap.js`, the loader executes a deterministic pipeline:

```text
1. Parse inline page configs (e.g., PAGE_CONFIG)
                ↓
2. Load framework registry (framework-registry.js) + custom module registries
                ↓
3. Inject stylesheets (Page-type CSS + Optional module CSS)
                ↓
4. Load course configuration (course-config.js) & wait for DOMContentLoaded
                ↓
5. Promote page styles (<style data-page-style> moved to the end of <head>)
                ↓
6. Execute beforeFramework callbacks
                ↓
7. Load base page-type scripts sequentially
                ↓
8. Load optional module scripts sequentially
                ↓
9. Execute afterFramework callbacks
                ↓
10. Dispatch window event: brightspace:framework-ready
```

---

## 1.2 Page HTML Template

Here is the standard anatomy of a framework web page (`course-page`). Notice that no `<title>` tag is needed: the framework derives and sets the browser title automatically at runtime.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 1. Page-specific CSS overrides (optional) -->
  <style data-page-style>
    /* Local page overrides here */
  </style>

  <!-- 
    2. Bootstrap loader
    NOTE: If bootstrap-config.js or bootstrap.js are not stored in the 
    same folder as this HTML file (e.g. nested in a subfolder), update 
    their relative "src" paths accordingly (e.g. "../bootstrap.js").
  -->
  <script src="bootstrap-config.js"></script>
  <script
    src="bootstrap.js"
    data-page-type="course-page"
    data-modules="tabler-icons">
  </script>
</head>
<body>

  <div class="edtech-wrapper">
    <!-- Framework containers populated automatically at runtime -->
    <div id="fw-sticky-bar"></div>
    <div id="fw-hero"></div>

    <div class="edtech-container">

      <!-- Sidebar Before (Desktop: top right | Mobile: before main) -->
      <aside class="sidebar-before">
        <div class="sidebar-card">
          <h3>📋 Key Info</h3>
          <p>Contextual notice.</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <h2 id="sec-intro">Introduction</h2>
        <p>Page content...</p>

        <h2 id="sec-patterns">Architectural Patterns</h2>
        <p>Page content...</p>
      </main>

      <!-- Sidebar After (Desktop: bottom right | Mobile: after main) -->
      <aside class="sidebar-after">
        <div class="sidebar-card">
          <h3>🔗 Resources</h3>
          <a href="#" target="_top" class="resource-link">Course Syllabus</a>
        </div>
      </aside>

    </div>
  </div>

  <!-- 3. Inline page configuration -->
  <script>
    window.PAGE_CONFIG = {
      pageShortTitle: 'Patterns',
      moduleTitle: 'Module 1 — Architecture',
      autoNumberSections: true,
      navSections: [
        { id: 'sec-intro',    label: 'Introduction' },
        { id: 'sec-patterns', label: 'Architectural Patterns' }
      ]
    };
  </script>

</body>
</html>
```

---

## 1.3 Automatic Browser Title

Templates do not need a `<title>` tag in the `<head>`. At initialization, `framework.js` automatically constructs `document.title`:

$$\text{document.title} = \text{COURSE\_CONFIG.courseCode} + \text{" - "} + \text{Page Title}$$

The page title segment uses the following fallback chain:
1. `PAGE_CONFIG.pageShortTitle`
2. `PAGE_CONFIG.heroTitle`
3. `COURSE_CONFIG.heroTitle`

**Example:**
With `courseCode: 'COMP-8117'` and `pageShortTitle: 'Patterns'`, the browser title becomes:
```text
COMP-8117 - Patterns
```

---

## 1.4 Page Types (`data-page-type`)

The `data-page-type` attribute instructs `bootstrap.js` which stylesheets and runtime scripts to import:

| `data-page-type` | Use Case | CSS Loaded Automatically | Scripts Loaded Automatically |
| :--- | :--- | :--- | :--- |
| `course-page` *(default)* | Standard content page | `framework.css` | `framework.js` |
| `assignment-page` | Interactive online assignment | `framework.css`; `assignment.css` | `framework.js`; `assignment.js` |
| `printable-document` | Paginated US Letter document | `document.css` | `document.js` |
| `printable-assignment` | Printable exam or problem set | `document.css`; `written-assignment.css` | `written-assignment.js`; `document.js` |

If omitted, `data-page-type` defaults to `course-page`.

---

## 1.5 Page-Specific Styles (`data-page-style`)

To prevent specificity conflicts and avoid resorting to `!important`, tag any page-level style block with `data-page-style`:

```html
<style data-page-style>
  .main-content h2 {
    color: var(--accent);
  }
</style>
```

External stylesheets can also be tagged:

```html
<link rel="stylesheet" href="page-extra.css" data-page-style>
```

### Cascade Enforcement
The bootstrap collects all elements marked with `data-page-style` and moves them to the very end of `<head>` once all framework and module stylesheets are loaded. 

This guarantees the natural CSS cascade order:
$$\text{Framework CSS} \longrightarrow \text{Optional Module CSS} \longrightarrow \text{Page CSS}$$

At equal selector specificity, page styles always win naturally.

---

## 1.6 Writing Page Scripts & Lifecycle Hooks

Configurations like `window.PAGE_CONFIG` or `window.ASSIGNMENT_CONFIG` are placed directly in `<script>` tags in the HTML. Because `bootstrap.js` defers the runtime until the DOM and configuration scripts are parsed, these objects are available when the framework initializes.

When custom logic must run at specific stages of initialization, use the lifecycle API:

### 1. `BRIGHTSPACE.beforeFramework(callback)`
Runs after the DOM and configurations are parsed, but **before** `framework.js` (or the page-type runtime) executes. Use this hook to dynamically modify configurations or pre-process DOM elements before UI rendering:

```html
<script>
  BRIGHTSPACE.beforeFramework(function (runtime) {
    if (window.location.search.includes('preview=true')) {
      window.PAGE_CONFIG.moduleTitle += ' (Preview)';
    }
  });
</script>
```

### 2. `BRIGHTSPACE.afterFramework(callback)`
Runs **after** the base page-type scripts and all requested optional modules have finished running. If registered after the framework is already ready, the callback executes immediately:

```html
<script>
  BRIGHTSPACE.afterFramework(function (runtime) {
    console.log('Framework loaded successfully for:', runtime.pageType);
    console.log('Active modules:', runtime.modules);
  });
</script>
```

### 3. Ready Event Listener
You can also listen for the standard CustomEvent emitted on `window`:

```html
<script>
  window.addEventListener('brightspace:framework-ready', function (event) {
    console.log('Bootstrap base URL:', event.detail.bootstrapBase);
  });
</script>
```

The `runtime` object provided to callbacks and event details includes:
* `pageType`: The active page type.
* `modules`: Array of successfully resolved and loaded module names.
* `frameworkBase`: The resolved directory path to the shared framework.
* `courseConfig`: The resolved path to `course-config.js`.

---

# 2. Global Course Configuration (`course-config.js`)

A single configuration file customizes identity, branding, assets, typography, and metadata for an entire course. It is located at `brightspace/scripts/course-config.js` and wrapped in an IIFE to scope path calculations.

---

## 2.1 The Single Line to Change for a New Course

When creating a new course or duplicating an existing one, only **one single variable** must be edited:

```javascript
var siteId = '227327-COMP8117-1-R-2026F';
```

Replace this string with the Brightspace site ID of the new course. All filesystem paths are derived automatically:

| Variable | Resulting Absolute Path |
| :--- | :--- |
| `root` | `/content/enforced/<siteId>` |
| `brightspace` | `/content/enforced/<siteId>/brightspace` |
| `paths.assets` | `/content/enforced/<siteId>/brightspace/assets` |
| `paths.fonts` | `/content/enforced/<siteId>/brightspace/fonts` |
| `paths.scripts` | `/content/enforced/<siteId>/brightspace/scripts` |
| `paths.styles` | `/content/enforced/<siteId>/brightspace/styles` |
| `paths.attachments` | `/content/enforced/<siteId>/attachments` |

These paths are exposed on `window.COURSE_CONFIG.paths` for use in custom scripts.

---

## 2.2 Course Identity, Term & Institutional Metadata

```javascript
window.COURSE_CONFIG = {

  /* ── Course Identity ─────────────────────────────────── */
  courseCode:   'COMP-8117',
  courseTitle:  'Applied Software Engineering',
  programName:  'Master of Applied Computing',

  /* ── Term & Section ──────────────────────────────────── */
  term:         'Fall',
  year:         2026,
  section:      '1',

  /* ── Instructor ──────────────────────────────────────── */
  instructor: {
    name:  'Aznam Yacoub, PhD',
    title: 'Assistant Professor',
  },

  /* ── Institution & Logo ──────────────────────────────── */
  institution: {
    name:       'University of Windsor',
    faculty:    'Faculty of Science',
    department: 'School of Computer Science',
    logo:       'uwindsor-logo.svg', // Located in brightspace/assets/
  },

  /* ── Default Hero Content (Web Pages) ─────────────────── */
  heroTitle:    'Applied Software Engineering',
  heroSubtitle: 'Engineering complex, robust software systems with modern workflows.',

  // ... (images, palette, fonts, emojis, sprites)
};
```

* **`heroTitle` & `heroSubtitle`**: Default titles displayed in the hero banner of all web pages. Individual pages can override these via `PAGE_CONFIG.heroTitle` / `PAGE_CONFIG.heroSubtitle`.
* **Institutional metadata (`term`, `year`, `instructor`, `institution`)**: Shared by web pages and used automatically by printable documents for cover pages, running headers, and footers.

---

## 2.3 Images & Assets (`data-asset` and `data-bg-asset`)

### Global Background Images
Set in `course-config.js` and resolved automatically using the internal `assets` path:

```javascript
backgroundImage: assets + '/body.avif',   // Full-page background
heroImage:       assets + '/hero.avif',   // Hero banner background
```

Both images are layered beneath semi-opaque gradients defined in `framework.css`. Recommended formats: `.avif` or `.webp` (fallback: `.jpg`).

### Inserting Images in HTML Pages (`data-asset`)
**NEVER use the standard `src="..."` attribute** to reference images stored in Brightspace. Hardcoding `/content/enforced/...` paths will break when the course is cloned or exported to another semester.

Instead, use `data-asset` with the filename relative to `brightspace/assets/`:

```html
<!-- RECOMMENDED -->
<img data-asset="architecture-model.png" alt="Architecture Model">

<!-- STRICTLY PROHIBITED (Hardcoded path will break on course copy) -->
<img src="/content/enforced/227327-COMP8117/brightspace/assets/architecture-model.png">
```

### CSS Background Images on HTML Elements (`data-bg-asset`)
To apply a course asset as a background image on an arbitrary element, attach `data-bg-asset="<filename>"`. The framework resolves the absolute URL and injects it into the element's `--asset-url` CSS variable:

```html
<div class="banner-card" data-bg-asset="banner.jpg">
  <h3>Featured Case Study</h3>
</div>
```

```css
.banner-card {
  /* Mix the custom property with overlay gradients or filters */
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              var(--asset-url) center/cover no-repeat;
}
```

---

## 2.4 Color Palette

The framework provides a default terracotta/slate theme driven by 6 customizable CSS custom properties. Overrides are declared in the `palette` object of `course-config.js`. Leave `{}` empty to retain the framework defaults.

```javascript
palette: {
  'accent':       '#c2410c',  // Primary color: links, focus outlines, strong borders
  'accent-light': '#ffedd5',  // Light accent background: active hover states, badges
  'structure':    '#1e293b',  // Dark slate: navbar, card tops, table headers
  'text-main':    '#334155',  // Slate: standard body text
  'text-dark':    '#0f172a',  // Near-black: headings, high-emphasis text
  'border':       '#e2e8f0',  // Light gray: dividers, subtle card borders
},
```

### Framework Default Values

| Key | CSS Variable | Default Color | Role |
| :--- | :--- | :--- | :--- |
| `accent` | `--accent` | `#c2410c` (Terracotta) | Primary brand accent, links, buttons |
| `accent-light` | `--accent-light` | `#ffedd5` (Pale orange) | Subtle highlight backgrounds, pill badges |
| `structure` | `--structure` | `#1e293b` (Dark slate) | Sticky navbar, table header rows |
| `text-main` | `--text-main` | `#334155` (Slate) | Paragraphs, regular content text |
| `text-dark` | `--text-dark` | `#0f172a` (Deep slate) | `<h1>` through `<h3>` headings |
| `border` | `--border` | `#e2e8f0` (Light gray) | Section dividers, card boundaries |

> **Note:** Only the keys explicitly defined in `palette` are overridden. Omitted keys retain their framework defaults.

---

## 2.5 Typography & Web Fonts

Configure one of three font loading modes:

### Mode A — Google Fonts
```javascript
fontGoogleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
fontFile:      null,
fontFamily:    'Inter',
```

### Mode B — Local Web Font (in `brightspace/fonts/`)
```javascript
fontGoogleUrl: null,
fontFile:      brightspace + '/fonts/CustomFont.woff2', // Uses internal brightspace path
fontFormat:    'woff2', // 'woff2' | 'woff' | 'truetype'
fontFamily:    'CustomFont',
```
The framework injects the corresponding `@font-face` rule with `font-display: swap`.

### Mode C — System Font Stack (Default)
```javascript
fontGoogleUrl: null,
fontFile:      null,
fontFamily:    null, // Or a custom stack like '"Segoe UI", Arial, sans-serif'
```
When all values are `null`, the framework falls back to the native OS font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`).

---

## 2.6 Emojis

The `emojis` dictionary allows each course to standardize or customize visual markers across its materials:

```javascript
emojis: {
  tip:       '💡',
  warning:   '⚠️',
  note:      '📝',
  important: '🔑',
  error:     '🚨',
  success:   '✅',
  info:      'ℹ️',
}
```

### Usage in HTML (`data-emoji`)
Use an `<i>` tag with the `data-emoji` attribute pointing to any key defined in `COURSE_CONFIG.emojis`. Always add `aria-hidden="true"`:

```html
<div class="boxnote boxnote-warning">
  <div class="boxnote-title">
    <i data-emoji="warning" aria-hidden="true"></i> Important Precondition
  </div>
  <p>Complete Lab 1 before starting this module.</p>
</div>
```

```html
<!-- Inline within a paragraph -->
<p>
  <i data-emoji="tip" aria-hidden="true"></i> 
  <strong>Pro-tip:</strong> Run unit tests before committing your code.
</p>
```

*(You can also access emoji characters programmatically in custom scripts via `window.COURSE_CONFIG.emojis.<key>`).*

---

# 3. Standard Web Pages (`course-page`) & Core Components

Standard web pages display instructional course content in an accessible, responsive two-column layout (main content + sidebar). They rely on `PAGE_CONFIG` to populate the sticky top navigation bar and hero header.

---

## 3.1 Page Configuration (`PAGE_CONFIG`)

Every standard page defines `window.PAGE_CONFIG` in an inline `<script>` tag. This object configures the page title, navigation dropdown, and section numbering:

```html
<script>
  window.PAGE_CONFIG = {

    // Short title displayed in the sticky navbar (2–4 words)
    pageShortTitle: 'Architectural Patterns',

    // Unit, module, or chapter title shown on the right side of the navbar
    moduleTitle: 'Module 1',

    // Overrides COURSE_CONFIG.heroTitle / heroSubtitle for this page only
    // Set to null to inherit default course-level hero text
    heroTitle:    null,
    heroSubtitle: null,

    // When true, automatically prefixes '1. ', '2. ', etc.
    autoNumberSections: true,

    // Tracked sections listed in the dropdown navbar menu
    // MUST match the id="..." attributes of the <h2> headings in the page
    navSections: [
      { id: 'section-context',  label: 'Context & Motivation' },
      { id: 'section-patterns', label: 'Core Patterns' },
      { id: 'section-practice', label: 'Hands-on Application' },
      { id: 'section-next',     label: "What's Next?" },
    ],

  };
</script>
```

---

## 3.2 Automated Shell Injections

At initialization, `framework.js` inspects two empty placeholder `<div>` tags in the page and constructs the interface shells automatically:

### 1. Sticky Navigation Bar (`#fw-sticky-bar`)
```html
<div id="fw-sticky-bar"></div>
```
The framework populates this container with:
* The course code (`COURSE_CONFIG.courseCode`).
* The page short title (`PAGE_CONFIG.pageShortTitle`).
* A **Navigate ▾** dropdown menu populated from `PAGE_CONFIG.navSections` (activated via hover on desktop and click/tap on touch devices).
* The module title (`PAGE_CONFIG.moduleTitle`) anchored on the right.

### 2. Hero Header (`#fw-hero`)
```html
<div id="fw-hero"></div>
```
The framework populates this container with the page title `<h1>` and subtitle `<p>` (falling back to `COURSE_CONFIG.heroTitle` / `heroSubtitle` if `PAGE_CONFIG` values are `null`).

---

## 3.3 Section Auto-Numbering (`autoNumberSections`)

When `autoNumberSections: true` is set in `PAGE_CONFIG`:
1. The framework increments a sequential counter (`1. `, `2. `, etc.).
2. The prefix is dynamically inserted at the beginning of each `<h2>` element whose `id` matches `navSections`.
3. The prefix is automatically prepended to the matching links in the dropdown menu.
4. The prefix is dynamically added to the matching links in the inline table of contents (`.inline-toc`).

> **Rule:** Never hardcode numbers into your `<h2>` tags or `.inline-toc` markup (e.g., write `<h2>Core Patterns</h2>`, NOT `<h2>1. Core Patterns</h2>`).

---

## 3.4 Responsive Layout & Breakpoints

The layout adapts across screen sizes using CSS Grid and flexbox without JavaScript reflows:

* **Desktop (> 1000px):** Two-column layout. Both `<aside class="sidebar-before">` and `<aside class="sidebar-after">` stack vertically in the right-hand column alongside `.main-content`.
* **Tablet / Mobile (≤ 1000px):** Single-column stacked layout. Elements follow pure DOM order:
  $$\text{sidebar-before} \longrightarrow \text{main-content} \longrightarrow \text{sidebar-after}$$
* **Narrow Mobile (≤ 600px):** Hero padding contracts, and hoverpanels expand to full viewport width.
* **Single Column Mode:** To disable the sidebar entirely and give `.main-content` full width, apply the `.no-sidebar` modifier to the main container:
  ```html
  <div class="edtech-container no-sidebar">
    <main class="main-content">...</main>
  </div>
  ```

---

## 3.5 Core Web Components Library

### 1. Summary Box (`summary-box`)
Placed directly inside `.edtech-container`, **immediately before** `<main class="main-content">`. Used for prerequisite notices or core takeaways:

```html
<div class="summary-box">
  <div class="summary-box-title">📋 Takeaways Before Starting</div>
  <p>This module introduces three fundamental structural design patterns used in enterprise systems.</p>
  <p>Ensure you have completed the environment setup from Lab 0 before proceeding.</p>
</div>
```

---

### 2. Inline Table of Contents (`inline-toc`)
The framework generates the inline table of contents **automatically**. 

Simply place an empty `<nav class="inline-toc"></nav>` element as the **first child** of `<main class="main-content">`:

```html
<main class="main-content">
  <!-- The framework automatically populates this container -->
  <nav class="inline-toc"></nav>

  <h2 id="section-context">Context & Motivation</h2>
  <p>Section content...</p>
  ...
</main>
```

#### How it Works:
* At initialization, the framework checks if `<nav class="inline-toc">` exists.
* It automatically injects the **"On this page:"** label, builds the anchor links matching `PAGE_CONFIG.navSections`, and places bullet separators (`•`) between them.
* If `autoNumberSections: true` is enabled, the section numbers (`1. `, `2. `, etc.) are prepended to the generated links automatically.

---

### 3. Sections & Headings (`<h2>`, `<h3>`)

```html
<!-- Primary section: tracked by ToC, navbar dropdown, and auto-numbering -->
<h2 id="section-patterns">Core Patterns</h2>
<p>Introductory paragraph for this section...</p>

<!-- Subsection: not tracked in ToC or navbar, purely editorial -->
<h3 id="subsection-factory">Abstract Factory</h3>
<p>Subsection details...</p>
```

---

### 4. Interactive Hoverpanels (`hover-trigger`, `hover-panel`)
Provides contextual definitions or supplemental information without breaking reading flow:

```html
<p>
  The system utilizes a 
  <span class="hover-trigger">microkernel architecture
    <span class="hover-panel">
      <span class="hover-panel-title">💡 Microkernel Pattern</span>
      <span class="hover-panel-text">
        An architectural pattern that divides a system into a minimal core routine and extensible plug-in components.
      </span>
      <span class="hover-panel-text">
        Commonly applied in operating systems, IDEs, and workflow engines.
      </span>
    </span>
  </span>
  to allow runtime extensibility.
</p>
```

#### Strict Hoverpanel Rules:
1. `.hover-trigger` must contain **exactly one** `.hover-panel` as an immediate child.
2. The panel contains an optional `<span class="hover-panel-title">` followed by one or more `<span class="hover-panel-text">` elements.
3. **Never place `<p>` tags inside `.hover-panel`**; use `<span class="hover-panel-text">`.
4. **Automatic Clamping:** The framework calculates viewport boundaries at runtime. Panels automatically flip or shift horizontally and vertically to prevent off-screen cutoffs, and will never obscure the top sticky navbar.
5. **Touch Devices:** On desktop, hovering opens the panel with an invisible bridge allowing cursor movement into the text. On touch devices, tapping toggles the panel open or closed.

---

### 5. Callout Boxes (`boxnote`)
Six semantic callouts are available. Combine them with `<i data-emoji="...">` to maintain unified course branding:

```html
<!-- Info: Blue border/background — neutral definitions, informational notes -->
<div class="boxnote boxnote-info">
  <div class="boxnote-title">
    <i data-emoji="info" aria-hidden="true"></i> Note
  </div>
  <p>Standard architectural definitions and background context.</p>
</div>

<!-- Warning: Amber border/background — constraints, deprecations, warnings -->
<div class="boxnote boxnote-warning">
  <div class="boxnote-title">
    <i data-emoji="warning" aria-hidden="true"></i> Attention Required
  </div>
  <p>Breaking API changes will be introduced in the next major release.</p>
</div>

<!-- Success: Green border/background — best practices, pro-tips, recommendations -->
<div class="boxnote boxnote-success">
  <div class="boxnote-title">
    <i data-emoji="success" aria-hidden="true"></i> Recommended Practice
  </div>
  <p>Encapsulate dependencies behind interfaces to facilitate unit testing.</p>
</div>

<!-- Error / Critical: Red border/background — fatal errors, strict prohibitions -->
<div class="boxnote boxnote-error">
  <div class="boxnote-title">
    <i data-emoji="error" aria-hidden="true"></i> Strict Restriction
  </div>
  <p>Never commit hardcoded API secrets or private keys to the repository.</p>
</div>

<!-- Dark: Dark slate background, accent line — core axioms, philosophical principles -->
<div class="boxnote boxnote-dark">
  <div class="boxnote-title">
    <i data-emoji="important" aria-hidden="true"></i> Core Axiom
  </div>
  <p>High cohesion and loose coupling are prerequisites for scalable systems.</p>
</div>

<!-- Neutral: Subtle slate border — administrative notes, deadlines, quotes -->
<div class="boxnote boxnote-neutral">
  <div class="boxnote-title">
    <i data-emoji="note" aria-hidden="true"></i> Administrative Notice
  </div>
  <p>Course drop deadline without academic penalty is October 24.</p>
</div>
```

#### Floating Callouts (`float-right`)
Add `.float-right` to float any boxnote to the right side of the text column on wide displays. On mobile devices, it automatically snaps back to 100% width in the standard document flow:

```html
<div class="boxnote boxnote-neutral float-right">
  <div class="boxnote-title">
    <i data-emoji="note" aria-hidden="true"></i> Key Dates
  </div>
  <p>Midterm grades will be returned at least 2 days prior to the voluntary withdrawal deadline.</p>
</div>
<p>Standard body text paragraphs wrap smoothly around the left side of the floating callout box...</p>
```

### Callout Types & Visual Styling

The framework applies distinct background tints and strong left borders to distinguish each semantic level:

| Class | Background | Left Border | Typical Usage |
| :--- | :--- | :--- | :--- |
| `boxnote-info` | Pale blue | Blue `#185FA5` | Informational notes, conceptual definitions |
| `boxnote-warning` | Pale amber | Amber-brown `#854F0B` | Constraints, edge cases, deprecation warnings |
| `boxnote-success` | Pale green | Green `#3B6D11` | Recommendations, best practices, pro-tips |
| `boxnote-error` | Pale red | Red `#A32D2D` | Common errors, prohibited workflows |
| `boxnote-dark` | Dark slate | Course accent (`--accent`) | Key takeaways, core axioms, strong principles |
| `boxnote-neutral` | Light gray | Slate `#64748b` | Administrative deadlines, policy citations |

#### Customizing Callout Styles
To customize the visual appearance of any callout box, override the CSS properties inside a `<style data-page-style>` block (or in your course-wide custom CSS). For example, to give warning notes a custom purple theme:

```html
<style data-page-style>
  .boxnote-warning {
    background-color: #faf5ff; /* Pale purple */
    border-left-color: #7e22ce; /* Vibrant purple */
  }
</style>
```

---

### 6. Accordions (`<details class="fw-accordion">`)
Collapsible panels for optional reading, hints, or detailed explanations:

```html
<details class="fw-accordion">
  <summary>Click to view solution breakdown</summary>
  <div class="fw-accordion-body">
    <p>Step-by-step mathematical derivation of the algorithm's time complexity.</p>
    <div class="boxnote boxnote-success">
      <div class="boxnote-title">
        <i data-emoji="tip" aria-hidden="true"></i> Complexity Tip
      </div>
      <p>Observe that the inner loop terminates after at most log(N) iterations.</p>
    </div>
  </div>
</details>
```
Add the standard `open` attribute (`<details class="fw-accordion" open>`) to display the accordion expanded by default.

---

### 7. Sidebar Structure & Cards

The sidebar is built from two separate `<aside>` elements inside `.edtech-container`:

```html
<div class="edtech-container">

  <!-- Cards rendered top-right on desktop, and BEFORE main-content on mobile -->
  <aside class="sidebar-before">
    <div class="sidebar-card">...</div>
  </aside>

  <!-- Main reading column -->
  <main class="main-content">
    ...
  </main>

  <!-- Cards rendered bottom-right on desktop, and AFTER main-content on mobile -->
  <aside class="sidebar-after">
    <div class="sidebar-card">...</div>
  </aside>

</div>
```

> **Single-Column Mode (`.no-sidebar`):**  
> If the `.no-sidebar` modifier class is applied to `.edtech-container` (`<div class="edtech-container no-sidebar">`), the sidebar layout is completely disabled. In this mode, both `<aside class="sidebar-before">` and `<aside class="sidebar-after">` elements must be omitted, and `.main-content` expands to fill the entire container width.

#### Sidebar Rules:
* The DOM order **must strictly be**: `sidebar-before` → `main-content` → `sidebar-after`.
* If all cards should appear after main content on mobile, omit `<aside class="sidebar-before">`.
* If all cards should appear before main content on mobile, omit `<aside class="sidebar-after">`.

#### Examples of Sidebar Card Components:

**A. Generic Text Card:**
```html
<div class="sidebar-card">
  <h3>📋 Office Hours</h3>
  <p>Tuesdays & Thursdays: 14:00 – 16:00 (Lambton Tower 3115).</p>
</div>
```

**B. Key-Value Fact Rows (`fact-row`):**
```html
<div class="sidebar-card">
  <h3>📋 Course at a Glance</h3>
  <div class="fact-row">
    <span class="fact-label">Code</span>
    <span class="fact-value">COMP-8117</span>
  </div>
  <div class="fact-row">
    <span class="fact-label">Credits</span>
    <span class="fact-value">3.00</span>
  </div>
  <div class="fact-row">
    <span class="fact-label">Format</span>
    <span class="fact-value">In-person</span>
  </div>
</div>
```

**C. Resource Links (`resource-link`):**
```html
<div class="sidebar-card">
  <h3>🔗 Useful Links</h3>
  <!-- Target _top escapes the Brightspace iframe -->
  <a href="https://brightspace.uwindsor.ca/..." target="_top" class="resource-link">
    📋 Course Syllabus
  </a>
  <a href="https://brightspace.uwindsor.ca/..." target="_top" class="resource-link">
    📊 Grading Rubrics
  </a>
  <!-- Target _blank for external sites -->
  <a href="https://github.com/..." target="_blank" class="resource-link">
    🐙 GitHub Organization
  </a>
</div>
```

---

# 4. Optional Modules: Usage, Development & Catalog

Optional modules extend the framework with specialized visual components, rendering libraries, or domain-specific interactions (such as icon packs, interactive code runners, quest widgets, or diagram visualizers) without bloating the base runtime.

---

## 4.1 Requesting Modules on a Page (`data-modules`)

Page authors request optional modules declaratively using the `data-modules` attribute on `bootstrap.js`. Modules can be separated by spaces or commas:

```html
<script
  src="bootstrap.js"
  data-page-type="course-page"
  data-modules="tabler-icons, interactive-graph">
</script>
```

The bootstrap resolves the module's dependencies, imports its stylesheets, loads its scripts in topological order, and ensures it is compatible with the requested `data-page-type`.

> **Rule for Page Authors:** Never manually include `<link>` or `<script>` tags for optional modules in your HTML pages. Always request them via `data-modules`.

---

## 4.2 Built-in Module Catalog

The shared framework ships with native optional modules registered in `brightspace/framework-registry.js`:

### 1. `tabler-icons`
* **Purpose:** Imports the Tabler Icons Webfont pack.
* **Compatibility:** Allowed on all page types (`null`).
* **Dependencies:** None (`[]`).
* **Source:** Official CDN webfont CSS (`@tabler/icons-webfont`).

#### Usage in HTML
Request the module via `data-modules="tabler-icons"` and use `<i>` elements with the `.ti` and `.ti-*` classes. Always add `aria-hidden="true"`:

```html
<p>
  <i class="ti ti-check" aria-hidden="true"></i> Requirement verified.
</p>
<p>
  <i class="ti ti-alert-triangle" aria-hidden="true"></i> Caution advised.
</p>
```
---

### 2. Custom Sprites Engine (`data-sp`)
* **Purpose:** High-performance pixel-art and custom vector/raster icon engine. Packs multiple icons into a single image sheet (1 HTTP request).
* **Key Feature:** The framework dynamically calculates each sprite's `aspect-ratio` in JavaScript, preventing distortion regardless of scale or height.

#### A. Configuration in `course-config.js`
Place the sprite sheet image in `brightspace/assets/` (e.g., `sprites.png`) and declare its overall dimensions along with pixel coordinates for each slice:

```javascript
sprites: {
  sheet:  'sprites.png',   // File located in brightspace/assets/
  sheetW: 1160,            // Natural image width in pixels
  sheetH: 774,             // Natural image height in pixels

  // Slices: [posX, posY, width, height]
  items: {
    'error':   [324, 245, 167, 170],
    'info':    [702, 686, 60,  72],
    'tip':     [626, 196, 78,  77],
    'warning': [324, 48,  167, 163],
  },
},
```

#### B. Usage in HTML
Use an `<i>` tag with the base `.sp` class and `data-sp="<item-key>"`. Always add `aria-hidden="true"`:

```html
<!-- Inline icon aligned with body text -->
<p>Read the syllabus <i class="sp" data-sp="info" aria-hidden="true"></i> carefully.</p>

<!-- Replacing an emoji inside a callout box title -->
<div class="boxnote boxnote-error">
  <div class="boxnote-title">
    <i class="sp" data-sp="error" aria-hidden="true"></i> Fatal Error Encountered
  </div>
  <p>The compiler terminated with error code 1.</p>
</div>
```

#### C. Size & Alignment Utility Classes
The framework manages **width** automatically via dynamic `aspect-ratio`. Combine these classes to scale height or modify alignment:

##### Height Modifiers:
* `.sp-xs`  : `0.85em` (Subtle footnotes, compact metadata)
* `.sp-sm`  : `1.00em` (Tight inline text)
* `.sp`     : `1.25em` *(Default — aligns with standard paragraph line height)*
* `.sp-lg`  : `1.75em` (Matches `<h3>` headings)
* `.sp-xl`  : `2.50em` (Matches `<h2>` headings)
* `.sp-2x`  : `3.00em` (Sidebar feature callouts)
* `.sp-3x`  : `4.00em` (Large section illustrations)

##### Alignment Modifiers:
* `.sp-block` : Turns the sprite into a centered block element (ideal for section dividers or intros).
* `.sp-top`, `.sp-bottom`, `.sp-text` : Adjusts fine vertical alignment relative to the text baseline.

```html
<!-- Example: Large centered section illustration -->
<div class="section-intro">
  <i class="sp sp-block sp-3x" data-sp="warning" aria-hidden="true"></i>
  <h3>System Maintenance Scheduled</h3>
</div>
```

---

## 4.3 Developing Custom Optional Modules

Developers can build modules specific to a single course, a multi-course sequence, or an entire department.

### 1. Recommended File Structure
A module may contain CSS, JavaScript, or both. The recommended convention is to organize module files under the course's `brightspace/` directory:

```text
brightspace/
├── modules.js                  ← Module registry file (recommended naming/location)
├── styles/
│   └── interactive-graph.css   ← Module styles (optional)
└── scripts/
    └── interactive-graph.js    ← Module runtime script (optional)
```

*(Note: Modules may also be developed in external folders during local development; the path resolution rules ensure they remain fully portable).*

---

### 2. Declaring the Registry in `bootstrap-config.js`
The bootstrap does not automatically crawl folders. Every custom module registry file **must be explicitly declared** in `bootstrap-config.js` under `moduleRegistries`:

```javascript
window.BRIGHTSPACE_BOOTSTRAP_CONFIG = {
  frameworkBase: './brightspace',
  courseConfig:  './brightspace/scripts/course-config.js',

  /*
   * Additional module registries.
   * Add the path to your registry file relative to bootstrap.js:
   */
  moduleRegistries: [
    './brightspace/modules.js'
  ]
};
```

---

### 3. Registering a Module (`BRIGHTSPACE.registerModule`)
Inside your registry file (e.g., `brightspace/modules.js`), wrap registrations in an IIFE and register each module:

```javascript
(function () {
  'use strict';

  if (!window.BRIGHTSPACE || typeof window.BRIGHTSPACE.registerModule !== 'function') {
    throw new Error('[modules] Brightspace module registration API is unavailable.');
  }

  /* ── Register: interactive-graph ─────────────────────── */
  window.BRIGHTSPACE.registerModule('interactive-graph', {
    // Paths resolved RELATIVE to this registry file
    css: [
      'styles/interactive-graph.css'
    ],
    js: [
      'scripts/interactive-graph.js'
    ],

    // Restrict usage to specific page types (or set null for all page types)
    allowedPageTypes: [
      'course-page',
      'assignment-page'
    ],

    // Dependent optional modules that must load first
    dependsOn: []
  });

  /* ── Register: advanced-metrics (depends on interactive-graph) */
  window.BRIGHTSPACE.registerModule('advanced-metrics', {
    css: ['styles/advanced-metrics.css'],
    js:  ['scripts/advanced-metrics.js'],
    allowedPageTypes: ['course-page'],
    dependsOn: ['interactive-graph']
  });

})();
```

---

## 4.4 Module Definition Schema

The definition object passed to `BRIGHTSPACE.registerModule(name, definition)` accepts the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `css` | `Array<string>` | Stylesheets required by the module. Paths are **resolved relative to the registry file**. Use `[]` if none. |
| `js` | `Array<string>` | Scripts required by the module. Paths are **resolved relative to the registry file**. Use `[]` if none. |
| `allowedPageTypes` | `Array<string> \| null` | Restricts the module to specific page types (e.g., `['assignment-page']`). Set to `null` to allow on all page types. |
| `dependsOn` | `Array<string>` | Array of module names that must be resolved and loaded prior to this module. Handled in topological order. |

---

## 4.5 Path Resolution Rules

All file paths declared in `css` and `js` arrays are **resolved relative to the registry file** that registered them—**not** relative to the HTML page or `bootstrap.js`. For instance, consider this development and release layout:

```text
# Development Environment
courses/COMP8117/brightspace/modules.js
courses/COMP8117/brightspace/styles/graph.css
courses/COMP8117/brightspace/scripts/graph.js
```

Inside `modules.js`, declaring:
```javascript
css: ['styles/graph.css'],
js:  ['scripts/graph.js']
```
will resolve to `courses/COMP8117/brightspace/styles/graph.css`. When the entire `brightspace/` folder is deployed into production at `/content/enforced/227327-COMP8117/brightspace/`, the relative resolution remains intact. **No paths in the registry or HTML pages need to be altered.**

---

## 4.6 Module Execution & Configuration Patterns

### Execution Order
Module scripts execute only after:
1. The DOM is fully loaded and parsed.
2. `course-config.js` and all page configs are available.
3. The base page-type scripts (`framework.js`, `assignment.js`, etc.) have completed execution.

### Accessing Framework Context
A module script can read global configurations safely:
```javascript
(function () {
  'use strict';

  var CC = window.COURSE_CONFIG || {};
  var PC = window.PAGE_CONFIG   || {};

  // Access assets path, course code, etc.
  var assetsPath = CC.paths ? CC.paths.assets : '';
})();
```

### Module-Specific Configuration
If your module requires configuration, use a **dedicated global namespace** rather than polluting `PAGE_CONFIG`:

```html
<!-- In HTML page -->
<script>
  window.GRAPH_CONFIG = {
    theme: 'dark',
    directed: true,
    initialNodeCount: 12
  };
</script>
```

In your module script (`scripts/interactive-graph.js`):
```javascript
(function () {
  'use strict';

  var config = window.GRAPH_CONFIG || {
    theme: 'light',
    directed: false,
    initialNodeCount: 5
  };

  function init() {
    // Initialize component using config
  }

  init();
})();
```

---

## 4.7 Module Development Rules & Best Practices

1. **Never modify `bootstrap.js`:** The bootstrap loader is generic. Custom behavior belongs in a module script or a lifecycle hook.
2. **Never hardcode module paths in HTML:** Authors should declare only module keys in `data-modules="module-name"`.
3. **Use `allowedPageTypes` for compatibility:** Do not use `dependsOn` to specify page types (e.g., `dependsOn: ['assignment-page']` is invalid). Use `allowedPageTypes: ['assignment-page']`.
4. **Use `dependsOn` strictly for other optional modules:** The bootstrap detects circular dependencies (e.g., $A \to B \to A$) and throws an explicit error during initialization.
5. **Fail gracefully:** If a module requires specific HTML markup or configuration to function, validate it at startup and emit clear, informative errors to `console.error`.

---

# 5. Specialized Page Types

In addition to standard course pages, the framework provides three specialized page types tailored for interactive assessments and print-ready documents.

---

## 5.1 Interactive Web Assignments (`assignment-page`)

Assignment pages specialize `course-page` for online problem sets, labs, and term projects. They load `assignment.css` and `assignment.js` to provide real-time deadline tracking, automated submission cards, and pedagogical learning outcomes.

### 1. Page Header Setup
```html
<script src="bootstrap-config.js"></script>
<script
  src="bootstrap.js"
  data-page-type="assignment-page"
  data-modules="tabler-icons">
</script>
```

---

### 2. `ASSIGNMENT_CONFIG` Reference
Configure the assignment parameters inside an inline `<script>` tag:

```javascript
window.ASSIGNMENT_CONFIG = {

  /* ── Identity ─────────────────────────────────────────── */
  assignmentNumber : 1,                  // Number or string: 1, 2, 'A', 'Midterm'
  assignmentLabel  : 'Assignment',         // Eyebrow label: 'Assignment' | 'Lab' | 'Project' | 'Quiz'
  assignmentType   : 'regular',            // 'regular' | 'bonus'

  /* ── Deadlines & Schedule ─────────────────────────────── */
  openDate : '2026-10-01T00:00',          // ISO 8601 string (null if always open)

  deadline : {
    date      : '2026-10-15T23:59',        // ISO 8601 string
    type      : 'hard',                    // 'hard' (🔴) | 'soft' (🟡)

    extension : null,
    // Or with extension:
    // extension : { date: '2026-10-17T23:59', reason: 'Extended for Reading Week' },
  },

  /* ── Submission Settings ──────────────────────────────── */
  submissionType : 'individual',          // 'individual' | 'group'
  groupSize      : null,                  // Only if group: e.g. '2–3 students'
  submissionUrl  : '#',                   // Brightspace dropbox link (opens target="_top")

  /* ── AI Policy ────────────────────────────────────────── */
  aiPolicy : 'restricted',                // 'unrestricted' | 'restricted' | 'forbidden' | 'default'

  /* ── Pedagogical Metadata (Hover Drawer) ──────────────── */
  learningOutcomes : [
    { code: 'LO1', label: 'Design decoupled software architectures using structural patterns.' },
    { code: 'LO2', label: 'Implement comprehensive unit test suites with high branch coverage.' },
  ],

  estimatedTime   : '6–8 hours',          // String or null
  difficulty      : 'medium',             // 'easy' | 'medium' | 'hard'
  weight          : 15,                   // Percentage of final grade (null if unannounced)
  points          : 100,                  // Total raw points (null if unannounced)
  rubricsProvided : true,                 // true | false

  /* ── Sidebar Resources ────────────────────────────────── */
  resources : [
    { label: '📄 Starter Codebase (GitHub)', url: 'https://github.com/...' },
    { label: '📊 Grading Rubric',            url: '#section-evaluation' },
    { label: '📚 Slide Deck: Chapter 4',     url: 'attachments/slides-ch4.pdf' },
  ],

};
```

---

### 3. Automated Injections & Sidebar Rules
* **Hero Eyebrow:** Injected automatically above `<h1>` in `#fw-hero` using `assignmentLabel` and `assignmentNumber`.
* **Sticky Assignment Strip:** Docked below the navbar. Features live deadline countdowns, real-time color-coded progress bars (🟢 `<65%`, 🟡 `65%–90%`, 🔴 `>90%` or closed), submission badges, and an interactive details drawer.
* **Submission Card:** Injected automatically into `<aside class="sidebar-before">`. Displays deadline status, points, and an active **Submit Assignment →** button (switches to disabled **Submission Closed** past deadline).
* **Resources Card:** Injected automatically into `<aside class="sidebar-after">` from `resources`.

> **DOM Requirement:** `<aside class="sidebar-before">` and `<aside class="sidebar-after">` **must be present in the HTML but kept completely empty**. The framework injects the cards automatically. Additional custom cards may be placed after them.

---

### 4. Standard Section Hierarchy
Assignments should adopt this standard section structure:

| Section Title | Required Heading ID | Purpose |
| :--- | :--- | :--- |
| **Simulation Context** | `section-context` | Realistic industrial scenario, engineering challenge, stakes. |
| **Task Instructions** | `section-instructions` | Step-by-step imperative technical requirements. |
| **Deliverables** | `section-deliverables` | Formally numbered deliverable items (`assignment-deliverable-list`). |
| **Submission** | `section-submission` | Archive packaging rules, naming conventions, dropbox link. |
| **Evaluation** | `section-evaluation` | Rubric criteria table (`rubric-table`) and scoring details. |
| **Academic Integrity** | `section-integrity` | AI policy callout, collaboration limits, institutional citation. |
| **References** | `section-references` | Starter repos, documentation, standards, and readings. |

---

### 5. AI Policy Callouts
Place the callout matching `ASSIGNMENT_CONFIG.aiPolicy` inside `section-integrity`:

```html
<!-- aiPolicy: 'forbidden' -->
<div class="boxnote boxnote-error">
  <div class="boxnote-title">
    <i data-emoji="error" aria-hidden="true"></i> Generative AI Prohibited
  </div>
  <p>The use of generative AI tools (such as ChatGPT, Copilot, or Claude) is strictly prohibited. All submitted work must be entirely your own.</p>
</div>

<!-- aiPolicy: 'restricted' -->
<div class="boxnote boxnote-warning">
  <div class="boxnote-title">
    <i data-emoji="warning" aria-hidden="true"></i> Restricted Generative AI Use
  </div>
  <p>Generative AI may be used solely for syntax reference or debugging assistance. Generating code solutions, architectural diagrams, or report drafts is prohibited. All AI interactions must be cited in an appendix.</p>
</div>

<!-- aiPolicy: 'unrestricted' -->
<div class="boxnote boxnote-success">
  <div class="boxnote-title">
    <i data-emoji="success" aria-hidden="true"></i> Generative AI Permitted
  </div>
  <p>You are encouraged to utilize generative AI tools to assist in researching, brainstorming, drafting, and optimizing your solution. You remain fully accountable for verifying technical correctness.</p>
</div>

<!-- aiPolicy: 'default' -->
<div class="boxnote boxnote-info">
  <div class="boxnote-title">
    <i data-emoji="info" aria-hidden="true"></i> AI Policy — Course Default
  </div>
  <p>This assignment adheres to the standard generative AI policy outlined in the course syllabus.</p>
</div>
```

---

### 6. Deliverable List Component (`assignment-deliverable-list`)

```html
<div class="assignment-deliverable-list">

  <div class="assignment-deliverable-item">
    <div class="assignment-deliverable-num">01</div>
    <div class="assignment-deliverable-body">
      <div class="assignment-deliverable-title">
        Architecture Report
        <span class="assignment-deliverable-pts">40 pts</span>
      </div>
      <div class="assignment-deliverable-meta">
        PDF Format <span class="assignment-deliverable-meta-sep">·</span> Max 6 pages
      </div>
      <p class="assignment-deliverable-desc">
        Comprehensive breakdown of architectural decomposition, design patterns used, and trade-off matrices.
      </p>
    </div>
  </div>

  <div class="assignment-deliverable-item">
    <div class="assignment-deliverable-num">02</div>
    <div class="assignment-deliverable-body">
      <div class="assignment-deliverable-title">
        Refactored Source Code
        <span class="assignment-deliverable-pts">60 pts</span>
      </div>
      <div class="assignment-deliverable-meta">
        ZIP Archive <span class="assignment-deliverable-meta-sep">·</span> Clean Build
      </div>
      <p class="assignment-deliverable-desc">
        Production-ready codebase including automated unit test suites achieving at least 85% branch coverage.
      </p>
    </div>
  </div>

</div>
```
#### Deliverable Component Structure

| Element | Role |
| :--- | :--- |
| `.assignment-deliverable-num` | Large stylized decorative counter (`01`, `02`...) — `user-select: none`. |
| `.assignment-deliverable-title` | Deliverable title (uppercase, bold). |
| `.assignment-deliverable-pts` | Optional score pill badge appended to the title. |
| `.assignment-deliverable-meta` | Format specification, file constraints, or length limits (uppercase, gray). |
| `.assignment-deliverable-meta-sep` | Visual dot separator (`·`) between metadata tags. |
| `.assignment-deliverable-desc` | Prose description outlining deliverable requirements. |

---

### 7. Rubric Table Component

Add the rubric table styles in `<head>` inside `<style data-page-style>`:

```html
<style data-page-style>
  .rubric-table { width: 100%; border-collapse: collapse; margin: 16px 0 28px; font-size: 0.88em; }
  .rubric-table th { background: var(--structure); color: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 700; text-transform: uppercase; font-size: 0.78em; letter-spacing: 0.5px; }
  .rubric-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--text-main); }
  .rubric-table tr:last-child td { border-bottom: none; }
  .rubric-table tr:nth-child(even) td { background: #f8fafc; }
  .level-badge { display: inline-block; padding: 2px 8px; font-weight: 800; font-size: 0.82em; border-radius: 2px; white-space: nowrap; }
  .level-exceeds { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
  .level-meets   { background: #eff6ff; color: #1d4ed8; border: 1px solid #93c5fd; }
  .level-partial { background: #fefce8; color: #a16207; border: 1px solid #fde047; }
  .level-missing { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }
</style>
```

Markup for the evaluation table:

```html
<table class="rubric-table">
  <thead>
    <tr>
      <th style="width: 130px;">Level</th>
      <th style="width: 120px;">Classification</th>
      <th>Assessment Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="level-badge level-exceeds">Exceeds</span></td>
      <td>Exemplary</td>
      <td>Architectural models are complete, correctly decoupled, and include rigorous edge-case analysis.</td>
    </tr>
    <tr>
      <td><span class="level-badge level-meets">Meets</span></td>
      <td>Proficient</td>
      <td>Satisfies all architectural requirements with minor stylistic deviations. Test coverage exceeds 80%.</td>
    </tr>
    <tr>
      <td><span class="level-badge level-partial">Partial</span></td>
      <td>Developing</td>
      <td>Core components function, but architectural coupling remains high or test coverage is insufficient.</td>
    </tr>
    <tr>
      <td><span class="level-badge level-missing">Missing</span></td>
      <td>Unacceptable</td>
      <td>Deliverable missing, non-compiling, or fails core functional requirements.</td>
    </tr>
  </tbody>
</table>
```

---

## 5.2 Printable Documents (`printable-document`)

The `printable-document` page type produces professionally paginated **US Letter (8.5 × 11 in)** documents for course syllabi, lab manuals, and official handouts. It loads `document.css` and `document.js`.

> **Note:** Printable documents **do not load `framework.css` or `framework.js`**. Web-specific elements (such as the sticky navbar, hero banner, hoverpanels, and sidebars) have no role in print media.

### 1. Document Architecture & Pagination Rules
The document engine enforces precise print geometry via CSS paged media rules (`size: Letter portrait; margin: 0;`). Running headers, footers, institutional logos, and pagination counters (`Page N of M`) are built into the DOM:

```text
┌────────────────────────────────────────────────────────┐
│ [logo]  Course code · Course title           Section N │
├────────────────────────────────────────────────────────┤
│                                                        │
│                    PAGE CONTENT                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Program name       Term · Year              Page N of M│
│ Custom footer text                                     │
└────────────────────────────────────────────────────────┘
```

#### Automated Page Injections:
1. **Mandatory Cover Page (Page 1):** Generated automatically from course metadata (`COURSE_CONFIG`) and document parameters (`DOCUMENT_CONFIG`). The engine enforces this rule automatically:
* If no page object whose `type` ends with `cover` (such as `cover` or `assignment-cover`) is found in `DOCUMENT_CONFIG.pages`, `document.js` **automatically injects a `{ type: 'cover' }` page at index 0**.
* If a cover page is declared later in the `pages` array, the engine automatically moves it to Page 1.
2. **Mandatory Blank Sheet (Page 2):** Page 2 is kept **completely blank** (no headers, footers, or page numbers) to ensure proper duplex printing. It must not be declared in `DOCUMENT_CONFIG.pages`.
3. **Mandatory Final Sheet:** A terminating page centered with **"END OF DOCUMENT"** is automatically appended to conclude the document.

> **Crucial Browser Notice:**  
> The URL, date, and page titles added by Chrome, Edge, or Firefox are generated natively by the browser's printing engine outside the DOM. **They cannot be reliably removed or styled via CSS.**
>
> When printing or exporting to PDF from Chrome, Edge, or Firefox:
> 1. Open the print dialog (**Ctrl+P** or **Cmd+P**).
> 2. Set Destination to **Save as PDF** or select your printer.
> 3. Paper size: **Letter**.
>4. Margins: **None** (margins are built into the template).
> 5. **Uncheck "Headers and footers"** in More Settings (browser URLs and dates must not appear on official documents).
>
> The on-screen **"Print document"** button in the top toolbar displays a reminder of this requirement and automatically hides itself during printing.

---

### 2. Page Setup & `DOCUMENT_CONFIG`

```html
<script src="bootstrap-config.js"></script>
<script
  src="bootstrap.js"
  data-page-type="printable-document">
</script>

<script>
  window.DOCUMENT_CONFIG = {
    title:            'Course Syllabus',
    subtitle:         'Official Course Outline and Academic Policies',
    kicker:           'Course Document',
    date:             '2026-09-08',
    version:          '1.0',
    locale:           'en-CA',
    footerText:       'School of Computer Science',
    showPrintToolbar: true,

    // Pages array: define only content sheets (Cover, Blank Sheet, and End Sheet are automatic)
    pages: [
      { type: 'cover' },
      { type: 'content', id: 'page-syllabus-1' },
      { type: 'content', id: 'page-syllabus-2', className: 'appendix-page' }
    ]
  };
</script>
```

---

### 3. Content Sources (`<template data-document-source="...">`)
Content for each page declared in `pages` is defined inside `<template>` tags matching the corresponding `id`:

```html
<template data-document-source="page-syllabus-1">
  <h1>1. Course Policies</h1>
  <p>Detailed attendance, late submission, and grading policies...</p>
</template>

<template data-document-source="page-syllabus-2">
  <h1>2. Course Schedule</h1>
  <p>Week-by-week calendar of topics and deliverables...</p>
</template>
```

---

### 4. Assets in Documents
Just like web pages, printable documents must not contain hardcoded Brightspace URLs. Images hosted in `brightspace/assets/` are referenced using `data-asset`:

```html
<img data-asset="curriculum-map.png" alt="Curriculum Map">
```

`document.js` resolves this path using `COURSE_CONFIG.paths.assets`. The institutional logo declared in `COURSE_CONFIG.institution.logo` is resolved automatically using the same mechanism and injected into the document running headers and cover page.

---

## 5.3 Printable Written Assignments (`printable-assignment`)

A Written Assignment is a specialized document built on top of the `printable-document` engine. It is specifically designed for physical problem sets, written quizzes, exams, and lab reports that students complete and submit by hand.

When using `data-page-type="printable-assignment"`, the bootstrap automatically imports:
* Styles: `document.css` and `written-assignment.css`
* Scripts: `written-assignment.js` and `document.js`

### What Written Assignments Add:
1. **Automated Exam Cover Page (`assignment-cover`):** Formatted student identity fields, submission checklist, examiner grading box, and duration/materials notices.
2. **Standardized Instructions Sheet (`assignment-instructions`):** Structured policy sections and automated injection of learning outcomes.
3. **Instructor Commentary Margins (`assignment-content`):** Dedicated vertical grading margins reserved along the right edge of content sheets.
4. **Printable Answer Components:** Ruled response lines, bounded answer boxes, and graph/schematic grid areas.

---

### 1. Page Setup & Configuration

Three configuration objects govern a written assignment. Declare them in an inline `<script>` tag before or alongside `bootstrap.js`:

```html
<script src="bootstrap-config.js"></script>
<script
  src="bootstrap.js"
  data-page-type="printable-assignment">
</script>

<script>
  /* ── 1. Pedagogical Metadata (Reused from the assignment system) ── */
  window.ASSIGNMENT_CONFIG = {
    assignmentNumber: 1,
    assignmentLabel:  'Written Problem Set', // Eyebrow prefix
    learningOutcomes: [
      { code: 'LO1', label: 'Perform two’s complement signed arithmetic.' },
      { code: 'LO2', label: 'Analyze finite state machine excitation equations.' },
    ],
  };

  /* ── 2. Physical Page Ordering & Document Details ──────────────── */
  window.DOCUMENT_CONFIG = {
    title:            'Problem Set 1 — Digital Logic & Arithmetic',
    subtitle:         'Individual Homework Assignment',
    date:             '2026-10-10',
    locale:           'en-CA',
    footerText:       'School of Computer Science',
    showPrintToolbar: true,

    // Declare the physical sequence of pages (Blank page 2 and end page are automatic)
    pages: [
      { type: 'assignment-cover' },
      { type: 'assignment-instructions', id: 'instructions-sheet' },
      { type: 'assignment-content',      id: 'questions-page-1' },
      { type: 'assignment-content',      id: 'questions-page-2' },
    ],
  };

  /* ── 3. Written Assignment Structural Controls ─────────────────── */
  window.WRITTEN_ASSIGNMENT_CONFIG = {
    // Duration & Materials: displayed on the cover under Instructor & Date
    duration:          '120 minutes',
    materialPermitted: '1 sheet of handwritten notes (Letter size, double-sided)',
    // materialPermitted accepts: true ('Yes'), false ('No'), or a custom string

    // Display student signature field on cover
    showStudentSignature: true,

    // Compliance checklist items for the student to confirm before submitting
    submissionChecklist: [
      'Student information is complete and legible',
      'All required questions have been attempted',
      'Required academic integrity declarations are acknowledged',
      'All pages are included and attached in sequential order',
    ],

    // Examiner grading table on the cover sheet
    gradingArea:    true,
    gradingColumns: ['Q1', 'Q2', 'Q3', 'Q4', 'Total'],

    // Right-hand margin for grader commentary on content pages
    instructorMargin: {
      width: '1.35in' // Set to false to disable the margin
    }
  };
</script>
```

---

### 2. Relationship with `ASSIGNMENT_CONFIG`

The written assignment engine directly reuses pedagogical data already declared in `ASSIGNMENT_CONFIG`:
* `assignmentNumber` and `assignmentLabel` (used to build the cover title header).
* `learningOutcomes` (injected automatically into the instructions sheet).
* `points` (optional raw score total).

> **Rule:** Never duplicate pedagogical fields into `WRITTEN_ASSIGNMENT_CONFIG`.  
> While `ASSIGNMENT_CONFIG.aiPolicy` exists for web assignments, the printable document engine does **not** generate synthetic text from it. Specific instructions on Artificial Intelligence, Academic Integrity, and Ethics remain explicitly written within the instructions HTML template.

---

### 3. The Cover Sheet (`assignment-cover`)

The cover page is generated dynamically at Page 1. If no page of type `assignment-cover` is listed in `DOCUMENT_CONFIG.pages`, `written-assignment.js` inserts one automatically.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] University of Windsor · School of Computer Science              │
│ COMP-2660: Computer Organization · Section 1 · Fall 2026               │
│                                                                        │
│ WRITTEN PROBLEM SET 1                                                  │
│ Problem Set 1 — Digital Logic & Arithmetic                             │
│                                                                        │
│ LAST NAME:  ______________________  FIRST NAME: ______________________ │
│ STUDENT ID: ______________________  SIGNATURE:  ______________________ │
│                                                                        │
│ ┌─ SUBMISSION CHECKLIST ──────────┐  ┌─ FOR GRADING USE ONLY ────────┐ │
│ │ [ ] Student info complete       │  │ Q1  │ Q2  │ Q3  │ Q4  │ Total │ │
│ │ [ ] All questions answered      │  ├─────┼─────┼─────┼─────┼───────┤ │
│ │ [ ] All pages in order          │  │ /10 │ /15 │ /15 │ /20 │  /60  │ │
│ └─────────────────────────────────┘  └───────────────────────────────┘ │
│                                                                        │
│ Instructor: Aznam Yacoub, PhD        Duration: 120 minutes             │
│ Date: October 10, 2026               Materials Permitted: 1 sheet notes│
└────────────────────────────────────────────────────────────────────────┘
```

#### Cover Components Built Automatically:
* **Institutional Identity:** Logo, university, faculty, department, course code, title, program, section, and term.
* **Student Identification Box:** Ruled fields for Last Name, First Name, Student ID, and Signature line (if `showStudentSignature: true`).
* **Submission Checklist:** Generated from `WRITTEN_ASSIGNMENT_CONFIG.submissionChecklist`.
* **Grading Grid:** Built with columns defined in `gradingColumns`.
* **Metadata Block:** Instructor name, date, test duration, and material permissions.

---

### 4. The Instructions Sheet (`assignment-instructions`)

To generate an instructions page, assign `{ type: 'assignment-instructions', id: '<template-id>' }` in `DOCUMENT_CONFIG.pages`, and define the corresponding `<template>` in your HTML:

```html
<template data-document-source="instructions-sheet">
  <h1>Assignment Instructions</h1>

  <section class="wa-instruction-section">
    <h2>General Instructions</h2>
    <p>Write your answers legibly in blue or black ink. Pencil is permitted only for circuit diagrams. Show all intermediate work.</p>
  </section>

  <section class="wa-instruction-section">
    <h2>Permitted Materials</h2>
    <p>Standard non-programmable calculators are allowed. No mobile devices, smartwatches, or network-capable hardware may be used.</p>
  </section>

  <section class="wa-instruction-section">
    <h2>Submission Requirements</h2>
    <p>Submit your physical papers stapled in the top-left corner directly to the instructor at the beginning of class.</p>
  </section>

  <!-- AUTOMATED INJECTION: Replaced at runtime by badges from ASSIGNMENT_CONFIG.learningOutcomes -->
  <div data-wa-learning-outcomes></div>

  <section class="wa-instruction-section">
    <h2>Artificial Intelligence Policy</h2>
    <p>Using generative AI tools to produce solutions or explanations submitted in this work is strictly prohibited and constitutes academic misconduct.</p>
  </section>

  <section class="wa-instruction-section">
    <h2>Academic Integrity & Professional Conduct</h2>
    <p>All work must represent the student's authentic individual effort. Submissions will be cross-evaluated for unauthorized collaboration under Senate Policy S3.</p>
  </section>
</template>
```

#### The `<div data-wa-learning-outcomes>` Placeholder
When `written-assignment.js` encounters `<div data-wa-learning-outcomes></div>`, it replaces it with a formatted section containing:
* A structured grid of pill badges (`LO1`, `LO2`, etc.).
* The full description corresponding to each outcome code defined in `ASSIGNMENT_CONFIG.learningOutcomes`.

---

### 5. Content Sheets & Instructor Comments Margin (`assignment-content`)

Pages containing questions and student response fields use the type `assignment-content`:

```javascript
{ type: 'assignment-content', id: 'questions-page-1' }
```

The runtime renders the template's content in the primary reading area and **automatically attaches an "Instructor Comments" margin on the right edge** of the sheet.

```text
┌─────────────────────────────────────────────────────────────┬──────────┐
│ COMP-2660 · Problem Set 1                         Section 1 │INSTRUCTOR│
├─────────────────────────────────────────────────────────────┤ COMMENTS │
│ 1. Two's Complement Subtraction                        / 10 │          │
│    Perform 01010100₂ - 00111001₂ using 8-bit arithmetic.   │          │
│    _____________________________________________________    │          │
│    _____________________________________________________    │          │
│    _____________________________________________________    │          │
├─────────────────────────────────────────────────────────────┴──────────┤
│ Bachelor of Computer Science       Fall 2026        Page 4 of 6        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Controlling the Instructor Margin
The margin width defaults to `1.35in`. You can customize its width in `WRITTEN_ASSIGNMENT_CONFIG`:

```javascript
instructorMargin: {
  width: '1.60in' // Custom width
}
```

Or disable it entirely across the assignment:

```javascript
instructorMargin: false
```

---

### 6. Printable Response Components

Use these building blocks inside `<template data-document-source="...">` on content sheets:

#### A. Question Wrapper (`wa-question`)
Wraps the question number, title, point allocation, prompt, and response area:

```html
<section class="wa-question">
  <div class="wa-question-header">
    <span class="wa-question-number">1</span>
    <span class="wa-question-title">Binary Subtraction</span>
    <span class="wa-question-points">/ 10</span>
  </div>

  <div class="wa-question-prompt">
    <p>Perform the subtraction <code>01010100₂ - 00111001₂</code> using 8-bit two's complement representation. Clearly indicate any carry-in or overflow conditions.</p>
  </div>

  <!-- Ruled response lines -->
  <div class="wa-answer-lines" style="--wa-lines: 7"></div>
</section>
```

#### B. Ruled Answer Lines (`wa-answer-lines`)
Generates evenly spaced horizontal ruled writing lines. Control the line count directly via the `--wa-lines` CSS variable:

```html
<div class="wa-answer-lines" style="--wa-lines: 8"></div>
```

#### C. Bounded Answer Box (`wa-answer-box`)
A solid bordered box for open-ended text, algebraic proofs, or short answers:

```html
<!-- Specify height in inches or let it expand to fill space -->
<div class="wa-answer-box" style="height: 2.2in;"></div>
```

#### D. Sketch & Graphing Grid Area (`wa-sketch-area`)
Generates an isometric/square drafting grid, ideal for schematic diagrams, state graphs, or memory maps:

```html
<div class="wa-sketch-area" style="height: 3.5in;"></div>
```

---

### 7. Physical Document Assembly Sequence

When generating a written assignment, `document.js` compiles the sheets in this exact physical order:

$$\begin{aligned}
\text{Page 1} &\longrightarrow \text{Cover Sheet (\texttt{assignment-cover})} \\
\text{Page 2} &\longrightarrow \text{Mandatory Blank Sheet (for duplex printing)} \\
\text{Page 3} &\longrightarrow \text{Instructions Sheet (\texttt{assignment-instructions})} \\
\text{Page 4..N} &\longrightarrow \text{Content Sheets (\texttt{assignment-content} with instructor margin)} \\
\text{Page N+1} &\longrightarrow \text{Termination Sheet (\texttt{END OF DOCUMENT})}
\end{aligned}$$

---

# 6. Golden Rules & Pre-Flight Checklists

To preserve maintainability, cross-course portability, and visual consistency, all pages must adhere to the core framework constraints outlined below.

---

## 6.1 Architectural Golden Rules

### 1. Files That Must Never Be Modified
Never alter the shared engine files for an individual course:
* `bootstrap.js`
* `brightspace/framework-registry.js`
* `brightspace/scripts/framework.js`
* `brightspace/scripts/assignment.js`
* `brightspace/scripts/document.js`
* `brightspace/scripts/written-assignment.js`
* `brightspace/styles/*.css` (`framework.css`, `assignment.css`, `document.css`, `written-assignment.css`)

> **Portability Principle:** All course-specific customizations belong exclusively in `course-config.js`, `PAGE_CONFIG`, `ASSIGNMENT_CONFIG`, `DOCUMENT_CONFIG`, or dedicated course module registries (`modules.js`).

---

### 2. Never Hardcode Brightspace URLs
Never write absolute `/content/enforced/...` paths into HTML or CSS. Courses are frequently cloned or migrated between academic terms, which changes the course site ID.
* Use `data-asset="filename.ext"` on `<img>` tags.
* Use `data-bg-asset="filename.ext"` on background containers.
* Use `window.COURSE_CONFIG.paths` in custom scripts.

---

### 3. Hyperlink Target Conventions
* **Internal Brightspace links:** Must use `target="_top"` to break out of LMS iframe wrappers (e.g., dropbox links, syllabus links, discussion forums).
* **External internet links:** Must use `target="_blank"` with modern secure rel attributes.

---

### 4. Cascade Priority Over `!important`
Never use `!important` to force overrides over framework styles. Always wrap page-level stylesheets in `<style data-page-style>` or `<link rel="stylesheet" data-page-style>`. The bootstrap automatically promotes these nodes to the bottom of `<head>`, ensuring clean cascade dominance.

---

### 5. DOM Structure Integrity
* **Sidebar Order:** Always follow `<aside class="sidebar-before">` → `<main class="main-content">` → `<aside class="sidebar-after">`. Never use the deprecated `<aside class="sidebar">`.
* **Hoverpanels:** `.hover-trigger` must contain exactly one direct child `.hover-panel`. Never insert `<p>` tags inside `.hover-panel`; use `<span class="hover-panel-text">`.
* **Decorative Elements:** Always include `aria-hidden="true"` on decorative icons (`<i class="ti ...">`, `<i class="sp ...">`, `<i data-emoji="...">`).

---

## 6.2 Pre-Flight Checklist: Standard Web Page (`course-page`)

Before publishing a standard content page:

- [ ] **Bootstrap Loader:** The page loads `bootstrap-config.js` and `bootstrap.js` with `data-page-type="course-page"`.
- [ ] **Optional Modules:** Required modules (such as `tabler-icons`) are listed in `data-modules`.
- [ ] **No `<title>` Tag:** Browser title is derived dynamically from `courseCode` and `pageShortTitle`.
- [ ] **Shell Containers:** `#fw-sticky-bar` and `#fw-hero` containers are present in the DOM and **empty**.
- [ ] **Container Class:** Layout container is set to `edtech-container` (or `edtech-container no-sidebar` for 1-column layout).
- [ ] **`PAGE_CONFIG` Completed:**
  - [ ] `pageShortTitle` is concise (2–4 words).
  - [ ] `moduleTitle` is defined.
  - [ ] `navSections` entries match `id` attributes on `<h2>` elements.
- [ ] **Section Headings:** `<h2>` headings contain clean text without hardcoded numbers (handled by `autoNumberSections: true`).
- [ ] **Inline ToC:** Placed as `<nav class="inline-toc"></nav>` (empty) as the first child of `.main-content`.
- [ ] **Sidebar Ordering:** If sidebars are present, DOM order is `sidebar-before` → `main-content` → `sidebar-after`.
- [ ] **Hoverpanels:** Every `.hover-trigger` contains a valid `.hover-panel` with `.hover-panel-text` spans (no `<p>` tags).
- [ ] **Images:** Handled with `data-asset="..."` or `data-bg-asset="..."`.
- [ ] **Page Styles:** Local CSS is wrapped in `<style data-page-style>`.

---

## 6.3 Pre-Flight Checklist: Interactive Assignment (`assignment-page`)

In addition to the standard web checklist:

- [ ] **Page Type:** Bootstrap script specifies `data-page-type="assignment-page"`.
- [ ] **`ASSIGNMENT_CONFIG` Declared:**
  - [ ] `assignmentNumber` and `assignmentLabel` set.
  - [ ] `openDate` and `deadline` configured with valid ISO 8601 strings.
  - [ ] Deadline `type` set to `'hard'` or `'soft'`.
  - [ ] `submissionUrl` points to the active Brightspace dropbox folder.
  - [ ] `learningOutcomes` populated with `{ code, label }` objects.
  - [ ] `resources` array populated (or set to `[]`).
- [ ] **Empty Sidebars:** `<aside class="sidebar-before">` and `<aside class="sidebar-after">` are present in the DOM and **completely empty** for automated card injection.
- [ ] **Hero Titles:** `heroTitle` and `heroSubtitle` are set in `PAGE_CONFIG` (the framework adds the eyebrow automatically).
- [ ] **AI Policy Consistency:** The active policy in `ASSIGNMENT_CONFIG.aiPolicy` matches the un-commented callout box in `section-integrity`.
- [ ] **Deliverables Component:** Deliverables use `.assignment-deliverable-list` markup.
- [ ] **Rubric Styles:** If an evaluation rubric table is included, rubric CSS is placed in `<style data-page-style>`.

---

## 6.4 Pre-Flight Checklist: Printable Documents (`printable-document` & `printable-assignment`)

Before printing or distributing PDF documents:

- [ ] **Page Type:** Bootstrap script specifies `data-page-type="printable-document"` or `data-page-type="printable-assignment"`.
- [ ] **Course Metadata:** `course-config.js` contains valid entries for `term`, `year`, `section`, `instructor`, and `institution`.
- [ ] **Institutional Logo:** Logo file is present in `brightspace/assets/` and referenced in `institution.logo`.
- [ ] **`DOCUMENT_CONFIG` Declared:**
  - [ ] `title` and `date` configured.
  - [ ] Every entry in `pages` with an `id` corresponds to an HTML `<template data-document-source="<id>">`.
  - [ ] Page 2 is omitted from the `pages` array (blank sheet is generated automatically).
- [ ] **Written Assignment Verification (if `printable-assignment`):**
  - [ ] `ASSIGNMENT_CONFIG` provides `assignmentNumber`, `assignmentLabel`, and `learningOutcomes`.
  - [ ] `WRITTEN_ASSIGNMENT_CONFIG` declares `duration`, `materialPermitted`, `submissionChecklist`, and `gradingColumns`.
  - [ ] The instructions template contains `<div data-wa-learning-outcomes></div>`.
  - [ ] Content templates use `.wa-question`, `.wa-answer-lines`, `.wa-answer-box`, or `.wa-sketch-area`.
  - [ ] Right-hand instructor margins (`instructorMargin`) are verified for layout spacing.
- [ ] **Browser Print Verification:**
  - [ ] Tested via browser print preview (**Ctrl+P** / **Cmd+P**).
  - [ ] Paper size set to **Letter**.
  - [ ] Margins set to **None**.
  - [ ] **Headers and footers unchecked** in the print dialog.

---