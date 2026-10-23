# `framework/semantic/details/details.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/details/details.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `details` | `s:DetailsType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `DetailsType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `DetailsType` | `s:Container` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `DetailsType` | `open` | `xs:boolean` | optional | `false` |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `DetailsType` | `s:paragraph` | 1 | 1 |
| `DetailsType` | `s:heading` | 1 | 1 |
| `DetailsType` | `s:list` | 1 | 1 |
| `DetailsType` | `s:picture` | 1 | 1 |
| `DetailsType` | `s:video` | 1 | 1 |
| `DetailsType` | `s:illustration` | 1 | 1 |
| `DetailsType` | `s:tutorial` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
