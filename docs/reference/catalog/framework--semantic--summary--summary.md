# `framework/semantic/summary/summary.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/summary/summary.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `summary` | `s:SummaryType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `SummaryType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `SummaryType` | `s:Container` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `SummaryType` | `variant` | `s:SummaryVariantType` | optional | `normal` |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `SummaryType` | `s:paragraph` | 1 | 1 |
| `SummaryType` | `s:heading` | 1 | 1 |
| `SummaryType` | `s:list` | 1 | 1 |
| `SummaryType` | `s:picture` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
