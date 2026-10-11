---
id: picture
element: picture
status: abstract
manifest: ./component.json
---

# `picture`

Abstract image renderer inherited by the two public picture variants.

## XML contract

No XML attributes are declared for this element in the current structural schema.

## Example

```xml
<!-- Abstract renderer; use picture-with-legend or picture-without-legend. -->
```

## Behavior and constraints

Internal parent component. This element is not exposed as a page component in the registry.

## Implementation

- Manifest: [`component.json`](../../framework/components/picture/component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
