---
id: navbar
element: navbar
status: public
manifest: ./component.json
---

# `navbar`

Page header displaying course and page context, with navigation derived from page sections.

## XML contract

| Attribute | Required | Description |
|---|---|---|
| `course-code` | No | XML attribute validated by `course-page.xsd`. |
| `page-title` | No | XML attribute validated by `course-page.xsd`. |
| `module-title` | No | XML attribute validated by `course-page.xsd`. |
| `navigate-label` | No | XML attribute validated by `course-page.xsd`. |
| `style-ref` | No | XML attribute validated by `course-page.xsd`. |

## Example

```xml
<navbar course-code="COMP3770" page-title="Introduction"/>
```

## Behavior and constraints

Navigation links are based on sections collected by the page presenter.

## Implementation

- Manifest: [`component.json`](../../framework/components/navbar/component.json)
- XML structure: `framework/schemas/course-page.xsd`
- Rendering and styling: see the files listed in `component.json` (including inherited files).
