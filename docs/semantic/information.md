# `s:information`

Structured information block; the stock course page routes these into a sidebar.

**Schema:** `framework/semantic/information/information.xsd`

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
| `s:paragraph` | 1..1 |
| `s:list` | 1..1 |

## Example

```xml
<s:information id="quick-links" title="Useful links">
  <s:list>
    <s:item><s:link href="syllabus.pdf">Syllabus</s:link></s:item>
  </s:list>
</s:information>
```

## Mapping in `course-page`

`s:information` → `p:side` placed in `sidebar-before` or `sidebar-after` by the page transform.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.