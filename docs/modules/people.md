# Module `people`

**Manifest:** `framework/modules/people/module.json`

## Registered contracts

| Field | Value |
| --- | --- |
| `id` | `people` |
| `name` | `People and teams` |
| `version` | `1.0.0` |
| `namespace` | `urn:coursekit:semantic:people` |
| `dependsOn` | `[]` |

### `semantic`

- `$(frameworkRoot)/modules/people/semantic/people.json`

### `pages`

- `$(frameworkRoot)/modules/people/pages/people-page.json`

### `components`

- `$(frameworkRoot)/modules/people/visual/assistant-card/component.json`
- `$(frameworkRoot)/modules/people/visual/assistant-grid/component.json`

### `pageExtensions`

None.

### `styles`

None.

### `scripts`

None.

## XSD declarations

| Schema | Target namespace |
| --- | --- |
| [`framework/modules/people/pages/people-page.xsd`](/reference/catalog/framework--modules--people--pages--people-page) | `urn:coursekit:page:people` |
| [`framework/modules/people/semantic/people.xsd`](/reference/catalog/framework--modules--people--semantic--people) | `urn:coursekit:semantic:people` |
| [`framework/modules/people/visual/assistant-card/assistant-card.xsd`](/reference/catalog/framework--modules--people--visual--assistant-card--assistant-card) | `urn:coursekit:visual:people` |
| [`framework/modules/people/visual/assistant-grid/assistant-grid.xsd`](/reference/catalog/framework--modules--people--visual--assistant-grid--assistant-grid) | `urn:coursekit:visual:people` |

## CSS custom properties (observed, not automatically public)

