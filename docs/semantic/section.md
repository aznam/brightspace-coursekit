# `s:section`

Structured content section. Sections may be nested.

**Schema:** `framework/semantic/section/section.xsd`

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
| `s:heading` | 1..1 |
| `s:list` | 1..1 |
| `s:note` | 1..1 |
| `s:information` | 1..1 |
| `s:picture` | 1..1 |
| `s:section` | 1..1 |

## Example

```xml
<s:section id="goals" title="Learning goals" nav="true">
  <s:paragraph>This section introduces the key concepts.</s:paragraph>
  <s:section id="details" title="Details" nav="false">
    <s:paragraph>Additional information.</s:paragraph>
  </s:section>
</s:section>
```

## Mapping in `course-page`

`s:section` → `p:section`; `nav="true"` also contributes a navbar link.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
