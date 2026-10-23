# `framework/visual/hoverbox/hoverbox.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/hoverbox/hoverbox.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `hoverbox` |
| schema | `$(frameworkRoot)/visual/hoverbox/hoverbox.xsd` |
| template | `$(frameworkRoot)/visual/hoverbox/template.xslt` |
| renderer | `$(frameworkRoot)/visual/hoverbox/renderer.js` |
| styles | $(frameworkRoot)/visual/hoverbox/hoverbox.css |
| scripts | $(frameworkRoot)/visual/hoverbox/hoverbox.js |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `HoverboxType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `HoverboxType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `HoverboxType` | `title` | `xs:string` | required | — |
| `HoverboxType` | `panel-title` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/hoverbox/hoverbox.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-hoverbox-internal-default-max-width` | `24rem` | Declared locally |
| `--ck-hoverbox-internal-default-viewport-inset` | `1.25rem` | Declared locally |
| `--ck-hoverbox-internal-effective-viewport-inset` | `var(         --ck-hoverbox-viewport-inset,         var(--ck-hoverbox-internal-default-viewport-inset)     )` | Declared locally |
| `--ck-hoverbox-internal-default-title-color` | `#ecba78` | Declared locally |
| `--ck-hoverbox-panel-bg` | `var(--ck-surface)` | Declared locally |
| `--ck-hoverbox-border-color` | `var(--ck-border)` | Declared locally |
| `--ck-hoverbox-panel-color` | `var(--ck-text-main)` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-border`, `--ck-easing-default`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-font-weight-regular`, `--ck-hoverbox-border-color`, `--ck-hoverbox-internal-default-max-width`, `--ck-hoverbox-internal-default-title-color`, `--ck-hoverbox-internal-default-viewport-inset`, `--ck-hoverbox-internal-effective-viewport-inset`, `--ck-hoverbox-padding`, `--ck-hoverbox-panel-bg`, `--ck-hoverbox-panel-color`, `--ck-hoverbox-panel-max-width`, `--ck-hoverbox-panel-title-color`, `--ck-hoverbox-shadow`, `--ck-hoverbox-title-letter-spacing`, `--ck-hoverbox-title-size`, `--ck-hoverbox-top-border-color`, `--ck-hoverbox-trigger-color`, `--ck-hoverbox-viewport-inset`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-list-indent`, `--ck-motion-fast`, `--ck-outline-strong`, `--ck-paragraph-gap-footnote`, `--ck-space-2xs`, `--ck-space-md`, `--ck-space-xs`, `--ck-surface`, `--ck-text-dark`, `--ck-text-main`, `--ck-z-popover`

**Template output elements (static inventory):** `ck-children`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
