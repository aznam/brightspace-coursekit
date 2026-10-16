# Rendering pipeline

```mermaid
flowchart TD
  A[HTML host page] --> B[bootstrap-config.js]
  B --> C[framework/bootstrap.js]
  C --> D[ConfigManager and other manager initialization]
  D --> E[ContentManager: load semantic XML]
  E --> F[Interpolate JSON values and validate semantic XML]
  F --> G[PagesManager: select page-type and validate public parameters]
  G --> H[Page XSLT: semantic XML to page XML]
  H --> I[Resolve page metadata variables and validate page XSD]
  I --> J[ComponentsManager: select renderer per visual component]
  J --> K[Component XSLT, attributes, styles and scripts]
  K --> L[ContentManager: mount HTML and initialize behaviors]
```

## Separation of contracts

| Layer | Example | Owner |
| --- | --- | --- |
| Semantic document | `s:content`, `s:section`, `s:paragraph` | `ContentManager`, semantic XSDs |
| Intermediate page document | `p:course-page` → `p:meta` + `p:layout` | `PagesManager`, selected page XSD and XSLT |
| Visual component fragments | `p:navbar`, `p:hero`, `p:section` | `ComponentsManager`, component manifests/XSDs |
| Rendered HTML | `.ck-navbar`, `.ck-hero` etc. | Individual renderers and XSLTs |

`p:course-page` is a document envelope; `p:layout` is a visual component. The shared page base XSD declares metadata and abstract `p:page`, but does not depend on a particular visual component. `course-page.xsd` extends that base to require `p:layout`.

The `learning` module registers an independently selectable `learning-page` built from `course-page` plus an overlay. Selecting `course-page` alone does **not** apply that overlay.
