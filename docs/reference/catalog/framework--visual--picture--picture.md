# `framework/visual/picture/picture.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/picture/picture.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `picture` |
| schema | `$(frameworkRoot)/visual/picture/picture.xsd` |
| template | `$(frameworkRoot)/visual/picture/template.xslt` |
| renderer | `$(frameworkRoot)/visual/picture/renderer.js` |
| styles | $(frameworkRoot)/visual/picture/picture.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `PictureType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `PictureType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `PictureType` | `src` | `xs:string` | required | — |
| `PictureType` | `alt` | `xs:string` | optional | — |
| `PictureType` | `loading` | `xs:string` | optional | — |
| `PictureType` | `width` | `xs:string` | optional | — |
| `PictureType` | `legend` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/picture/picture.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-border`, `--ck-font-body`, `--ck-font-footnote`, `--ck-leading-footnote`, `--ck-picture-background`, `--ck-picture-border-color`, `--ck-picture-border-radius`, `--ck-picture-image-bg`, `--ck-picture-legend-align`, `--ck-picture-legend-color`, `--ck-picture-legend-font-size`, `--ck-picture-legend-gap`, `--ck-picture-legend-line-height`, `--ck-picture-medium-max-width`, `--ck-picture-padding`, `--ck-picture-shadow`, `--ck-picture-small-max-width`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-xs`, `--ck-surface`, `--ck-text-main`

**Template output elements (static inventory):** `figcaption`, `figure`, `img`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
