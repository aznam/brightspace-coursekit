# `s:content`

Root document of a semantic page. Selects the page implementation through `page-type`.

**Schema:** `framework/semantic/content/content.xsd`

**Content model:** zero or more `s:component` children (subject to the selected semantic schemas).

## Attributes

| Attribute | Type | Required | Description |
| --- | --- | --- | --- |
| `page-type` | `string` | Yes | Selects the registered page definition |
| `Other page parameters` | `page-dependent` | No | Additional attributes are accepted (`xs:anyAttribute processContents="lax"`); allowed public parameters depend on the page manifest |

## Allowed child elements

| Element | Occurrence in model |
| --- | --- |
| `s:component` | 0..unbounded |

Other semantic components can be contributed by modules. The page type controls their **transformation**, independently of semantic schema registration.

## Example

```xml
<s:content xmlns:s="urn:coursekit:semantic" page-type="course-page"
           title="${course.title}" module-name="Introduction" toc="true">
  <s:section id="overview" title="Overview" nav="true">
    <s:paragraph>Welcome to ${course.title}.</s:paragraph>
  </s:section>
</s:content>
```

## Mapping in `course-page`

`s:content` → `p:course-page`, with `p:meta` and `p:layout`.

The semantic XSD defines the input contract; the page transformation defines the presentation mapping.