# `framework/modules/people/visual/assistant-card/assistant-card.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:people`

**Source XSD:** `framework/modules/people/visual/assistant-card/assistant-card.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assistant-card` |
| schema | `$(frameworkRoot)/modules/people/visual/assistant-card/assistant-card.xsd` |
| template | `$(frameworkRoot)/modules/people/visual/assistant-card/template.xslt` |
| renderer | `$(frameworkRoot)/modules/people/visual/assistant-card/renderer.js` |
| styles | $(frameworkRoot)/modules/people/visual/assistant-card/assistant-card.css |
| scripts | $(frameworkRoot)/modules/people/visual/assistant-card/assistant-card.js |
| variants | split, compact |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssistantCardType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssistantCardType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AssistantCardType` | `name` | `xs:string` | required | — |
| `AssistantCardType` | `role` | `xs:string` | required | — |
| `AssistantCardType` | `title` | `xs:string` | optional | — |
| `AssistantCardType` | `photo` | `xs:string` | optional | — |
| `AssistantCardType` | `email` | `xs:string` | optional | — |
| `AssistantCardType` | `booking-url` | `xs:anyURI` | optional | — |
| `AssistantCardType` | `online-hours` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/people/visual/assistant-card/assistant-card.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-assistant-card-internal-layer-base` | `0` | Declared locally |
| `--ck-assistant-card-internal-layer-actions` | `1` | Declared locally |
| `--ck-assistant-card-internal-border-width` | `1px` | Declared locally |
| `--ck-assistant-card-internal-banner-angle` | `135deg` | Declared locally |
| `--ck-assistant-card-internal-button-text` | `#ffffff` | Declared locally |
| `--ck-assistant-card-internal-rail-size` | `2.5rem` | Declared locally |
| `--ck-assistant-card-internal-actions-width` | `16.25rem` | Declared locally |
| `--ck-assistant-card-internal-photo-size` | `5rem` | Declared locally |
| `--ck-assistant-card-internal-banner-height` | `4.375rem` | Declared locally |
| `--ck-assistant-card-internal-padding` | `var(--ck-space-lg)` | Declared locally |
| `--ck-assistant-card-internal-gap` | `var(--ck-space-sm)` | Declared locally |
| `--ck-assistant-card-internal-drawer-opacity-start` | `80%` | Declared locally |
| `--ck-assistant-card-internal-drawer-opacity-end` | `88%` | Declared locally |
| `--ck-assistant-card-internal-drawer-base` | `#0f172a` | Declared locally |
| `--ck-assistant-card-internal-drawer-text` | `#f8fafc` | Declared locally |
| `--ck-assistant-card-internal-drawer-title` | `#fdba74` | Declared locally |
| `--ck-assistant-card-internal-title-color` | `color-mix(in srgb, var(--ck-text-main) 78%, var(--ck-surface))` | Declared locally |
| `--ck-assistant-card-internal-role-letter-spacing` | `0.09em` | Declared locally |
| `--ck-assistant-card-internal-name-size` | `var(--ck-heading-2-size)` | Declared locally |
| `--ck-assistant-card-internal-role-size` | `var(--ck-font-footnote)` | Declared locally |
| `--ck-assistant-card-internal-title-size` | `var(--ck-font-box-size)` | Declared locally |
| `--ck-assistant-card-internal-detail-size` | `var(--ck-font-box-size)` | Declared locally |
| `--ck-assistant-card-internal-hours-heading-size` | `0.8125rem` | Declared locally |
| `--ck-assistant-card-internal-hours-size` | `0.8125rem` | Declared locally |
| `--ck-assistant-card-internal-directions-size` | `var(--ck-font-footnote)` | Declared locally |
| `--ck-assistant-card-internal-action-size` | `0.8125rem` | Declared locally |
| `--ck-assistant-card-internal-drawer-title-size` | `var(--ck-font-body-size)` | Declared locally |
| `--ck-assistant-card-internal-drawer-body-size` | `var(--ck-font-box-size)` | Declared locally |
| `--ck-assistant-card-internal-banner-light` | `#cbd5e1` | Declared locally |
| `--ck-assistant-card-internal-banner-dark` | `#94a3b8` | Declared locally |
| `--ck-assistant-card-internal-motion` | `var(--ck-motion-slow)` | Declared locally |
| `--ck-assistant-card-internal-layer-photo` | `1` | Declared locally |
| `--ck-assistant-card-internal-layer-drawer` | `2` | Declared locally |
| `--ck-assistant-card-internal-layer-trigger` | `3` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-accent-light`, `--ck-assistant-card-accent`, `--ck-assistant-card-action-bg`, `--ck-assistant-card-action-size`, `--ck-assistant-card-action-text`, `--ck-assistant-card-actions-width`, `--ck-assistant-card-banner-end`, `--ck-assistant-card-banner-height`, `--ck-assistant-card-banner-start`, `--ck-assistant-card-bg`, `--ck-assistant-card-border`, `--ck-assistant-card-border-width`, `--ck-assistant-card-detail-size`, `--ck-assistant-card-directions-size`, `--ck-assistant-card-drawer-bg`, `--ck-assistant-card-drawer-body-size`, `--ck-assistant-card-drawer-border-width`, `--ck-assistant-card-drawer-text`, `--ck-assistant-card-drawer-title`, `--ck-assistant-card-drawer-title-size`, `--ck-assistant-card-gap`, `--ck-assistant-card-heading`, `--ck-assistant-card-hint-size`, `--ck-assistant-card-hours-heading-size`, `--ck-assistant-card-hours-size`, `--ck-assistant-card-internal-action-size`, `--ck-assistant-card-internal-actions-width`, `--ck-assistant-card-internal-banner-angle`, `--ck-assistant-card-internal-banner-dark`, `--ck-assistant-card-internal-banner-height`, `--ck-assistant-card-internal-banner-light`, `--ck-assistant-card-internal-border-width`, `--ck-assistant-card-internal-button-text`, `--ck-assistant-card-internal-detail-size`, `--ck-assistant-card-internal-directions-size`, `--ck-assistant-card-internal-drawer-base`, `--ck-assistant-card-internal-drawer-body-size`, `--ck-assistant-card-internal-drawer-opacity-end`, `--ck-assistant-card-internal-drawer-opacity-start`, `--ck-assistant-card-internal-drawer-text`, `--ck-assistant-card-internal-drawer-title`, `--ck-assistant-card-internal-drawer-title-size`, `--ck-assistant-card-internal-gap`, `--ck-assistant-card-internal-hours-heading-size`, `--ck-assistant-card-internal-hours-size`, `--ck-assistant-card-internal-layer-actions`, `--ck-assistant-card-internal-layer-drawer`, `--ck-assistant-card-internal-layer-photo`, `--ck-assistant-card-internal-layer-trigger`, `--ck-assistant-card-internal-motion`, `--ck-assistant-card-internal-name-size`, `--ck-assistant-card-internal-padding`, `--ck-assistant-card-internal-photo-size`, `--ck-assistant-card-internal-rail-size`, `--ck-assistant-card-internal-role-letter-spacing`, `--ck-assistant-card-internal-role-size`, `--ck-assistant-card-internal-title-color`, `--ck-assistant-card-internal-title-size`, `--ck-assistant-card-muted-bg`, `--ck-assistant-card-name-size`, `--ck-assistant-card-padding`, `--ck-assistant-card-photo-border-width`, `--ck-assistant-card-photo-shadow`, `--ck-assistant-card-photo-size`, `--ck-assistant-card-radius`, `--ck-assistant-card-rail-size`, `--ck-assistant-card-role-letter-spacing`, `--ck-assistant-card-role-size`, `--ck-assistant-card-shadow`, `--ck-assistant-card-strong-border`, `--ck-assistant-card-text`, `--ck-assistant-card-title-color`, `--ck-assistant-card-title-size`, `--ck-assistant-card-top-border-width`, `--ck-assistant-drawer-image`, `--ck-border`, `--ck-font-body`, `--ck-font-body-size`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-font-weight-medium`, `--ck-font-weight-semibold`, `--ck-heading-2-size`, `--ck-heading-3-size`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-motion-slow`, `--ck-outline-strong`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xs`, `--ck-structure`, `--ck-surface`, `--ck-surface-muted`, `--ck-text-dark`, `--ck-text-main`

**Template output elements (static inventory):** `a`, `article`, `button`, `div`, `h3`, `img`, `p`, `strong`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
