# `framework/visual/collapse-box/collapse-box.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/collapse-box/collapse-box.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `collapse-box` |
| schema | `$(frameworkRoot)/visual/collapse-box/collapse-box.xsd` |
| template | `$(frameworkRoot)/visual/collapse-box/template.xslt` |
| renderer | `$(frameworkRoot)/visual/collapse-box/renderer.js` |
| styles | $(frameworkRoot)/visual/collapse-box/collapse-box.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `CollapseBoxType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `CollapseBoxType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `CollapseBoxType` | `title` | `xs:string` | optional | — |
| `CollapseBoxType` | `open` | `xs:boolean` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/collapse-box/collapse-box.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-accent-light`, `--ck-border`, `--ck-collapse-accent-color`, `--ck-collapse-background`, `--ck-collapse-body-gap`, `--ck-collapse-body-padding-y`, `--ck-collapse-border-color`, `--ck-collapse-border-radius`, `--ck-collapse-color`, `--ck-collapse-padding-inline`, `--ck-collapse-shadow`, `--ck-collapse-summary-bg`, `--ck-collapse-summary-color`, `--ck-collapse-summary-hover-bg`, `--ck-collapse-summary-letter-spacing`, `--ck-collapse-summary-padding-y`, `--ck-easing-default`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-list-indent`, `--ck-motion-fast`, `--ck-paragraph-gap-box`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-sm`, `--ck-space-xs`, `--ck-surface`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `ck-children`, `details`, `div`, `summary`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
