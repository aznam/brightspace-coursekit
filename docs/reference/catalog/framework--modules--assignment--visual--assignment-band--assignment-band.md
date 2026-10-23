# `framework/modules/assignment/visual/assignment-band/assignment-band.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:assignment`

**Source XSD:** `framework/modules/assignment/visual/assignment-band/assignment-band.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assignment-band` |
| schema | `$(frameworkRoot)/modules/assignment/visual/assignment-band/assignment-band.xsd` |
| template | `$(frameworkRoot)/modules/assignment/visual/assignment-band/template.xslt` |
| renderer | `$(frameworkRoot)/modules/assignment/visual/assignment-band/renderer.js` |
| styles | $(frameworkRoot)/modules/assignment/visual/assignment-band/assignment-band.css |
| scripts | $(frameworkRoot)/modules/assignment/visual/assignment-band/assignment-band.js |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssignmentBandType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssignmentBandType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AssignmentBandType` | `open` | `xs:string` | optional | — |
| `AssignmentBandType` | `deadline-at` | `xs:string` | required | — |
| `AssignmentBandType` | `deadline-type` | `xs:string` | required | — |
| `AssignmentBandType` | `deadline-extension-at` | `xs:string` | optional | — |
| `AssignmentBandType` | `deadline-extension-reason` | `xs:string` | optional | — |
| `AssignmentBandType` | `submission-type` | `xs:string` | optional | — |
| `AssignmentBandType` | `submission-group-size` | `xs:string` | optional | — |
| `AssignmentBandType` | `ai-policy` | `xs:string` | optional | — |
| `AssignmentBandType` | `learning-outcomes` | `xs:string` | optional | — |
| `AssignmentBandType` | `estimated-time` | `xs:string` | optional | — |
| `AssignmentBandType` | `difficulty` | `xs:string` | optional | — |
| `AssignmentBandType` | `bonus` | `xs:string` | optional | — |
| `AssignmentBandType` | `weight` | `xs:string` | optional | — |
| `AssignmentBandType` | `points` | `xs:string` | optional | — |
| `AssignmentBandType` | `rubrics-provided` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/assignment/visual/assignment-band/assignment-band.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-assignment-band-internal-muted-color` | `#94a3b8` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-assignment-band-accent-border-width`, `--ck-assignment-band-accent-color`, `--ck-assignment-band-ai-error-background`, `--ck-assignment-band-ai-error-foreground`, `--ck-assignment-band-ai-info-background`, `--ck-assignment-band-ai-info-foreground`, `--ck-assignment-band-ai-success-background`, `--ck-assignment-band-ai-success-foreground`, `--ck-assignment-band-ai-warning-background`, `--ck-assignment-band-ai-warning-foreground`, `--ck-assignment-band-background`, `--ck-assignment-band-badge-padding-block`, `--ck-assignment-band-badge-padding-inline`, `--ck-assignment-band-badge-radius`, `--ck-assignment-band-extension-color`, `--ck-assignment-band-foreground`, `--ck-assignment-band-hairline-width`, `--ck-assignment-band-hint-color`, `--ck-assignment-band-internal-muted-color`, `--ck-assignment-band-item-gap`, `--ck-assignment-band-label-difficulty-color`, `--ck-assignment-band-label-estimated-time-color`, `--ck-assignment-band-label-learning-outcomes-color`, `--ck-assignment-band-label-points-color`, `--ck-assignment-band-label-rubrics-color`, `--ck-assignment-band-label-weight-color`, `--ck-assignment-band-motion-duration`, `--ck-assignment-band-muted-color`, `--ck-assignment-band-padding-block`, `--ck-assignment-band-padding-inline`, `--ck-assignment-band-panel-gap`, `--ck-assignment-band-panel-max-block-size`, `--ck-assignment-band-panel-padding-block`, `--ck-assignment-band-panel-padding-inline`, `--ck-assignment-band-progress-danger`, `--ck-assignment-band-progress-height`, `--ck-assignment-band-progress-ok`, `--ck-assignment-band-progress-track-color`, `--ck-assignment-band-progress-warn`, `--ck-assignment-band-separator-color`, `--ck-assignment-band-separator-gap`, `--ck-assignment-band-sticky-top`, `--ck-assignment-band-strip-gap`, `--ck-assignment-band-submission-background`, `--ck-easing-default`, `--ck-font-box-size`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-font-weight-regular`, `--ck-font-weight-semibold`, `--ck-leading-box`, `--ck-leading-footnote`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-motion-normal`, `--ck-radius`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-md`, `--ck-space-sm`, `--ck-space-xl`, `--ck-space-xs`, `--ck-z-sticky`

**Template output elements (static inventory):** `ck-children`, `div`, `span`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
