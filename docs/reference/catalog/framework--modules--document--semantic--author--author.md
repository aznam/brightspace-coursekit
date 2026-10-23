# `framework/modules/document/semantic/author/author.xsd`

**Category:** semantic · **Ownership:** module · **Target namespace:** `urn:coursekit:semantic:document`

**Source XSD:** `framework/modules/document/semantic/author/author.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `author` | `d:AuthorType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AuthorType` | not declared mixed |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `AuthorType` | `name` | `xs:string` | required | — |
| `AuthorType` | `role` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
