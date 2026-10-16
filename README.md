# Brightspace CourseKit (Development)

**A declarative, component-based framework for creating and maintaining course content in D2L Brightspace.**

This repository contains the **dev branch** of Brightspace CourseKit.

## Why CourseKit?

Maintaining a collection of visually coherent course pages in D2L Brightspace can be tedious. Repeatedly editing markup, layouts, navigation, and styling across pages takes time away from developing instructional material, and small changes can produce inconsistencies between pages.

**CourseKit separates instructional meaning from presentation.** Authors describe content in semantic XML; page definitions and reusable visual components determine how that content is organized and rendered. Its modular architecture lets a course reuse or extend a consistent presentation without continually rebuilding layouts.

This separation can also make LLM-assisted authoring more focused: a language model can work primarily on the semantic content and its contract, rather than spending output tokens reproducing course-specific HTML and CSS on every page. Generated material still requires review for instructional accuracy, accessibility, and correctness.

## Overview

CourseKit uses a staged semantic-content → page-definition → visual-component pipeline, supported by dedicated managers, schema validation, and XSLT transformations. The separation is compatible with an MVP-oriented design, but the pipeline is the more precise description of the current runtime.

This **Model–View–Presenter (MVP)** architecture implemented through a component-oriented rendering system separates three responsibilities:

- **Model:** Course configuration in JSON and page content in XML.
- **Presenter:** The framework engine that interprets content, resolves dependencies, and renders components.
- **View:** Generated HTML, component styles, and interactive behaviours.

This separation allows course content to evolve independently from its presentation, while keeping pages visually consistent and reusable.

**The framework includes `course-page` and an example `learning-page` extension.** Modules register additional semantic contracts, page definitions, and visual components.

## Features

- Declarative XML pages rendered dynamically.
- Reusable, independently styled and responsive components.
- Navigation bars, hero banners, sidebars, sections, tables of contents, information boxes, collapsible content, hoverboxes, and images.
- Course-level and page-level variables.
- Customizable themes, styles, scripts, and multiple local or online fonts.
- Component inheritance and reusable modules.
- Custom component styling through `style-ref`.
- Automatic resource and schema resolution.
- Minimal HTTP server for local development.
- Example course and module templates.
- Python-based local development server scripts.

## Repository structure

```text
/
├── framework/                # Shared CourseKit runtime
│   ├── bootstrap.js
│   ├── registry.json
│   ├── components/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   ├── fonts/
│   └── schemas/
│
├── example-course/           # Working example
│   ├── bootstrap-config.js
│   ├── course.json
│   ├── page.html
│   ├── content/
│   ├── assets/
│   ├── attachments/
│   ├── fonts/
│   ├── scripts/
│   ├── styles/
│   └── modules/
│
├── templates/                # Reusable templates
│   
├── tools/
|   ├── local/                # Local development tools
│   └── deployed/             # Optional GA-restricted tools
│
└── start-server.* / stop-server.*   # Local development scripts
```

The `framework/` directory contains the reusable rendering system. Course-specific content and resources are kept within individual course directories.

## Installation and local development

**Requirements:** Python 3 and a modern web browser.

The repository includes a minimal HTTP development server based on the Python standard library. No additional Python packages are required to run the server.

### 1. Get CourseKit

Clone the `dev` branch:

```bash
git clone --branch dev https://github.com/aznam/brightspace-coursekit.git
```

Alternatively, download and extract the repository.

### 2. Start the development server

From the repository root, run the script matching your operating system.

**Windows**

```bat
start-server.bat
```

**PowerShell**

```powershell
.\start-server.ps1
```

**Linux / macOS**

```bash
./start-server.sh
```

The server runs in the background.

### 3. Open the example course

Open the following URL:

http://127.0.0.1:8000/example-course/index.html

During development, keep **Disable cache** enabled in the browser's developer tools if changes to CSS or JavaScript do not appear immediately.

### 4. Stop the server

Use the corresponding script:

- `stop-server.bat`
- `stop-server.ps1`
- `stop-server.sh`

## Creating your own course

The `example-course/` directory is a working example and the recommended starting point.

1. Copy `example-course/` into a new course directory.
2. Edit `course.json` to define the course identity, visual theme, fonts, variables, and resources.
3. Configure `bootstrap-config.js` to locate the framework, course root, and course configuration.
4. Create or modify XML files under `content/`.
5. Create HTML host pages that identify the XML content to render.
6. Preview your pages through the local HTTP server.

The XML files are the source of truth for instructional content. HTML host pages only initialize CourseKit and identify the content to display.

### Configuring the bootstrap

Each course has its own `bootstrap-config.js`.

Only three paths are configured:

```javascript
// USER CONFIGURATION
const frameworkPath = '../framework/';
const courseRoot = './';
const courseConfig = 'course.json';
```

| Parameter | Purpose |
|---|---|
| `frameworkPath` | Location of the shared CourseKit framework |
| `courseRoot` | Root directory of the course |
| `courseConfig` | Course configuration file, relative to the course root |

