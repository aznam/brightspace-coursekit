# `central-content`

Primary area for page content

**Source:** `framework/visual/central-content/`

## Manifest contract

| Field | Value |
| --- | --- |
| `id` | `central-content` |
| `template` | `$(frameworkRoot)/visual/central-content/template.xslt` |
| `renderer` | `$(frameworkRoot)/visual/central-content/renderer.js` |
| `schema` | `$(frameworkRoot)/visual/central-content/central-content.xsd` |
| `extends` | `not declared` |
| `styles` | `$(frameworkRoot)/visual/central-content/central-content.css` |
| `scripts` | None declared |
| `variants` | `default` |

## Direct XSD attributes

No direct named attributes in this component XSD; inspect its base type and page composition XSD.

The XSD named type(s): None declared. Inherited attributes, default component attributes (`id`, `variant`, `style-ref`, `init-ref` when supported), and **allowed children** may be defined elsewhere, particularly in `framework/visual/base-component/base-component.xsd` and `framework/pages/course-page/course-page.xsd`. A standalone visual-type XSD does not necessarily enumerate the child combinations available on a specific page.

## Rendering

This component uses `$(frameworkRoot)/visual/central-content/template.xslt` to generate HTML and `$(frameworkRoot)/visual/central-content/renderer.js` for renderer lifecycle hooks. Where present, CSS and behavior scripts are listed in the manifest. Course-specific CSS may target the `data-style-ref` attribute independently of `data-variant`.
