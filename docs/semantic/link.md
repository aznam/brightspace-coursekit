# `s:link`

Hyperlink whose content may be direct text, paragraphs, pictures, or a mixture.

**Schema:** `framework/semantic/link/link.xsd`

**Content model:** Mixed text and elements.

## Attributes

| Attribute | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `ID` | No | Common XML ID |
| `title` | `string` | No | Common title; for `s:picture`, used as alt text by the standard page transform |
| `href` | `anyURI` | Yes | Link target |

## Allowed child elements

| Element | Occurrence in model |
| --- | --- |
| `s:paragraph` | 1..1 |
| `s:picture` | 1..1 |

Text nodes may appear before, after, or between permitted child elements (mixed content).

## Example

```xml
<s:link href="syllabus.pdf">Download the syllabus</s:link>

<s:link href="resource.html">
  <s:paragraph>A structured link label.</s:paragraph>
</s:link>
```

## Mapping in `course-page`

`s:link` → `p:link`; link rendering eventually produces an HTML anchor.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.