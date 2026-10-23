# `framework/modules/people/visual/assistant-grid/assistant-grid.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:people`

**Source XSD:** `framework/modules/people/visual/assistant-grid/assistant-grid.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `assistant-grid` |
| schema | `$(frameworkRoot)/modules/people/visual/assistant-grid/assistant-grid.xsd` |
| template | `$(frameworkRoot)/modules/people/visual/assistant-grid/template.xslt` |
| renderer | `$(frameworkRoot)/modules/people/visual/assistant-grid/renderer.js` |
| styles | $(frameworkRoot)/modules/people/visual/assistant-grid/assistant-grid.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssistantGridType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssistantGridType` | `c:VisualContainer` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/modules/people/visual/assistant-grid/assistant-grid.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

| Variable | Source value/expression | Status |
| --- | --- | --- |
| `--ck-assistant-grid-internal-min-card-width` | `22rem` | Declared locally |
| `--ck-assistant-grid-internal-single-max-width` | `30rem` | Declared locally |
| `--ck-assistant-grid-internal-avatar-clearance` | `2.5rem` | Declared locally |


**Custom properties consumed via `var(...)`:** `--ck-assistant-grid-avatar-clearance`, `--ck-assistant-grid-gap`, `--ck-assistant-grid-internal-avatar-clearance`, `--ck-assistant-grid-internal-min-card-width`, `--ck-assistant-grid-internal-single-max-width`, `--ck-assistant-grid-min-card-width`, `--ck-assistant-grid-single-max-width`, `--ck-space-lg`

**Template output elements (static inventory):** `ck-children`, `div`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
