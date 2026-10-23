# `framework/modules/people/semantic/people.xsd`

**Category:** semantic · **Ownership:** module · **Target namespace:** `urn:coursekit:semantic:people`

**Source XSD:** `framework/modules/people/semantic/people.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `office-hours` | `ms:OfficeHoursType` | `—` |
| `description` | `ms:PersonDescriptionType` | `—` |
| `person` | `ms:PersonType` | `s:component` |
| `team` | `ms:TeamType` | `s:component` |
| `people-section` | `ms:PeopleSectionType` | `s:component` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `OfficeHoursType` | mixed |
| `PersonDescriptionType` | not declared mixed |
| `PersonType` | not declared mixed |
| `TeamType` | not declared mixed |
| `PeopleSectionType` | not declared mixed |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `OfficeHoursType` | `location` | `xs:string` | required | — |
| `OfficeHoursType` | `directions-url` | `xs:anyURI` | optional | — |
| `PersonDescriptionType` | `title` | `xs:string` | required | — |
| `PersonDescriptionType` | `background` | `xs:string` | optional | — |
| `PersonType` | `name` | `xs:string` | required | — |
| `PersonType` | `role` | `xs:string` | required | — |
| `PersonType` | `photo` | `xs:string` | optional | — |
| `PersonType` | `email` | `xs:string` | optional | — |
| `PersonType` | `booking-url` | `xs:anyURI` | optional | — |
| `PersonType` | `online-hours` | `xs:string` | optional | — |


## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `PersonDescriptionType` | `s:paragraph` | 1 | 1 |
| `PersonDescriptionType` | `s:list` | 1 | 1 |
| `PersonType` | `ms:office-hours` | 0 | unbounded |
| `PersonType` | `ms:description` | 0 | 1 |
| `TeamType` | `ms:person` | 1 | unbounded |
| `PeopleSectionType` | `ms:person` | 1 | 1 |
| `PeopleSectionType` | `ms:team` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
