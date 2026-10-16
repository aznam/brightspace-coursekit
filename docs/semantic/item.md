# `s:item`

List entry with direct text, links, and nested lists.

**Schema:** `framework/semantic/item/item.xsd`

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
| `s:list` | 1..1 |

Text nodes may appear before, after, or between permitted child elements (mixed content).

## Example

```xml
<s:item>See <s:link href="notes.html">course notes</s:link>.</s:item>
```

## Mapping in `course-page`

`s:item` → `p:item` (HTML list item).

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
