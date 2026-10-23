# `framework/visual/item/item.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/item/item.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `item` |
| schema | `$(frameworkRoot)/visual/item/item.xsd` |
| template | `$(frameworkRoot)/visual/item/template.xslt` |
| renderer | `$(frameworkRoot)/visual/item/renderer.js` |
| styles | $(frameworkRoot)/visual/item/item.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `ItemType` | mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `ItemType` | `c:VisualNode` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/item/item.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-list-indent`, `--ck-list-indentation`, `--ck-list-item-gap`, `--ck-list-max-width`, `--ck-list-padding-block`, `--ck-reading-width`, `--ck-space-2xs`, `--ck-space-xs`

**Template output elements (static inventory):** `ck-children`, `li`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
