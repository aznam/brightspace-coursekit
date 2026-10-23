# `framework/semantic/steps/steps.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/steps/steps.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `steps` | `s:StepsType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `StepsType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `StepsType` | `s:Container` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `StepsType` | `s:item` | 1 | unbounded |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
