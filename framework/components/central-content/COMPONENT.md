---
id: central-content
element: central-content
status: public
manifest: ./component.json
---

# `central-content`

Main page content container for sections and other content elements.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<central-content><section id="overview"><title>Overview</title><p>Welcome.</p></section></central-content>
```

## Behavior and constraints

Required once in the page layout.

## Implementation

- Manifest: [`component.json`](./component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
