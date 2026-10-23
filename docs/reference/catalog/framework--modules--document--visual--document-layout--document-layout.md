# `framework/modules/document/visual/document-layout/document-layout.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:document`

**Source XSD:** `framework/modules/document/visual/document-layout/document-layout.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `document-layout` |
| schema | `$(frameworkRoot)/modules/document/visual/document-layout/document-layout.xsd` |
| template | `$(frameworkRoot)/modules/document/visual/document-layout/template.xslt` |
| renderer | `$(frameworkRoot)/modules/document/visual/document-layout/renderer.js` |
| styles | $(frameworkRoot)/modules/document/visual/document-layout/document-layout.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentLayoutType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DocumentLayoutType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `DocumentLayoutType` | `cover` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/document/visual/document-layout/document-layout.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-accent-light`, `--ck-border`, `--ck-font-body`, `--ck-structure`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `ck-children`, `ck-slot`, `div`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
