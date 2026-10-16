# `s:note`

Structured note. Use `s:paragraph` or `s:list` children, not direct text.

**Schema:** `framework/semantic/note/note.xsd`

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
<s:note id="prerequisites" title="Prerequisites">
  <s:paragraph>Review the material before continuing.</s:paragraph>
  <s:list><s:item>Required reading</s:item></s:list>
</s:note>
```

## Mapping in `course-page`

`s:note` → `p:infobox`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
