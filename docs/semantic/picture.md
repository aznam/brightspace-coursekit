# `s:picture`

Image reference with required source; `title` supplies alternative text in the stock page mapping and element text supplies an optional caption.

**Schema:** `framework/semantic/picture/picture.xsd`

**Content model:** text-only (optional caption); no element children.

## Attributes

| Attribute | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `ID` | No | Common XML ID |
| `title` | `string` | No | Common title; for `s:picture`, used as alt text by the standard page transform |
| `src` | `string` | Yes | Image source |

## Example

```xml
<s:picture src="diagram.svg" title="Diagram showing the course workflow">
  The course workflow.
</s:picture>
```

## Mapping in `course-page`

`s:picture` → `p:picture`, mapping `title` → `alt` and text → `legend`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
