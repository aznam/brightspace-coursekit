# `framework/visual/inline-toc/inline-toc.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/inline-toc/inline-toc.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `inline-toc` |
| schema | `$(frameworkRoot)/visual/inline-toc/inline-toc.xsd` |
| template | `$(frameworkRoot)/visual/inline-toc/template.xslt` |
| renderer | `$(frameworkRoot)/visual/inline-toc/renderer.js` |
| styles | $(frameworkRoot)/visual/inline-toc/inline-toc.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `InlineTocType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `InlineTocType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `InlineTocType` | `label` | `xs:string` | optional | — |
| `InlineTocType` | `aria-label` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/inline-toc/inline-toc.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-border`, `--ck-easing-default`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-font-weight-semibold`, `--ck-inline-toc-border-color`, `--ck-inline-toc-column-gap`, `--ck-inline-toc-font-size`, `--ck-inline-toc-indent`, `--ck-inline-toc-label-color`, `--ck-inline-toc-link-color`, `--ck-inline-toc-padding-y`, `--ck-inline-toc-row-gap`, `--ck-inline-toc-separator-color`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-space-2xs`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xs`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `ck-children`, `nav`, `strong`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
