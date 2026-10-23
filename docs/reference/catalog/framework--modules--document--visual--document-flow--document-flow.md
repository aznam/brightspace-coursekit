# `framework/modules/document/visual/document-flow/document-flow.xsd`

**Category:** visual · **Ownership:** module · **Target namespace:** `urn:coursekit:visual:document`

**Source XSD:** `framework/modules/document/visual/document-flow/document-flow.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `document-flow` |
| schema | `$(frameworkRoot)/modules/document/visual/document-flow/document-flow.xsd` |
| template | `$(frameworkRoot)/modules/document/visual/document-flow/template.xslt` |
| renderer | `$(frameworkRoot)/modules/document/visual/document-flow/renderer.js` |
| styles |  |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentFlowType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DocumentFlowType` | `c:VisualContainer` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

No stylesheet declared in this component folder.

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** None

**Template output elements (static inventory):** `ck-children`, `div`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
