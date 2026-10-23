# `framework/semantic/illustration/illustration.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/illustration/illustration.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `illustration` | `s:IllustrationType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `IllustrationType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `IllustrationType` | `s:Container` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `IllustrationType` | `style-ref` | `xs:string` | optional | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `IllustrationType` | `s:picture` | 1 | 1 |
| `IllustrationType` | `s:video` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