| Stylesheet | Local definitions | Referenced via var() |
| --- | --- | --- |
| `framework/modules/people/visual/assistant-card/assistant-card.css` | `--ck-assistant-card-internal-action-size`, `--ck-assistant-card-internal-actions-width`, `--ck-assistant-card-internal-banner-angle`, `--ck-assistant-card-internal-banner-dark`, `--ck-assistant-card-internal-banner-height`, `--ck-assistant-card-internal-banner-light`, `--ck-assistant-card-internal-border-width`, `--ck-assistant-card-internal-button-text`, `--ck-assistant-card-internal-detail-size`, `--ck-assistant-card-internal-directions-size`, `--ck-assistant-card-internal-drawer-base`, `--ck-assistant-card-internal-drawer-body-size`, `--ck-assistant-card-internal-drawer-opacity-end`, `--ck-assistant-card-internal-drawer-opacity-start`, `--ck-assistant-card-internal-drawer-text`, `--ck-assistant-card-internal-drawer-title`, `--ck-assistant-card-internal-drawer-title-size`, `--ck-assistant-card-internal-gap`, `--ck-assistant-card-internal-hours-heading-size`, `--ck-assistant-card-internal-hours-size`, `--ck-assistant-card-internal-layer-actions`, `--ck-assistant-card-internal-layer-base`, `--ck-assistant-card-internal-layer-drawer`, `--ck-assistant-card-internal-layer-photo`, `--ck-assistant-card-internal-layer-trigger`, `--ck-assistant-card-internal-motion`, `--ck-assistant-card-internal-name-size`, `--ck-assistant-card-internal-padding`, `--ck-assistant-card-internal-photo-size`, `--ck-assistant-card-internal-rail-size`, `--ck-assistant-card-internal-role-letter-spacing`, `--ck-assistant-card-internal-role-size`, `--ck-assistant-card-internal-title-color`, `--ck-assistant-card-internal-title-size` | `--ck-accent`, `--ck-accent-light`, `--ck-assistant-card-accent`, `--ck-assistant-card-action-bg`, `--ck-assistant-card-action-size`, `--ck-assistant-card-action-text`, `--ck-assistant-card-actions-width`, `--ck-assistant-card-banner-end`, `--ck-assistant-card-banner-height`, `--ck-assistant-card-banner-start`, `--ck-assistant-card-bg`, `--ck-assistant-card-border`, `--ck-assistant-card-border-width`, `--ck-assistant-card-detail-size`, `--ck-assistant-card-directions-size`, `--ck-assistant-card-drawer-bg`, `--ck-assistant-card-drawer-body-size`, `--ck-assistant-card-drawer-border-width`, `--ck-assistant-card-drawer-text`, `--ck-assistant-card-drawer-title`, `--ck-assistant-card-drawer-title-size`, `--ck-assistant-card-gap`, `--ck-assistant-card-heading`, `--ck-assistant-card-hint-size`, `--ck-assistant-card-hours-heading-size`, `--ck-assistant-card-hours-size`, `--ck-assistant-card-internal-action-size`, `--ck-assistant-card-internal-actions-width`, `--ck-assistant-card-internal-banner-angle`, `--ck-assistant-card-internal-banner-dark`, `--ck-assistant-card-internal-banner-height`, `--ck-assistant-card-internal-banner-light`, `--ck-assistant-card-internal-border-width`, `--ck-assistant-card-internal-button-text`, `--ck-assistant-card-internal-detail-size`, `--ck-assistant-card-internal-directions-size`, `--ck-assistant-card-internal-drawer-base`, `--ck-assistant-card-internal-drawer-body-size`, `--ck-assistant-card-internal-drawer-opacity-end`, `--ck-assistant-card-internal-drawer-opacity-start`, `--ck-assistant-card-internal-drawer-text`, `--ck-assistant-card-internal-drawer-title`, `--ck-assistant-card-internal-drawer-title-size`, `--ck-assistant-card-internal-gap`, `--ck-assistant-card-internal-hours-heading-size`, `--ck-assistant-card-internal-hours-size`, `--ck-assistant-card-internal-layer-actions`, `--ck-assistant-card-internal-layer-drawer`, `--ck-assistant-card-internal-layer-photo`, `--ck-assistant-card-internal-layer-trigger`, `--ck-assistant-card-internal-motion`, `--ck-assistant-card-internal-name-size`, `--ck-assistant-card-internal-padding`, `--ck-assistant-card-internal-photo-size`, `--ck-assistant-card-internal-rail-size`, `--ck-assistant-card-internal-role-letter-spacing`, `--ck-assistant-card-internal-role-size`, `--ck-assistant-card-internal-title-color`, `--ck-assistant-card-internal-title-size`, `--ck-assistant-card-muted-bg`, `--ck-assistant-card-name-size`, `--ck-assistant-card-padding`, `--ck-assistant-card-photo-border-width`, `--ck-assistant-card-photo-shadow`, `--ck-assistant-card-photo-size`, `--ck-assistant-card-radius`, `--ck-assistant-card-rail-size`, `--ck-assistant-card-role-letter-spacing`, `--ck-assistant-card-role-size`, `--ck-assistant-card-shadow`, `--ck-assistant-card-strong-border`, `--ck-assistant-card-text`, `--ck-assistant-card-title-color`, `--ck-assistant-card-title-size`, `--ck-assistant-card-top-border-width`, `--ck-assistant-drawer-image`, `--ck-border`, `--ck-font-body`, `--ck-font-body-size`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-font-weight-medium`, `--ck-font-weight-semibold`, `--ck-heading-2-size`, `--ck-heading-3-size`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-motion-slow`, `--ck-outline-strong`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xs`, `--ck-structure`, `--ck-surface`, `--ck-surface-muted`, `--ck-text-dark`, `--ck-text-main` |
| `framework/modules/people/visual/assistant-grid/assistant-grid.css` | `--ck-assistant-grid-avatar-clearance`, `--ck-assistant-grid-gap`, `--ck-assistant-grid-internal-avatar-clearance`, `--ck-assistant-grid-internal-min-card-width`, `--ck-assistant-grid-internal-single-max-width`, `--ck-assistant-grid-min-card-width`, `--ck-assistant-grid-single-max-width` | `--ck-assistant-grid-avatar-clearance`, `--ck-assistant-grid-gap`, `--ck-assistant-grid-internal-avatar-clearance`, `--ck-assistant-grid-internal-min-card-width`, `--ck-assistant-grid-internal-single-max-width`, `--ck-assistant-grid-min-card-width`, `--ck-assistant-grid-single-max-width`, `--ck-space-lg` |


**Public CSS contract rule:** Expose an intentionally named component variable and resolve internal variables through it; reuse `tokens.css` before introducing new values. The presence of a variable in CSS does not alone make it supported public API.
