# `framework/visual/theme-switch/theme-switch.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/theme-switch/theme-switch.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `theme-switch` |
| schema | `$(frameworkRoot)/visual/theme-switch/theme-switch.xsd` |
| template | `$(frameworkRoot)/visual/theme-switch/template.xslt` |
| renderer | `$(frameworkRoot)/visual/theme-switch/renderer.js` |
| styles | $(frameworkRoot)/visual/theme-switch/theme-switch.css |
| scripts | $(frameworkRoot)/visual/theme-switch/theme-switch.js |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `ThemeSwitchType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `ThemeSwitchType` | `c:VisualNode` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/theme-switch/theme-switch.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-theme-switch-internal-track-inline-size` | `3.5rem` | Declared locally |
| `--ck-theme-switch-internal-track-block-size` | `1.75rem` | Declared locally |
| `--ck-theme-switch-internal-padding` | `0.1875rem` | Declared locally |
| `--ck-theme-switch-internal-thumb-color` | `#ffffff` | Declared locally |
| `--ck-theme-switch-internal-effective-inline-size` | `var(         --ck-theme-switch-inline-size,         var(--ck-theme-switch-internal-track-inline-size)     )` | Declared locally |
| `--ck-theme-switch-internal-effective-block-size` | `var(         --ck-theme-switch-block-size,         var(--ck-theme-switch-internal-track-block-size)     )` | Declared locally |
| `--ck-theme-switch-internal-effective-padding` | `var(         --ck-theme-switch-padding,         var(--ck-theme-switch-internal-padding)     )` | Declared locally |
| `--ck-theme-switch-internal-thumb-size` | `calc(         var(--ck-theme-switch-internal-effective-block-size)         - 2 * var(--ck-theme-switch-internal-effective-padding)     )` | Declared locally |
| `--ck-theme-switch-internal-end-position` | `calc(         var(--ck-theme-switch-internal-effective-inline-size)         - var(--ck-theme-switch-internal-effective-padding)         - var(--ck-theme-switch-internal-thumb-size)     )` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-easing-default`, `--ck-font-box-size`, `--ck-motion-fast`, `--ck-radius`, `--ck-space-2xs`, `--ck-structure`, `--ck-text-dark`, `--ck-theme-switch-active-background`, `--ck-theme-switch-block-size`, `--ck-theme-switch-dark-icon-color`, `--ck-theme-switch-focus-color`, `--ck-theme-switch-icon-color`, `--ck-theme-switch-icon-size`, `--ck-theme-switch-inline-size`, `--ck-theme-switch-internal-effective-block-size`, `--ck-theme-switch-internal-effective-inline-size`, `--ck-theme-switch-internal-effective-padding`, `--ck-theme-switch-internal-end-position`, `--ck-theme-switch-internal-padding`, `--ck-theme-switch-internal-thumb-color`, `--ck-theme-switch-internal-thumb-size`, `--ck-theme-switch-internal-track-block-size`, `--ck-theme-switch-internal-track-inline-size`, `--ck-theme-switch-motion-duration`, `--ck-theme-switch-padding`, `--ck-theme-switch-thumb-color`, `--ck-theme-switch-track-background`

**Template output elements (static inventory):** `button`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
