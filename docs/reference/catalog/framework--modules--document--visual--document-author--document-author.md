# `framework/modules/document/visual/document-author/document-author.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:document`

**Source XSD:** `framework/modules/document/visual/document-author/document-author.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `document-author` |
| schema | `$(frameworkRoot)/modules/document/visual/document-author/document-author.xsd` |
| template | `$(frameworkRoot)/modules/document/visual/document-author/template.xslt` |
| renderer | `$(frameworkRoot)/modules/document/visual/document-author/renderer.js` |
| styles | $(frameworkRoot)/modules/document/visual/document-author/document-author.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentAuthorType` | mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DocumentAuthorType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `DocumentAuthorType` | `name` | `xs:string` | optional | — |
| `DocumentAuthorType` | `role` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/document/visual/document-author/document-author.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** None

**Template output elements (static inventory):** `div`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
