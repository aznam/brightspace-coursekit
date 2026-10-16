# Brightspace CourseKit

CourseKit is a declarative framework for creating consistent Brightspace course pages without repeatedly authoring their HTML layouts. Authors write semantic XML; the framework validates it, selects a page definition, and renders visual components.

## Why use it?

Maintaining coherent page markup across a Brightspace course is repetitive. CourseKit separates content from layout, makes components and page types reusable, and allows course-specific styles and modules without duplicating whole pages. LLM-assisted authoring can focus on semantic content rather than reproducing presentation markup; outputs still require editorial and technical review.

## Explore

- [Get started](./guide/getting-started.md) and [configure the bootstrap](./guide/bootstrap.md).
- Understand the [semantic → page → components pipeline](./architecture/pipeline.md).
- Consult the [semantic vocabulary](./reference/semantic.md), [page contract](./reference/pages.md), and [visual component catalog](./components/index.md).
- Extend schemas with [XSD preprocessing](./extensions/xsd.md) and transformations with [XSLT preprocessing](./extensions/xslt.md).

> This documentation describes the supplied repository snapshot. Some examples in that snapshot contain inconsistent paths or declarations; these are identified where relevant rather than silently assumed to work.

## Writing course XML

Start with the **[semantic component authoring catalogue](./semantic/index.md)**. It documents the actual `s:*` schema contracts (attributes, allowed children, text/mixed content, examples) and the optional `l:*` learning module. The [visual catalogue](./components/index.md) describes implementation components produced later by the page transformer.
