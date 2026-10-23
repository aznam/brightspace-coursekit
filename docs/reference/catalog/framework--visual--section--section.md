# `framework/visual/section/section.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/section/section.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `section` |
| schema | `$(frameworkRoot)/visual/section/section.xsd` |
| template | `$(frameworkRoot)/visual/section/template.xslt` |
| renderer | `$(frameworkRoot)/visual/section/renderer.js` |
| styles | $(frameworkRoot)/visual/section/section.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `SectionType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `SectionType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `SectionType` | `title` | `xs:string` | optional | — |
| `SectionType` | `nav` | `xs:boolean` | optional | — |
| `SectionType` | `nav-label` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/section/section.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-section-internal-title-color` | `var(--ck-text-dark)` | Declared locally |
| `--ck-section-internal-title-transform` | `uppercase` | Declared locally |
| `--ck-section-internal-title-letter-spacing` | `-0.01em` | Declared locally |
| `--ck-section-internal-title-border-width` | `2px` | Declared locally |
| `--ck-section-internal-title-padding-end` | `var(--ck-space-2xs)` | Declared locally |
| `--ck-section-internal-title-gap` | `var(--ck-prose-gap)` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-border`, `--ck-font-display`, `--ck-font-weight-bold`, `--ck-heading-2-size`, `--ck-heading-3-size`, `--ck-heading-4-size`, `--ck-heading-5-size`, `--ck-heading-6-size`, `--ck-leading-heading-section`, `--ck-letter-spacing-normal`, `--ck-navbar-offset`, `--ck-prose-gap`, `--ck-reading-width`, `--ck-section-content-gap`, `--ck-section-internal-title-border-width`, `--ck-section-internal-title-color`, `--ck-section-internal-title-gap`, `--ck-section-internal-title-letter-spacing`, `--ck-section-internal-title-padding-end`, `--ck-section-internal-title-transform`, `--ck-section-level-1-title-size`, `--ck-section-level-2-title-size`, `--ck-section-level-3-title-size`, `--ck-section-level-4-title-size`, `--ck-section-level-5-title-size`, `--ck-section-level-6-title-size`, `--ck-section-subsection-gap`, `--ck-section-title-border-color`, `--ck-section-title-border-width`, `--ck-section-title-color`, `--ck-section-title-font-family`, `--ck-section-title-gap`, `--ck-section-title-letter-spacing`, `--ck-section-title-line-height`, `--ck-section-title-padding-end`, `--ck-section-title-transform`, `--ck-section-title-weight`, `--ck-space-2xs`, `--ck-space-md`, `--ck-space-sm`, `--ck-subsection-gap`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `ck-children`, `div`, `h2`, `section`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
