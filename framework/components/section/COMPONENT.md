---
id: section
element: section
status: public
manifest: ./component.json
---

# `section`

Content section with optional identifier, heading and nested content.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `id` | No | XML attribute validated by `course-page.xsd`. |
| `nav` | No | XML attribute validated by `course-page.xsd`. |
| `nav-label` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<section id="intro"><title>Introduction</title><p>Content</p></section>
```

## Behavior and constraints

The section heading level depends on nesting depth.

## Implementation

- Manifest: [`component.json`](./component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
