# Variables and page metadata

CourseKit has two separate interpolation phases.

## JSON variables in semantic content

`ConfigManager.variables(xml)` interpolates `${course.title}`, `${course.code}`, or other property paths against `course.json` before `ContentManager` validates the semantic XML. Unresolved JSON paths currently fall back to an empty string.

## Page metadata variables

The **page XSLT** emits metadata into the intermediate page XML. The stock `course-page` transformation contains:

```xml
<p:course-page xmlns:p="urn:coursekit:page">
  <p:meta>
    <p:var name="course-code" ref="course.code"/>
    <p:var name="course-title" ref="course.title"/>
    <p:var name="module-name" value="Introduction"/>
  </p:meta>
  <p:layout>...</p:layout>
</p:course-page>
```

In `PagesManager`, `resolveVariables()` requires a unique name and **exactly one** of `value` or `ref`. `ref` reads from `ConfigManager.get()`, and successful resolution turns the entry into a `value`. `interpolateVariables()` substitutes `${course-code}`, `${course-title}`, and `${module-name}` in the produced page XML **before** page-XSD validation. An unknown page variable throws.

The resulting `<p:meta>` is not rendered as a component. `ContentManager` extracts it and passes a variable map to `ComponentsManager`. Component `Renderer.build()` also exposes those variables as XSLT parameters. Normally the **page XSLT** should map resolved values onto the component's own attributes, as `course-page` does for `p:navbar`.

The names of page metadata variables are not automatically equivalent to JSON property paths: use `ref` to bind them explicitly.