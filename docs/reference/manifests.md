# JSON manifests and validation

CourseKit validates its JSON definitions using schemas under `framework/schemas/`. These are separate from the XSDs used for XML validation. Registered files are checked for presence during manager preparation.

| Manifest | Contract file | Principal properties |
| --- | --- | --- |
| Course | `course.schema.json` | `version`, `siteId`, `course`, `resources`, `modules`, `theme`, `variables`, `customPaths` |
| Semantic | `semantic.schema.json` | `id`, `schema`, optional `namespace`, `name` |
| Page | `page.schema.json` | `id`, `schema`, `transform`, `parameters`, optional `styles`, `scripts` |
| Component | `component.schema.json` | `id`, `template`, `renderer`, optional `schema`, `styles`, `scripts`, `variants`, `extends` |
| Module | `module.schema.json` | `id`, `semantic`, `pages`, `components`, `schemas`, `pageExtensions`, `dependsOn`, resources |

Example page manifest:

```json
{
  "id": "course-page",
  "schema": "$(frameworkRoot)/pages/course-page/course-page.xsd",
  "transform": "$(frameworkRoot)/pages/course-page/transform.xslt",
  "parameters": {
    "title": { "type": "string", "default": "" },
    "module-name": { "type": "string", "default": "" },
    "toc": { "type": "boolean", "default": true }
  }
}
```

The full shipped manifest contains further parameters. Public parameters are validated by `PagesManager.checkParams()`; these are not the same as page metadata `<p:var>` declarations.

Module `pageExtensions` uses `page` (base type), `id` (new selectable type), and `transform` (XSLT overlay). For example, the module registers `learning-page` derived from `course-page`; rendering `course-page` does not load the `learning` overlay.
