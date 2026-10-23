# `framework/modules/assignment/visual/assignment-hero/assignment-hero.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:assignment`

**Source XSD:** `framework/modules/assignment/visual/assignment-hero/assignment-hero.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assignment-hero` |
| schema | `$(frameworkRoot)/modules/assignment/visual/assignment-hero/assignment-hero.xsd` |
| template | `$(frameworkRoot)/modules/assignment/visual/assignment-hero/template.xslt` |
| renderer | `$(frameworkRoot)/modules/assignment/visual/assignment-hero/renderer.js` |
| styles | $(frameworkRoot)/modules/assignment/visual/assignment-hero/assignment-hero.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssignmentHeroType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssignmentHeroType` | `c:HeroType` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AssignmentHeroType` | `label` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/assignment/visual/assignment-hero/assignment-hero.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-assignment-hero-internal-label-color` | `#fdba74` | Declared locally |
| `--ck-assignment-hero-internal-label-opacity` | `0.9` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-assignment-hero-internal-label-color`, `--ck-assignment-hero-internal-label-opacity`, `--ck-assignment-hero-label-color`, `--ck-assignment-hero-label-font-size`, `--ck-assignment-hero-label-font-weight`, `--ck-assignment-hero-label-gap`, `--ck-assignment-hero-label-letter-spacing`, `--ck-assignment-hero-label-opacity`, `--ck-font-footnote`, `--ck-font-weight-bold`, `--ck-leading-footnote`, `--ck-letter-spacing-normal`, `--ck-space-sm`

**Template output elements (static inventory):** `div`, `xsp:extend`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
