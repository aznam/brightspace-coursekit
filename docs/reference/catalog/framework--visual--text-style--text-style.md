# `framework/visual/text-style/text-style.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/text-style/text-style.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `text-style` |
| schema | `$(frameworkRoot)/visual/text-style/text-style.xsd` |
| template | `$(frameworkRoot)/visual/text-style/template.xslt` |
| renderer | `$(frameworkRoot)/visual/text-style/renderer.js` |
| styles | $(frameworkRoot)/visual/text-style/text-style.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `TextStyleType` | mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `TextStyleType` | `c:VisualNode` |
| `TextStyleType` | `xs:string` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `TextStyleType` | `kind` | `inferred` | required | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/text-style/text-style.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-font-weight-bold`, `--ck-text-style-emphase-style`, `--ck-text-style-important-weight`, `--ck-text-style-underline-decoration`

**Template output elements (static inventory):** `ck-children`, `em`, `strong`, `u`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
