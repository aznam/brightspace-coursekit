# Semantic XML authoring

Course authors edit semantic XML, not the visual component XML or the HTML. The root is `s:content` in `urn:coursekit:semantic`; its `page-type` selects the page definition.

```xml
<s:content xmlns:s="urn:coursekit:semantic"
           page-type="course-page"
           title="${course.title}"
           module-name="Introduction" toc="true">
  <s:section id="overview" title="Overview" nav="true">
    <s:paragraph>Welcome to ${course.title}.</s:paragraph>
    <s:picture src="diagram.svg" title="Description of the diagram">
      Optional visible caption.
    </s:picture>
    <s:note title="Read this">
      <s:paragraph>Remember the prerequisites.</s:paragraph>
    </s:note>
  </s:section>
</s:content>
```

The framework checks semantic structure using the registered semantic schemas. `ContentManager` currently interpolates `${...}` values from `course.json` **before** semantic validation. `PagesManager` checks the selected page manifest's public parameters and transforms the validated content into page XML.

`picture/@title` is the alternative text and the element's textual content becomes an optional visual legend. `link` accepts direct text and, per its semantic XSD, paragraph and picture child nodes. For exact allowed attributes, children, and authoring examples, consult the [semantic component catalogue](../semantic/index.md).

The `example-course/content/overview.xml` demonstrates the optional `learning` module: its `page-type="learning-page"` chooses the composed transformation.