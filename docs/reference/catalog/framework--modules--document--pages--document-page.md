# `framework/modules/document/pages/document-page.xsd`

**Category:** page · **Ownership:** module · **Target namespace:** `urn:coursekit:page:document`

**Source XSD:** `framework/modules/document/pages/document-page.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `document-layout` | `inline` | `—` |
| `document-toolbar` | `mc:DocumentToolbarType` | `—` |
| `document-cover` | `inline` | `—` |
| `document-cover-brand` | `mc:DocumentCoverBrandType` | `—` |
| `document-cover-title` | `mc:DocumentCoverTitleType` | `—` |
| `document-cover-meta` | `mc:DocumentCoverMetaType` | `—` |
| `document-sheet` | `inline` | `—` |
| `document-page-frame` | `inline` | `—` |
| `document-header` | `mc:DocumentHeaderType` | `—` |
| `document-footer` | `mc:DocumentFooterType` | `—` |
| `document-body` | `inline` | `—` |
| `document-flow` | `inline` | `—` |
| `document-section` | `inline` | `—` |
| `document-paragraph` | `inline` | `—` |
| `document-note` | `inline` | `—` |
| `document-list` | `inline` | `—` |
| `document-figure` | `mc:DocumentFigureType` | `—` |
| `document-end` | `mc:DocumentEndType` | `—` |
| `document-blank` | `mc:DocumentBlankType` | `—` |
| `document-author` | `mc:DocumentAuthorType` | `—` |
| `document-break` | `mc:DocumentBreakType` | `—` |
| `document-page` | `mp:DocumentPageType` | `p:page` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentPageType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DocumentPageType` | `p:PageType` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `DocumentPageType` | `mp:document-layout` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
