# `framework/modules/assignment/visual/assignment-layout/assignment-layout.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:assignment`

**Source XSD:** `framework/modules/assignment/visual/assignment-layout/assignment-layout.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assignment-layout` |
| schema | `$(frameworkRoot)/modules/assignment/visual/assignment-layout/assignment-layout.xsd` |
| template | `$(frameworkRoot)/modules/assignment/visual/assignment-layout/template.xslt` |
| renderer | `$(frameworkRoot)/modules/assignment/visual/assignment-layout/renderer.js` |
| styles | $(frameworkRoot)/modules/assignment/visual/assignment-layout/assignment-layout.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssignmentLayoutType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssignmentLayoutType` | `c:LayoutType` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AssignmentLayoutType` | `assignment-ref` | `xs:string` | required | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/assignment/visual/assignment-layout/assignment-layout.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-assignment-layout-main-max-width`, `--ck-assignment-layout-region-gap`, `--ck-assignment-layout-summary-grid-gap`, `--ck-page-layout-internal-max-width`, `--ck-page-layout-max-width`, `--ck-page-layout-padding-inline`, `--ck-page-layout-stacked-padding`, `--ck-section-gap`, `--ck-space-lg`, `--ck-space-sm`, `--ck-subsection-gap`

**Template output elements (static inventory):** `ck-slot`, `div`, `main`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
