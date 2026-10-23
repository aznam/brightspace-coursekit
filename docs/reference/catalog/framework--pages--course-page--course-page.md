# `framework/pages/course-page/course-page.xsd`

**Category:** page · **Ownership:** native · **Target namespace:** `urn:coursekit:page`

**Source XSD:** `framework/pages/course-page/course-page.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `link` | `inline` | `—` |
| `hoverbox` | `c:HoverboxType` | `—` |
| `picture` | `c:PictureType` | `—` |
| `video` | `c:VideoType` | `—` |
| `illustration` | `inline` | `—` |
| `inline-toc` | `inline` | `—` |
| `text-style` | `inline` | `—` |
| `paragraph` | `inline` | `—` |
| `heading` | `inline` | `—` |
| `item` | `inline` | `—` |
| `list` | `inline` | `—` |
| `tutorial` | `inline` | `—` |
| `summary-box` | `inline` | `—` |
| `infobox` | `inline` | `—` |
| `collapse-box` | `inline` | `—` |
| `side` | `inline` | `—` |
| `section` | `inline` | `—` |
| `central-content` | `inline` | `—` |
| `sidebar-before` | `inline` | `—` |
| `sidebar-after` | `inline` | `—` |
| `navbar` | `inline` | `—` |
| `hero` | `c:HeroType` | `—` |
| `layout` | `inline` | `—` |
| `course-page` | `p:CoursePageType` | `p:page` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `CoursePageType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `CoursePageType` | `p:PageType` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `CoursePageType` | `p:layout` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
