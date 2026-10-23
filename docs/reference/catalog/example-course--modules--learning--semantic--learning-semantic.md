# `example-course/modules/learning/semantic/learning-semantic.xsd`

**Category:** semantic · **Ownership:** module · **Target namespace:** `urn:coursekit:semantic:learning`

**Source XSD:** `example-course/modules/learning/semantic/learning-semantic.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `term` | `l:TermType` | `s:component` |
| `paragraph` | `l:RichParagraphType` | `s:component` |
| `infonote` | `l:InfoNoteType` | `s:component` |
| `details` | `l:DetailsType` | `s:component` |
| `section` | `l:LearningSectionType` | `s:component` |
| `objectives` | `l:ObjectivesType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `TermType` | mixed |
| `RichParagraphType` | mixed |
| `InfoNoteType` | not declared mixed |
| `DetailsType` | not declared mixed |
| `LearningSectionType` | not declared mixed |
| `ObjectivesType` | not declared mixed |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `TermType` | `definition-title` | `xs:string` | optional | — |
| `DetailsType` | `open` | `xs:boolean` | optional | — |
| `ObjectivesType` | `id` | `xs:ID` | optional | — |
| `ObjectivesType` | `title` | `xs:string` | optional | — |
| `ObjectivesType` | `nav` | `xs:boolean` | optional | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `RichParagraphType` | `l:term` | 1 | 1 |
| `LearningSectionType` | `l:paragraph` | 1 | 1 |
| `LearningSectionType` | `l:infonote` | 1 | 1 |
| `LearningSectionType` | `l:details` | 1 | 1 |
| `LearningSectionType` | `l:section` | 1 | 1 |
| `ObjectivesType` | `objective` | 1 | unbounded |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
