---
id: picture-without-legend
element: picture-without-legend
status: public
manifest: ./component.json
---

# `picture-without-legend`

Image displayed without a figcaption legend.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `src` | Yes | XML attribute validated by `course-page.xsd`. |
| `alt` | No | XML attribute validated by `course-page.xsd`. |
| `width` | No | XML attribute validated by `course-page.xsd`. |
| `loading` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<picture-without-legend src="diagram.svg" alt="Architecture diagram"/>
```

## Behavior and constraints

Inherits the picture renderer and does not accept a legend.

## Implementation

- Manifest: [`component.json`](./component.json)
- Inherits: `picture`
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
