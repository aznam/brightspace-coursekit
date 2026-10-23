# `framework/modules/assignment/pages/assignment-page.xsd`

**Category:** page · **Ownership:** module · **Target namespace:** `urn:coursekit:page:assignment`

**Source XSD:** `framework/modules/assignment/pages/assignment-page.xsd`

## Global element declarations

| Element | Type | Substitution group |
| --- | --- | --- |
| `assignment-hero` | `mc:AssignmentHeroType` | `—` |
| `assignment-band` | `inline` | `—` |
| `assignment-submit` | `mc:AssignmentSubmitType` | `—` |
| `assignment-layout` | `inline` | `—` |
| `assignment-page` | `mp:AssignmentPageType` | `p:page` |


## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `AssignmentPageType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `AssignmentPageType` | `p:PageType` |


## Directly declared attributes

No attributes declared directly. Check imported, included, inherited, or page-composed types.

## Child elements / references

| Type | Child / ref | Min | Max |
| --- | --- | --- | --- |
| `AssignmentPageType` | `mp:assignment-layout` | 1 | 1 |


## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
