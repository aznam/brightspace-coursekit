---
id: inline-toc
element: inline-toc
status: public
manifest: ./component.json
---

# `inline-toc`

In-page table of contents built from page navigation sections.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `aria-label` | No | XML attribute validated by `course-page.xsd`. |
| `label` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<inline-toc label="On this page"/>
```

## Behavior and constraints

Items are generated from sections marked for navigation; it has no item children.

## Implementation

- Manifest: [`component.json`](./component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
