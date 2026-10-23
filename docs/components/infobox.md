# `infobox`

Styled note/information panel

**Source:** `framework/visual/infobox/`

## Manifest contract

| Field | Value |
| --- | --- |
| `id` | `infobox` |
| `template` | `$(frameworkRoot)/visual/infobox/template.xslt` |
| `renderer` | `$(frameworkRoot)/visual/infobox/renderer.js` |
| `schema` | `$(frameworkRoot)/visual/infobox/infobox.xsd` |
| `extends` | `not declared` |
| `styles` | `$(frameworkRoot)/visual/infobox/infobox.css` |
| `scripts` | None declared |
| `variants` | `default`, `info`, `warning`, `success`, `error`, `dark`, `neutral` |

## Direct XSD attributes

No direct named attributes in this component XSD; inspect its base type and page composition XSD.

The XSD named type(s): None declared. Inherited attributes, default component attributes (`id`, `variant`, `style-ref`, `init-ref` when supported), and **allowed children** may be defined elsewhere, particularly in `framework/visual/base-component/base-component.xsd` and `framework/pages/course-page/course-page.xsd`. A standalone visual-type XSD does not necessarily enumerate the child combinations available on a specific page.

## Rendering

This component uses `$(frameworkRoot)/visual/infobox/template.xslt` to generate HTML and `$(frameworkRoot)/visual/infobox/renderer.js` for renderer lifecycle hooks. Where present, CSS and behavior scripts are listed in the manifest. Course-specific CSS may target the `data-style-ref` attribute independently of `data-variant`.

The template uses Unicode glyphs (such as ℹ️) for icon defaults; `icon="none"` disables the icon. Course-level icon overrides may be configured in `course.json` and processed by the renderer.