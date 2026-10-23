# `framework/modules/assignment/visual/assignment-submit/assignment-submit.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:assignment`

**Source XSD:** `framework/modules/assignment/visual/assignment-submit/assignment-submit.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assignment-submit` |
| schema | `$(frameworkRoot)/modules/assignment/visual/assignment-submit/assignment-submit.xsd` |
| template | `$(frameworkRoot)/modules/assignment/visual/assignment-submit/template.xslt` |
| renderer | `$(frameworkRoot)/modules/assignment/visual/assignment-submit/renderer.js` |
| styles | $(frameworkRoot)/modules/assignment/visual/assignment-submit/assignment-submit.css |
| scripts | $(frameworkRoot)/modules/assignment/visual/assignment-submit/assignment-submit.js |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssignmentSubmitType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssignmentSubmitType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AssignmentSubmitType` | `deadline-at` | `xs:string` | required | — |
| `AssignmentSubmitType` | `deadline-type` | `xs:string` | required | — |
| `AssignmentSubmitType` | `deadline-extension-at` | `xs:string` | optional | — |
| `AssignmentSubmitType` | `deadline-extension-reason` | `xs:string` | optional | — |
| `AssignmentSubmitType` | `submission-url` | `xs:string` | required | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/assignment/visual/assignment-submit/assignment-submit.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-assignment-submit-internal-border-width` | `1px` | Declared locally |
| `--ck-assignment-submit-internal-hover-color` | `#9a3412` | Declared locally |
| `--ck-assignment-submit-internal-disabled-background` | `#475569` | Declared locally |
| `--ck-assignment-submit-internal-disabled-color` | `#e2e8f0` | Declared locally |
| `--ck-assignment-submit-internal-button-shadow` | `4px 4px 0 rgba(194, 65, 12, 0.22)` | Declared locally |
| `--ck-assignment-submit-internal-button-hover-shadow` | `2px 2px 0 rgba(194, 65, 12, 0.15)` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-accent`, `--ck-assignment-submit-accent`, `--ck-assignment-submit-accent-width`, `--ck-assignment-submit-action-gap`, `--ck-assignment-submit-border`, `--ck-assignment-submit-border-width`, `--ck-assignment-submit-button-color`, `--ck-assignment-submit-button-disabled-background`, `--ck-assignment-submit-button-disabled-color`, `--ck-assignment-submit-button-hover-color`, `--ck-assignment-submit-button-hover-shadow`, `--ck-assignment-submit-button-padding-block`, `--ck-assignment-submit-button-padding-inline`, `--ck-assignment-submit-button-shadow`, `--ck-assignment-submit-internal-border-width`, `--ck-assignment-submit-internal-button-hover-shadow`, `--ck-assignment-submit-internal-button-shadow`, `--ck-assignment-submit-internal-disabled-background`, `--ck-assignment-submit-internal-disabled-color`, `--ck-assignment-submit-internal-hover-color`, `--ck-assignment-submit-padding`, `--ck-assignment-submit-shadow`, `--ck-assignment-submit-surface`, `--ck-border`, `--ck-easing-default`, `--ck-font-body`, `--ck-font-box-size`, `--ck-font-weight-bold`, `--ck-heading-6-size`, `--ck-leading-box`, `--ck-leading-heading-component`, `--ck-letter-spacing-normal`, `--ck-motion-fast`, `--ck-shadow`, `--ck-space-2xs`, `--ck-space-lg`, `--ck-space-sm`, `--ck-space-xs`, `--ck-subsection-gap`, `--ck-surface`, `--ck-text-dark`

**Template output elements (static inventory):** `a`, `div`, `h2`, `section`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
