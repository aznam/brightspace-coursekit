# `hoverbox`

Inline popover or hover information

**Source:** `framework/visual/hoverbox/`

## Manifest contract

| Field | Value |
| --- | --- |
| `id` | `hoverbox` |
| `template` | `$(frameworkRoot)/visual/hoverbox/template.xslt` |
| `renderer` | `$(frameworkRoot)/visual/hoverbox/renderer.js` |
| `schema` | `$(frameworkRoot)/visual/hoverbox/hoverbox.xsd` |
| `extends` | `not declared` |
| `styles` | `$(frameworkRoot)/visual/hoverbox/hoverbox.css` |
| `scripts` | `$(frameworkRoot)/visual/hoverbox/hoverbox.js` |
| `variants` | `default` |

## Direct XSD attributes

No direct named attributes in this component XSD; inspect its base type and page composition XSD.

The XSD named type(s): None declared. Inherited attributes, default component attributes (`id`, `variant`, `style-ref`, `init-ref` when supported), and **allowed children** may be defined elsewhere, particularly in `framework/visual/base-component/base-component.xsd` and `framework/pages/course-page/course-page.xsd`. A standalone visual-type XSD does not necessarily enumerate the child combinations available on a specific page.

## Rendering

This component uses `$(frameworkRoot)/visual/hoverbox/template.xslt` to generate HTML and `$(frameworkRoot)/visual/hoverbox/renderer.js` for renderer lifecycle hooks. Where present, CSS and behavior scripts are listed in the manifest. Course-specific CSS may target the `data-style-ref` attribute independently of `data-variant`.