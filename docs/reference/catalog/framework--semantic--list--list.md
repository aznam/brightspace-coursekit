# `framework/semantic/list/list.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/list/list.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `list` | `s:ListType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `ListType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `ListType` | `s:Container` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `ListType` | `s:item` | 1 | unbounded |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
