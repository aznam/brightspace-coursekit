# `navbar`

Course/navigation bar

**Source:** `framework/visual/navbar/`

## Manifest contract

| Field | Value |
| --- | --- |
| `id` | `navbar` |
| `template` | `$(frameworkRoot)/visual/navbar/template.xslt` |
| `renderer` | `$(frameworkRoot)/visual/navbar/renderer.js` |
| `schema` | `$(frameworkRoot)/visual/navbar/navbar.xsd` |
| `extends` | `not declared` |
| `styles` | `$(frameworkRoot)/visual/navbar/navbar.css` |
| `scripts` | `$(frameworkRoot)/visual/navbar/navbar.js` |
| `variants` | `default` |

## Direct XSD attributes

No direct named attributes in this component XSD; inspect its base type and page composition XSD.

The XSD named type(s): None declared. Inherited attributes, default component attributes (`id`, `variant`, `style-ref`, `init-ref` when supported), and **allowed children** may be defined elsewhere, particularly in `framework/visual/base-component/base-component.xsd` and `framework/pages/course-page/course-page.xsd`. A standalone visual-type XSD does not necessarily enumerate the child combinations available on a specific page.

## Rendering

This component uses `$(frameworkRoot)/visual/navbar/template.xslt` to generate HTML and `$(frameworkRoot)/visual/navbar/renderer.js` for renderer lifecycle hooks. Where present, CSS and behavior scripts are listed in the manifest. Course-specific CSS may target the `data-style-ref` attribute independently of `data-variant`.

The stock `course-page` transformation sets `course-code`, `page-title`, and `module-title` on `p:navbar` from page metadata; these are consumed by the navbar XSLT. The module name is displayed at the right of the navigation bar, subject to responsive CSS.