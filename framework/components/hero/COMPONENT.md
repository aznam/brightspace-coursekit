---
id: hero
element: hero
status: public
manifest: ./component.json
---

# `hero`

Page introduction featuring title, subtitle and an optional background image.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `image` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<hero image="hero-sample.svg"><title>${course.title}</title><subtitle>Introduction</subtitle></hero>
```

## Behavior and constraints

The image is a course asset reference resolved by the resource provider.

## Implementation

- Manifest: [`component.json`](./component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
