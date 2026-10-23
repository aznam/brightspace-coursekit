# Module `assignment`

**Manifest:** `framework/modules/assignment/module.json`

## Registered contracts

| Field | Value |
| --- | --- |
| `id` | `assignment` |
| `name` | `Assignment page` |
| `version` | `1.0.0` |
| `namespace` | `urn:coursekit:semantic:assignment` |
| `dependsOn` | `[]` |

### `semantic`

None.

### `pages`

- `$(frameworkRoot)/modules/assignment/pages/assignment-page.json`

### `components`

- `$(frameworkRoot)/modules/assignment/visual/assignment-layout/component.json`
- `$(frameworkRoot)/modules/assignment/visual/assignment-band/component.json`
- `$(frameworkRoot)/modules/assignment/visual/assignment-submit/component.json`
- `$(frameworkRoot)/modules/assignment/visual/assignment-hero/component.json`

### `pageExtensions`

None.

### `styles`

None.

### `scripts`

None.

## XSD declarations

| Schema | Target namespace |
| --- | --- |
| [`framework/modules/assignment/pages/assignment-page.xsd`](/reference/catalog/framework--modules--assignment--pages--assignment-page) | `urn:coursekit:page:assignment` |
| [`framework/modules/assignment/visual/assignment-band/assignment-band.xsd`](/reference/catalog/framework--modules--assignment--visual--assignment-band--assignment-band) | `urn:coursekit:visual:assignment` |
| [`framework/modules/assignment/visual/assignment-hero/assignment-hero.xsd`](/reference/catalog/framework--modules--assignment--visual--assignment-hero--assignment-hero) | `urn:coursekit:visual:assignment` |
| [`framework/modules/assignment/visual/assignment-layout/assignment-layout.xsd`](/reference/catalog/framework--modules--assignment--visual--assignment-layout--assignment-layout) | `urn:coursekit:visual:assignment` |
| [`framework/modules/assignment/visual/assignment-submit/assignment-submit.xsd`](/reference/catalog/framework--modules--assignment--visual--assignment-submit--assignment-submit) | `urn:coursekit:visual:assignment` |

## CSS custom properties (observed, not automatically public)

