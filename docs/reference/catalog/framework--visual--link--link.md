# `framework/visual/link/link.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/link/link.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `link` |
| schema | `$(frameworkRoot)/visual/link/link.xsd` |
| template | `$(frameworkRoot)/visual/link/template.xslt` |
| renderer | `$(frameworkRoot)/visual/link/renderer.js` |
| styles | $(frameworkRoot)/visual/link/link.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `LinkType` | mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `LinkType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `LinkType` | `href` | `xs:string` | optional | — |
| `LinkType` | `target` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/link/link.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** None

**Template output elements (static inventory):** `a`, `ck-children`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
