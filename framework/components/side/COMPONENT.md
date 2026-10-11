---
id: side
element: side
status: public
manifest: ./component.json
---

# `side`

Optional sidebar for facts, links and supplemental content.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `position` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<side position="before"><title>Quick facts</title><facts><fact label="Term" value="Fall"/></facts></side>
```

## Behavior and constraints

A page may contain zero, one or two sidebars. Placement depends on page structure and the position attribute.

## Implementation

- Manifest: [`component.json`](./component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
