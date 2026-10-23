# `framework/semantic/picture/picture.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/picture/picture.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `picture` | `s:PictureType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `PictureType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `PictureType` | `xs:string` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `PictureType` | `src` | `xs:string` | required | — |


## Child elements / references

No child references declared directly.

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
