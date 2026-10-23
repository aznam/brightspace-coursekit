# `framework/visual/hero/hero.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/hero/hero.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `hero` |
| schema | `$(frameworkRoot)/visual/hero/hero.xsd` |
| template | `$(frameworkRoot)/visual/hero/template.xslt` |
| renderer | `$(frameworkRoot)/visual/hero/renderer.js` |
| styles | $(frameworkRoot)/visual/hero/hero.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `HeroType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `HeroType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `HeroType` | `title` | `xs:string` | optional | — |
| `HeroType` | `subtitle` | `xs:string` | optional | — |
| `HeroType` | `image` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/hero/hero.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-hero-internal-default-inner-max-width` | `56rem` | Declared locally |
| `--ck-hero-internal-default-title-size` | `clamp(1.75rem, 4vw + 0.5rem, 2.8rem)` | Declared locally |
| `--ck-hero-internal-default-subtitle-size` | `clamp(0.95rem, 1.25vw + 0.5rem, 1.25rem)` | Declared locally |
| `--ck-hero-internal-default-subtitle-max-width` | `50rem` | Declared locally |
| `--ck-hero-internal-default-title-letter-spacing` | `-0.02em` | Declared locally |
| `--ck-hero-internal-title-color` | `#ffffff` | Declared locally |
| `--ck-hero-internal-subtitle-color` | `#e2e8f0` | Declared locally |
| `--ck-hero-internal-overlay-start-color` | `#0f172a` | Declared locally |
| `--ck-hero-internal-overlay-end-color` | `var(--ck-surface)` | Declared locally |
| `--ck-hero-internal-overlay-start-opacity` | `45%` | Declared locally |
| `--ck-hero-internal-overlay-end-opacity` | `40%` | Declared locally |
| `--ck-hero-internal-obstructed-end` | `0rem` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-border`, `--ck-font-display`, `--ck-font-weight-bold`, `--ck-font-weight-regular`, `--ck-hero-border-color`, `--ck-hero-border-width`, `--ck-hero-height`, `--ck-hero-image`, `--ck-hero-inner-max-width`, `--ck-hero-internal-default-inner-max-width`, `--ck-hero-internal-default-subtitle-max-width`, `--ck-hero-internal-default-subtitle-size`, `--ck-hero-internal-default-title-letter-spacing`, `--ck-hero-internal-default-title-size`, `--ck-hero-internal-obstructed-end`, `--ck-hero-internal-overlay-end-color`, `--ck-hero-internal-overlay-end-opacity`, `--ck-hero-internal-overlay-start-color`, `--ck-hero-internal-overlay-start-opacity`, `--ck-hero-internal-runtime-subtitle-size`, `--ck-hero-internal-runtime-title-size`, `--ck-hero-internal-subtitle-color`, `--ck-hero-internal-title-color`, `--ck-hero-overlay-end`, `--ck-hero-overlay-start`, `--ck-hero-padding-inline`, `--ck-hero-subtitle-color`, `--ck-hero-subtitle-max-width`, `--ck-hero-subtitle-size`, `--ck-hero-title-color`, `--ck-hero-title-font`, `--ck-hero-title-letter-spacing`, `--ck-hero-title-size`, `--ck-leading-body`, `--ck-leading-heading-large`, `--ck-space-md`, `--ck-space-xl`, `--ck-space-xs`, `--ck-structure`, `--ck-surface`

**Template output elements (static inventory):** `div`, `h1`, `p`, `section`, `xsp:slot`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
