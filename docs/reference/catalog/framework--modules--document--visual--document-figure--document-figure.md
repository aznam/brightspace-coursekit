# `framework/modules/document/visual/document-figure/document-figure.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:document`

**Source XSD:** `framework/modules/document/visual/document-figure/document-figure.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `document-figure` |
| schema | `$(frameworkRoot)/modules/document/visual/document-figure/document-figure.xsd` |
| template | `$(frameworkRoot)/modules/document/visual/document-figure/template.xslt` |
| renderer | `$(frameworkRoot)/modules/document/visual/document-figure/renderer.js` |
| styles |  |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentFigureType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DocumentFigureType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `DocumentFigureType` | `src` | `xs:string` | optional | — |
| `DocumentFigureType` | `alt` | `xs:string` | optional | — |
| `DocumentFigureType` | `caption` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

No stylesheet declared in this component folder.

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** None

**Template output elements (static inventory):** `figcaption`, `figure`, `img`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
