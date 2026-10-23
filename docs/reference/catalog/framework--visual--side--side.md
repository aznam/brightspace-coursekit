# `framework/visual/side/side.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/side/side.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `side` |
| schema | `$(frameworkRoot)/visual/side/side.xsd` |
| template | `$(frameworkRoot)/visual/side/template.xslt` |
| renderer | `$(frameworkRoot)/visual/side/renderer.js` |
| styles | $(frameworkRoot)/visual/side/side.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `SideType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `SideType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `SideType` | `title` | `xs:string` | optional | — |
| `SideType` | `position` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/side/side.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-border`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-outline-strong`, `--ck-shadow`, `--ck-side-background`, `--ck-side-body-gap`, `--ck-side-border-color`, `--ck-side-color`, `--ck-side-padding-block`, `--ck-side-padding-inline`, `--ck-side-shadow`, `--ck-side-title-color`, `--ck-side-title-gap`, `--ck-side-top-border-color`, `--ck-space-2xs`, `--ck-space-md`, `--ck-space-xs`, `--ck-surface`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `aside`, `ck-children`, `div`, `h2`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
