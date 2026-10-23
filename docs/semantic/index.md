# Semantic components — authoring reference

**Start here when writing course XML.** The `s:*` elements express instructional content and structure. You should not normally write `p:*` visual components yourself: the selected page XSLT creates those for the rendering layer.

The contracts below are derived from the semantic XSDs in the supplied repository snapshot. Elements marked `l:*` belong to the example **learning** module and require that module to be enabled.

| Component | Purpose |
| --- | --- |
| [`s:content`](./content.md) | Root document of a semantic page. Selects the page implementation through `page-type`. |
| [`s:section`](./section.md) | Structured content section. Sections may be nested. |
| [`s:paragraph`](./paragraph.md) | Mixed prose with inline links. |
| [`s:heading`](./heading.md) | Text heading with optional inline links. |
| [`s:link`](./link.md) | Hyperlink whose content may be direct text, paragraphs, pictures, or a mixture. |
| [`s:picture`](./picture.md) | Image reference with required source; `title` supplies alternative text in the stock page mapping and element text supplies an optional caption. |
| [`s:list`](./list.md) | List containing at least one `s:item`. |
| [`s:item`](./item.md) | List entry with direct text, links, and nested lists. |
| [`s:note`](./note.md) | Structured note. Use `s:paragraph` or `s:list` children, not direct text. |
| [`s:information`](./information.md) | Structured information block; the stock course page routes these into a sidebar. |

## Related references

- [Learning module elements](./learning.md)
- [Authoring a page](../guide/authoring.md)
- [Semantic → page → visual pipeline](../architecture/pipeline.md)
- [Visual component catalogue](../components/index.md)

## Shared conventions

`id` and `title` are inherited from `s:CommonAttr` by most components. Types based on `s:Container` additionally inherit `nav`. The root `s:content` instead uses `page-type` and permits page parameters as attributes. The XSD accepts those extra attributes with lax processing; the selected page manifest imposes its own public parameter contract.

`variant` and `style-ref` belong to the **presentation layer** unless a page or extension explicitly exposes and maps them. They should not be assumed to be supported attributes on every semantic component.