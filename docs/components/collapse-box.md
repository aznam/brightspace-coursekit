---
id: collapse-box
element: collapse-box
status: public
manifest: ./component.json
---

# `collapse-box`

Disclosure panel rendered as a native HTML details element.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `title` | No | XML attribute validated by `course-page.xsd`. |
| `open` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<collapse-box open="false"><title>Read more</title><p>Details.</p></collapse-box>
```

## Behavior and constraints

The open attribute controls the initial state.

## Implementation

- Manifest: [`component.json`](../../framework/components/collapse-box/component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
