# `framework/pages/base/base.xsd`

**Category:** page · **Ownership:** native · **Target namespace:** `urn:coursekit:page`

**Source XSD:** `framework/pages/base/base.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `page` | `p:PageType` | `—` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `VariableType` | not declared mixed |
| `MetaType` | not declared mixed |
| `PageType` | not declared mixed |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `VariableType` | `name` | `xs:string` | required | — |
| `VariableType` | `value` | `xs:string` | required | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `MetaType` | `var` | 0 | unbounded |
| `PageType` | `meta` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