| Stylesheet | Local definitions | Referenced via var() |
| --- | --- | --- |
| `framework/modules/assignment/visual/assignment-band/assignment-band.css` | `--ck-assignment-band-internal-muted-color` | `--ck-accent`, `--ck-assignment-band-accent-border-width`, `--ck-assignment-band-accent-color`, `--ck-assignment-band-ai-error-background`, `--ck-assignment-band-ai-error-foreground`, `--ck-assignment-band-ai-info-background`, `--ck-assignment-band-ai-info-foreground`, `--ck-assignment-band-ai-success-background`, `--ck-assignment-band-ai-success-foreground`, `--ck-assignment-band-ai-warning-background`, `--ck-assignment-band-ai-warning-foreground`, `--ck-assignment-band-background`, `--ck-assignment-band-badge-padding-block`, `--ck-assignment-band-badge-padding-inline`, `--ck-assignment-band-badge-radius`, `--ck-assignment-band-extension-color`, `--ck-assignment-band-foreground`, `--ck-assignment-band-hairline-width`, `--ck-assignment-band-hint-color`, `--ck-assignment-band-internal-muted-color`, `--ck-assignment-band-item-gap`, `--ck-assignment-band-label-difficulty-color`, `--ck-assignment-band-label-estimated-time-color`, `--ck-assignment-band-label-learning-outcomes-color`, `--ck-assignment-band-label-points-color`, `--ck-assignment-band-label-rubrics-color`, `--ck-assignment-band-label-weight-color`, `--ck-assignment-band-motion-duration`, `--ck-assignment-band-muted-color`, `--ck-assignment-band-padding-block`, `--ck-assignment-band-padding-inline`, `--ck-assignment-band-panel-gap`, `--ck-assignment-band-panel-max-block-size`, `--ck-assignment-band-panel-padding-block`, `--ck-assignment-band-panel-padding-inline`, `--ck-assignment-band-progress-danger`, `--ck-assignment-band-progress-height`, `--ck-assignment-band-progress-ok`, `--ck-assignment-band-progress-track-color`, `--ck-assignment-band-progress-warn`, `--ck-assignment-band-separator-color`, `--ck-assignment-band-separator-gap`, `--ck-assignment-band-sticky-top`, `--ck-assignment-band-strip-gap`, `--ck-assignment-band-submission-background`, `--ck-easing-default`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-font-weight-regular`, `--ck-font-weight-semibold`, `--ck-leading-box`, `--ck-leading-footnote`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-motion-normal`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xl`, `--ck-space-xs`, `--ck-z-sticky` |
| `framework/modules/assignment/visual/assignment-hero/assignment-hero.css` | `--ck-assignment-hero-internal-label-color`, `--ck-assignment-hero-internal-label-opacity` | `--ck-assignment-hero-internal-label-color`, `--ck-assignment-hero-internal-label-opacity`, `--ck-assignment-hero-label-color`, `--ck-assignment-hero-label-font-size`, `--ck-assignment-hero-label-font-weight`, `--ck-assignment-hero-label-gap`, `--ck-assignment-hero-label-letter-spacing`, `--ck-assignment-hero-label-opacity`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-leading-footnote`, `--ck-letter-spacing-normal`, `--ck-space-sm` |
| `framework/modules/assignment/visual/assignment-layout/assignment-layout.css` | — | `--ck-assignment-layout-main-max-width`, `--ck-assignment-layout-region-gap`, `--ck-assignment-layout-summary-grid-gap`, `--ck-page-layout-internal-max-width`, `--ck-page-layout-max-width`, `--ck-page-layout-padding-inline`, `--ck-page-layout-stacked-padding`, `--ck-section-gap`, `--ck-space-lg`, `--ck-space-sm`, `--ck-subsection-gap` |
| `framework/modules/assignment/visual/assignment-submit/assignment-submit.css` | `--ck-assignment-submit-internal-border-width`, `--ck-assignment-submit-internal-button-hover-shadow`, `--ck-assignment-submit-internal-button-shadow`, `--ck-assignment-submit-internal-disabled-background`, `--ck-assignment-submit-internal-disabled-color`, `--ck-assignment-submit-internal-hover-color` | `--ck-accent`, `--ck-assignment-submit-accent`, `--ck-assignment-submit-accent-width`, `--ck-assignment-submit-action-gap`, `--ck-assignment-submit-border`, `--ck-assignment-submit-border-width`, `--ck-assignment-submit-button-color`, `--ck-assignment-submit-button-disabled-background`, `--ck-assignment-submit-button-disabled-color`, `--ck-assignment-submit-button-hover-color`, `--ck-assignment-submit-button-hover-shadow`, `--ck-assignment-submit-button-padding-block`, `--ck-assignment-submit-button-padding-inline`, `--ck-assignment-submit-button-shadow`, `--ck-assignment-submit-internal-border-width`, `--ck-assignment-submit-internal-button-hover-shadow`, `--ck-assignment-submit-internal-button-shadow`, `--ck-assignment-submit-internal-disabled-background`, `--ck-assignment-submit-internal-disabled-color`, `--ck-assignment-submit-internal-hover-color`, `--ck-assignment-submit-padding`, `--ck-assignment-submit-shadow`, `--ck-assignment-submit-surface`, `--ck-border`, `--ck-easing-default`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-heading-6-size`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-sm`, `--ck-space-xs`, `--ck-subsection-gap`, `--ck-surface`, `--ck-text-dark` |


**Public CSS contract rule:** Expose an intentionally named component variable and resolve internal variables through it; reuse `tokens.css` before introducing new values. The presence of a variable in CSS does not alone make it supported public API.