`frameworkPath` and `courseRoot` are resolved relative to `bootstrap-config.js`; `courseConfig` is resolved relative to `courseRoot`.

The configuration script automatically loads `framework/bootstrap.js`. The framework then handles its own registry, components, schemas, styles, and scripts.

**Users do not need to configure these internal resources manually.**

### Creating an HTML page

Each HTML host must indicate where its `bootstrap-config.js` is located and which XML file it should render.

For example, a page located in the course root can use:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script
    src="./bootstrap-config.js"
    data-content="content/course-page.xml">
  </script>
</head>
<body></body>
</html>
```

If the HTML page is stored elsewhere, adjust the `src` attribute so it points to the course's `bootstrap-config.js`.

The `data-content` attribute identifies the XML document relative to the course root.

CourseKit determines the page type from the semantic XML document’s `page-type` attribute. It is not necessary to declare the type in the HTML host.

### Editing course content

Write **semantic XML** under `content/`. The `page-type` attribute selects the page definition that transforms the content; the page definition produces a validated page XML document, which is rendered by visual components.

```xml
<s:content xmlns:s="urn:coursekit:semantic"
           page-type="course-page"
           title="${course.title}"
           module-name="Introduction"
           toc="true">
    <s:section id="overview" title="Overview" nav="true">
        <s:paragraph>Welcome to ${course.title}.</s:paragraph>
        <s:picture src="example-diagram.svg" title="Diagram description">
            Caption shown below the image.
        </s:picture>
    </s:section>
</s:content>
```

CourseKit interprets this content and renders the corresponding HTML and styles.

Variables can be defined in `course.json` or within a page.

For a complete example, see `example-course/content/overview.xml`.

See the [VitePress documentation](docs/index.md) for the architecture, configuration, page contracts, components, modules, and preprocessors.

## Customizing a course

Each course can provide additional resources without modifying the shared framework.

| Directory | Purpose |
|---|---|
| `content/` | XML page content |
| `assets/` | Images and visual resources |
| `attachments/` | Downloadable documents |
| `fonts/` | Custom font files |
| `styles/` | Course-specific stylesheets |
| `scripts/` | Course-specific JavaScript |
| `modules/` | Additional component and page libraries |

Custom CSS, JavaScript, and fonts are registered through the `resources` configuration in `course.json`.

CourseKit supports multiple font families, including locally hosted fonts and online stylesheets.

Components can also be customized through their supported attributes and `style-ref`, allowing course-specific presentation without changing framework files.

### Resources and modules

**Resources** are individual stylesheets, scripts, or fonts added to a particular course.

**Modules** are reusable libraries that can provide components, page types, styles, scripts, schemas, and dependencies.

The supplied example in `example-course/modules/learning/` demonstrates a module manifest, semantic definitions, and a page extension.

## Resource and schema resolution

CourseKit resolves framework and course resources automatically, independently of the location of the HTML host page. It uses `courseRoot` supplied by `bootstrap-config.js`. When `siteId` is set, `ResourceLoader` redirects course resources under `/content/enforced/<siteId>/<courseRoot path>`; otherwise it preserves the bootstrap root. JSON and XSD references can use `$(frameworkRoot)/...` and `$(courseRoot)/...`. `ResourceLoader` resolves them to URLs and maintains virtual resource identities for compilation. The XSD preprocessor resolves `xs:include`/`xs:import` against the registered virtual schemas, without discarding directory structure.

Resource paths declared in `course.json` can be customized using `customPaths`. See [Resource resolution](docs/architecture/resources.md).

## Brightspace deployment

CourseKit is designed to load XML content and its associated resources directly in Brightspace.

Set `siteId` in `course.json` for Brightspace deployment. `ResourceLoader` then prefixes the bootstrap-defined course path with `/content/enforced/<siteId>/`. Leave `siteId` null for local development. Do not prefix `courseRoot` manually with `/content/enforced/<siteId>/` for this deployment mode.

Deploy the required framework files, course configuration, HTML host pages, XML content, and associated course resources.

**Do not deploy:**

- Local HTTP server files and start/stop scripts.
- Any local-only tooling not required by the runtime.

If you maintain optional tooling outside this snapshot, deploy and permission it separately from course content.

## Development status and disclaimer

**CourseKit is experimental software under active development.**

A substantial portion of the source code was generated by **GPT Astra (OpenAI)** and has **not been fully reviewed, verified, or optimized**.

Consequently, the project may contain bugs, incomplete implementations, inefficient code, or unexpected behaviours.

Users and contributors should review and test the software before relying on it, particularly in production environments.

## Author

Aznam Yacoub  

## License

Copyright © 2026 Aznam Yacoub.

This project is licensed under the [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0). See [`LICENSE`](LICENSE) for the full text.

You may use, modify, and redistribute this software for any noncommercial purpose. Commercial use is not permitted.

Any copy or derivative work must include the license terms (or their URL) and the following notice:

**Required Notice:** Copyright © 2026 Aznam Yacoub (https://github.com/aznam/brightspace-coursekit)
