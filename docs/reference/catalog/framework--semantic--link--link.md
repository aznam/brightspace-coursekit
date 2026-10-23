# `framework/semantic/link/link.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/link/link.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `link` | `s:LinkType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `LinkType` | mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `LinkType` | `s:Text` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `LinkType` | `href` | `xs:anyURI` | required | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `LinkType` | `s:paragraph` | 1 | 1 |
| `LinkType` | `s:picture` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
