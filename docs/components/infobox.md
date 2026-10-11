---
id: infobox
element: infobox
status: public
manifest: ./component.json
---

# `infobox`

Themed information box with optional title and icon.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `variant` | No | XML attribute validated by `course-page.xsd`. |
| `icon` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<infobox variant="info"><title>Note</title><p>Important information.</p></infobox>
```

## Behavior and constraints

Icon rendering may use the course-provided icon configuration or built-in icons.

## Implementation

- Manifest: [`component.json`](../../framework/components/infobox/component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
