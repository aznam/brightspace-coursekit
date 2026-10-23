# `framework/visual/tutorial/tutorial.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/tutorial/tutorial.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `tutorial` |
| schema | `$(frameworkRoot)/visual/tutorial/tutorial.xsd` |
| template | `$(frameworkRoot)/visual/tutorial/template.xslt` |
| renderer | `$(frameworkRoot)/visual/tutorial/renderer.js` |
| styles | $(frameworkRoot)/visual/tutorial/tutorial.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `TutorialType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `TutorialType` | `c:VisualContainer` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `TutorialType` | `title` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/tutorial/tutorial.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-tutorial-internal-column-min` | `20rem` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-prose-gap`, `--ck-space-sm`, `--ck-tutorial-column-min`, `--ck-tutorial-gap`, `--ck-tutorial-internal-column-min`, `--ck-tutorial-title-gap`

**Template output elements (static inventory):** `ck-children`, `ck-slot`, `div`, `h3`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
