# Visual component catalog

This is the full set of **registered visual component manifests** in the supplied repository. These components render `p:*` page fragments through their XSLT templates and JavaScript renderers; semantic `s:*` constructs are separately transformed by the selected page XSLT.

| Component directory | Purpose | Manifest ID |
| --- | --- | --- |
| [`central-content`](./central-content.md) | Primary area for page content | `central-content` |
| [`collapse-box`](./collapse-box.md) | Expandable content container | `collapse-box` |
| [`heading`](./heading.md) | Visual heading | `heading` |
| [`hero`](./hero.md) | Hero/header banner | `hero` |
| [`hoverbox`](./hoverbox.md) | Inline popover or hover information | `hoverbox` |
| [`infobox`](./infobox.md) | Styled note/information panel | `infobox` |
| [`inline-toc`](./inline-toc.md) | In-page table of contents | `inline-toc` |
| [`item`](./item.md) | List item | `item` |
| [`link`](./link.md) | Hyperlink | `link` |
| [`list`](./list.md) | List container | `list` |
| [`navbar`](./navbar.md) | Course/navigation bar | `navbar` |
| [`page-layout`](./page-layout.md) | Page layout container | `layout` |
| [`paragraph`](./paragraph.md) | Paragraph content | `paragraph` |
| [`picture`](./picture.md) | Image with optional caption | `picture` |
| [`section`](./section.md) | Section block | `section` |
| [`side`](./side.md) | Sidebar panel | `side` |
| [`sidebar-after`](./sidebar-after.md) | Trailing sidebar region | `sidebar-after` |
| [`sidebar-before`](./sidebar-before.md) | Leading sidebar region | `sidebar-before` |

Each component page documents the manifest, its directly declared XSD attributes, and relevant implementation resources. The **page-specific permitted children** are not implied by these component manifests: consult `framework/pages/course-page/course-page.xsd` for those declarations.

Global behavior: the base `Renderer` handles common attributes such as `id`, `variant` (`data-variant`), and `style-ref` (`data-style-ref`), loads styles/scripts, and delegates transformation to the component's XSLT.
