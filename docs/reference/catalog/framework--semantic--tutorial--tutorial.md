# `framework/semantic/tutorial/tutorial.xsd`

**Category:** semantic · **Ownership:** native · **Target namespace:** `urn:coursekit:semantic`

**Source XSD:** `framework/semantic/tutorial/tutorial.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `tutorial` | `s:TutorialType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `TutorialType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `TutorialType` | `s:Container` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `TutorialType` | `style-ref` | `xs:string` | optional | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `TutorialType` | `s:illustration` | 1 | 1 |
| `TutorialType` | `s:paragraph` | 1 | 1 |
| `TutorialType` | `s:heading` | 1 | 1 |
| `TutorialType` | `s:steps` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
