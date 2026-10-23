# `framework/modules/document/semantic/section/section.xsd`

**Category:** semantic · **Ownership:** module · **Target namespace:** `urn:coursekit:semantic:document`

**Source XSD:** `framework/modules/document/semantic/section/section.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `section` | `d:DocumentSectionType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DocumentSectionType` | not declared mixed |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `DocumentSectionType` | `d:author` | 1 | 1 |
| `DocumentSectionType` | `d:break` | 1 | 1 |
| `DocumentSectionType` | `d:section` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
