# `framework/visual/central-content/central-content.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/central-content/central-content.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `central-content` |
| schema | `$(frameworkRoot)/visual/central-content/central-content.xsd` |
| template | `$(frameworkRoot)/visual/central-content/template.xslt` |
| renderer | `$(frameworkRoot)/visual/central-content/renderer.js` |
| styles | $(frameworkRoot)/visual/central-content/central-content.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `CentralContentType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `CentralContentType` | `c:VisualContainer` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/central-content/central-content.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-border`, `--ck-central-content-background`, `--ck-central-content-border-color`, `--ck-central-content-border-width`, `--ck-central-content-color`, `--ck-central-content-gap`, `--ck-central-content-padding-block`, `--ck-central-content-padding-inline`, `--ck-central-content-shadow`, `--ck-central-content-top-border-color`, `--ck-central-content-top-border-width`, `--ck-outline-strong`, `--ck-section-gap`, `--ck-space-2xl`, `--ck-space-lg`, `--ck-structure`, `--ck-surface`, `--ck-text-main`

**Template output elements (static inventory):** `ck-children`, `main`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
