# Page contracts

## Semantic source

The source root is `<s:content>` with required `page-type`. The `content.xsd` allows public page attributes for the selected type; `PagesManager.checkParams()` checks them against `page.json`.

The shipped `course-page` manifest supports `title`, `subtitle`, `module-name`, `image`, `background`, `toc`, `page-numbered`, `variant`, and `style-ref`.

## Intermediate page

The base page XSD (`framework/pages/base/base.xsd`) defines abstract `p:page`, `PageType`, `MetaType`, and `VariableType`. The `course-page` XSD extends `PageType` with a visual `p:layout` and declares `p:course-page` in the substitution group of `p:page`.

```xml
<p:course-page xmlns:p="urn:coursekit:page">
  <p:meta>
    <p:var name="course-title" value="Course name"/>
  </p:meta>
  <p:layout>
    <p:navbar page-title="Course name"/>
    <p:hero title="Course name"/>
    <p:central-content>...</p:central-content>
  </p:layout>
</p:course-page>
```

`PagesManager` renders and validates this intermediate XML; it is **not** the authored semantic page. `ContentManager` extracts metadata and renders the visual child through `ComponentsManager`.

## Page extension versus XSLT import

`pageExtensions` registers an independently selectable derived page; the overlay is composed only when its `id` is selected. Separately, a page XSLT can explicitly use `xsl:import` / `xsl:include` and have them loaded by `XSLTPreprocessor`. See [XSLT extensions](../extensions/xslt.md).

## Snapshot consistency notes

In the provided flat export, `example-course/modules/learning/pages/learning-page.json` references paths under `modules/learning/` without `pages/`, although the files reside under `modules/learning/pages/`. The working `learning-page` in the example is currently registered via `module.json` → `pageExtensions`, so that other manifest is not necessarily exercised. This documentation preserves the observed design rather than assuming the standalone manifest works unchanged.