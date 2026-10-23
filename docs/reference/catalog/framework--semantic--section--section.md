# `framework/semantic/section/section.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/section/section.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `section` | `s:SectionType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `SectionType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `SectionType` | `s:Container` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `SectionType` | `s:paragraph` | 1 | 1 |
| `SectionType` | `s:heading` | 1 | 1 |
| `SectionType` | `s:list` | 1 | 1 |
| `SectionType` | `s:note` | 1 | 1 |
| `SectionType` | `s:details` | 1 | 1 |
| `SectionType` | `s:summary` | 1 | 1 |
| `SectionType` | `s:information` | 1 | 1 |
| `SectionType` | `s:picture` | 1 | 1 |
| `SectionType` | `s:video` | 1 | 1 |
| `SectionType` | `s:illustration` | 1 | 1 |
| `SectionType` | `s:tutorial` | 1 | 1 |
| `SectionType` | `s:section` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
