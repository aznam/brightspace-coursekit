# `framework/visual/navbar/navbar.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/navbar/navbar.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `navbar` |
| schema | `$(frameworkRoot)/visual/navbar/navbar.xsd` |
| template | `$(frameworkRoot)/visual/navbar/template.xslt` |
| renderer | `$(frameworkRoot)/visual/navbar/renderer.js` |
| styles | $(frameworkRoot)/visual/navbar/navbar.css |
| scripts | $(frameworkRoot)/visual/navbar/navbar.js |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `NavbarType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `NavbarType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `NavbarType` | `course-code` | `xs:string` | optional | — |
| `NavbarType` | `page-title` | `xs:string` | optional | — |
| `NavbarType` | `module-title` | `xs:string` | optional | — |
| `NavbarType` | `navigate-label` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/navbar/navbar.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-navbar-internal-course-color` | `#ecba78` | Declared locally |
| `--ck-navbar-internal-dropdown-min-width` | `17.5rem` | Declared locally |
| `--ck-navbar-internal-viewport-inset` | `var(         --ck-navbar-dropdown-viewport-inset,         var(--ck-space-sm)     )` | Declared locally |
| `--ck-navbar-internal-dropdown-offset` | `0px` | Declared locally |
| `--ck-navbar-internal-foreground` | `var(--ck-navbar-color, var(--ck-surface))` | Declared locally |
| `--ck-navbar-internal-divider` | `var(         --ck-navbar-divider-color,         color-mix(in srgb, var(--ck-navbar-internal-foreground) 25%, transparent)     )` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-easing-default`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-font-weight-medium`, `--ck-leading-box`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-navbar-accent-border`, `--ck-navbar-background`, `--ck-navbar-color`, `--ck-navbar-course-color`, `--ck-navbar-course-letter-spacing`, `--ck-navbar-divider-color`, `--ck-navbar-dropdown-bg`, `--ck-navbar-dropdown-min-width`, `--ck-navbar-dropdown-viewport-inset`, `--ck-navbar-gap`, `--ck-navbar-internal-course-color`, `--ck-navbar-internal-divider`, `--ck-navbar-internal-dropdown-min-width`, `--ck-navbar-internal-dropdown-offset`, `--ck-navbar-internal-foreground`, `--ck-navbar-internal-viewport-inset`, `--ck-navbar-module-color`, `--ck-navbar-module-letter-spacing`, `--ck-navbar-padding-block`, `--ck-navbar-padding-inline`, `--ck-navbar-trigger-letter-spacing`, `--ck-radius`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xs`, `--ck-structure`, `--ck-surface`, `--ck-text-dark`, `--ck-z-dropdown`, `--ck-z-sticky`

**Template output elements (static inventory):** `ck-slot`, `div`, `header`, `nav`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
