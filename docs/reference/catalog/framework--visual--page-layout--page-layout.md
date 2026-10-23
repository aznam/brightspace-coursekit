# `framework/visual/page-layout/page-layout.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/page-layout/page-layout.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `layout` |
| schema | `$(frameworkRoot)/visual/page-layout/page-layout.xsd` |
| template | `$(frameworkRoot)/visual/page-layout/template.xslt` |
| renderer | `$(frameworkRoot)/visual/page-layout/renderer.js` |
| styles | $(frameworkRoot)/visual/page-layout/page-layout.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `LayoutType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `LayoutType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `LayoutType` | `title` | `xs:string` | optional | — |
| `LayoutType` | `subtitle` | `xs:string` | optional | — |
| `LayoutType` | `image` | `xs:string` | optional | — |
| `LayoutType` | `background` | `xs:string` | optional | — |
| `LayoutType` | `page-numbered` | `xs:boolean` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/page-layout/page-layout.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-page-layout-internal-max-width` | `77.5rem` | Declared locally |
| `--ck-page-layout-internal-single-max-width` | `70.75rem` | Declared locally |
| `--ck-page-layout-internal-sidebar-width` | `21.25rem` | Declared locally |
| `--ck-page-layout-internal-hero-overlap` | `5.625rem` | Declared locally |
| `--ck-page-layout-internal-overlay-start-opacity` | `92%` | Declared locally |
| `--ck-page-layout-internal-overlay-end-opacity` | `97%` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-bg-base`, `--ck-font-body`, `--ck-font-body-size`, `--ck-leading-body`, `--ck-page-layout-bottom-gap`, `--ck-page-layout-column-gap`, `--ck-page-layout-hero-overlap`, `--ck-page-layout-internal-hero-overlap`, `--ck-page-layout-internal-max-width`, `--ck-page-layout-internal-overlay-end-opacity`, `--ck-page-layout-internal-overlay-start-opacity`, `--ck-page-layout-internal-sidebar-width`, `--ck-page-layout-internal-single-max-width`, `--ck-page-layout-main-gap`, `--ck-page-layout-max-width`, `--ck-page-layout-overlay-end`, `--ck-page-layout-overlay-start`, `--ck-page-layout-padding-inline`, `--ck-page-layout-sidebar-gap`, `--ck-page-layout-sidebar-width`, `--ck-page-layout-single-max-width`, `--ck-page-layout-stacked-gap`, `--ck-page-layout-stacked-padding`, `--ck-section-gap`, `--ck-space-lg`, `--ck-space-sm`, `--ck-subsection-gap`, `--ck-text-main`, `--ck-z-base`

**Template output elements (static inventory):** `ck-children`, `ck-slot`, `div`, `main`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
