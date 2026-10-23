# `framework/visual/summary-box/summary-box.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/summary-box/summary-box.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `summary-box` |
| schema | `$(frameworkRoot)/visual/summary-box/summary-box.xsd` |
| template | `$(frameworkRoot)/visual/summary-box/template.xslt` |
| renderer | `$(frameworkRoot)/visual/summary-box/renderer.js` |
| styles | $(frameworkRoot)/visual/summary-box/summary-box.css |
| scripts |  |
| variants | normal, important, key |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `SummaryBoxType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `SummaryBoxType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `SummaryBoxType` | `title` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/summary-box/summary-box.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-summary-box-internal-accent` | `var(--ck-text-dark)` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-border`, `--ck-color-warning`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-paragraph-gap-box`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-sm`, `--ck-summary-box-accent`, `--ck-summary-box-accent-border-color`, `--ck-summary-box-accent-border-width`, `--ck-summary-box-background`, `--ck-summary-box-border`, `--ck-summary-box-border-width`, `--ck-summary-box-font-size`, `--ck-summary-box-gap`, `--ck-summary-box-internal-accent`, `--ck-summary-box-line-height`, `--ck-summary-box-padding`, `--ck-summary-box-shadow`, `--ck-summary-box-title-size`, `--ck-surface`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `aside`, `ck-children`, `div`, `h2`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
