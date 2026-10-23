# `framework/semantic/video/video.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/video/video.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `video` | `s:VideoType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `VideoType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `VideoType` | `xs:string` |
| `VideoType` | `xs:string` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `VideoType` | `src` | `xs:string` | required | — |
| `VideoType` | `poster` | `xs:string` | optional | — |
| `VideoType` | `caption` | `xs:string` | optional | — |
| `VideoType` | `preload` | `inferred` | optional | `metadata` |


## Child elements / references

No child references declared directly.

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
