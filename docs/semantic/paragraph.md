# `s:paragraph`

Mixed prose with inline links.

**Schema:** `framework/semantic/paragraph/paragraph.xsd`

**Content model:** Mixed text and elements.

## Attributes

| Attribute | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `ID` | No | Common XML ID |
| `title` | `string` | No | Common title; for `s:picture`, used as alt text by the standard page transform |

## Allowed child elements

| Element | Occurrence in model |
| --- | --- |
| `s:link` | 1..1 |

Text nodes may appear before, after, or between permitted child elements (mixed content).

## Example

```xml
<s:paragraph>Read the <s:link href="syllabus.pdf">course syllabus</s:link>.</s:paragraph>
```

## Mapping in `course-page`

`s:paragraph` → `p:paragraph`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
