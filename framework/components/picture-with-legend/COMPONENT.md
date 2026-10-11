---
id: picture-with-legend
element: picture-with-legend
status: public
manifest: ./component.json
---

# `picture-with-legend`

Image displayed with a figcaption legend.

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
<picture-with-legend src="diagram.svg" alt="Architecture diagram"><legend>Overview</legend></picture-with-legend>
```

## Behavior and constraints

Inherits the picture renderer and requires a legend in the structural XSD.

## Implementation

- Manifest: [`component.json`](./component.json)
- Inherits: `picture`
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
