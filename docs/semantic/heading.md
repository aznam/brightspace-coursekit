# `s:heading`

Text heading with optional inline links.

**Schema:** `framework/semantic/heading/heading.xsd`

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
<s:heading title="Further reading">See <s:link href="reading.html">reading list</s:link></s:heading>
```

## Mapping in `course-page`

`s:heading` → `p:heading`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.
