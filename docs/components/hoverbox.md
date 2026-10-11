---
id: hoverbox
element: hoverbox
status: public
manifest: ./component.json
---

# `hoverbox`

Inline trigger exposing a supporting content panel.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<hoverbox><trigger>Key term</trigger><panel><title>Definition</title><span>Explanation.</span></panel></hoverbox>
```

## Behavior and constraints

Uses a trigger and a panel; review keyboard interaction in the runtime implementation.

## Implementation

- Manifest: [`component.json`](../../framework/components/hoverbox/component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
