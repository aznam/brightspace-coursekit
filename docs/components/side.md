# `side`

Sidebar panel

**Source:** `framework/visual/side/`

## Manifest contract

| Field | Value |
| --- | --- |
| `id` | `side` |
| `template` | `$(frameworkRoot)/visual/side/template.xslt` |
| `renderer` | `$(frameworkRoot)/visual/side/renderer.js` |
| `schema` | `$(frameworkRoot)/visual/side/side.xsd` |
| `extends` | `not declared` |
| `styles` | `$(frameworkRoot)/visual/side/side.css` |
| `scripts` | None declared |
| `variants` | `default` |

## Direct XSD attributes

No direct named attributes in this component XSD; inspect its base type and page composition XSD.

The XSD named type(s): None declared. Inherited attributes, default component attributes (`id`, `variant`, `style-ref`, `init-ref` when supported), and **allowed children** may be defined elsewhere, particularly in `framework/visual/base-component/base-component.xsd` and `framework/pages/course-page/course-page.xsd`. A standalone visual-type XSD does not necessarily enumerate the child combinations available on a specific page.

## Rendering

This component uses `$(frameworkRoot)/visual/side/template.xslt` to generate HTML and `$(frameworkRoot)/visual/side/renderer.js` for renderer lifecycle hooks. Where present, CSS and behavior scripts are listed in the manifest. Course-specific CSS may target the `data-style-ref` attribute independently of `data-variant`.