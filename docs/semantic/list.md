# `s:list`

List containing at least one `s:item`.

**Schema:** `framework/semantic/list/list.xsd`

**Content model:** Elements only (no direct text).

## Attributes

| Attribute | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `ID` | No | Common XML ID |
| `title` | `string` | No | Common title; for `s:picture`, used as alt text by the standard page transform |
| `nav` | `boolean` | No | Navigation participation flag |

## Allowed child elements

| Element | Occurrence in model |
| --- | --- |
| `s:item` | 1..unbounded |

**Ordering is represented by content order.** The stock semantic XSD does not define a `type` attribute on `s:list`.

## Example

```xml
<s:list>
  <s:item>First item</s:item>
  <s:item>Second item with <s:link href="reading.html">reading</s:link></s:item>
</s:list>
```

## Mapping in `course-page`

`s:list` → `p:list`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
