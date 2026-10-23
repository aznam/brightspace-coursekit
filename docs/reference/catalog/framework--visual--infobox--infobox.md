# `framework/visual/infobox/infobox.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/infobox/infobox.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `infobox` |
| schema | `$(frameworkRoot)/visual/infobox/infobox.xsd` |
| template | `$(frameworkRoot)/visual/infobox/template.xslt` |
| renderer | `$(frameworkRoot)/visual/infobox/renderer.js` |
| styles | $(frameworkRoot)/visual/infobox/infobox.css |
| scripts |  |
| variants | default, info, warning, success, error, dark, neutral |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `InfoboxType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `InfoboxType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `InfoboxType` | `title` | `xs:string` | optional | — |
| `InfoboxType` | `icon` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/infobox/infobox.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-infobox-accent` | `var(--ck-color-info)` | Declared locally |
| `--ck-infobox-bg` | `color-mix(in srgb, var(--ck-infobox-accent) 12%, var(--ck-surface))` | Declared locally |
| `--ck-infobox-border` | `color-mix(in srgb, var(--ck-infobox-accent) 35%, var(--ck-surface))` | Declared locally |
| `--ck-infobox-text` | `color-mix(in srgb, var(--ck-infobox-accent) 80%, #000)` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-accent-light`, `--ck-bg-base`, `--ck-border`, `--ck-color-error`, `--ck-color-info`, `--ck-color-success`, `--ck-color-warning`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-infobox-accent`, `--ck-infobox-accent-width`, `--ck-infobox-bg`, `--ck-infobox-body-gap`, `--ck-infobox-border`, `--ck-infobox-border-radius`, `--ck-infobox-font-size`, `--ck-infobox-icon-size`, `--ck-infobox-line-height`, `--ck-infobox-padding-block`, `--ck-infobox-padding-inline`, `--ck-infobox-text`, `--ck-infobox-title-weight`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-list-indent`, `--ck-paragraph-gap-box`, `--ck-radius`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-xs`, `--ck-structure`, `--ck-surface`, `--ck-surface-muted`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `aside`, `ck-children`, `div`, `h3`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
