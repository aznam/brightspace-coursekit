# Modules and extensions

Modules are ordered in `course.json` and declared through a JSON manifest. `ModulesManager` verifies dependencies, resource references, and registers contributions with the appropriate manager.

```json
{
  "id": "learning-module",
  "semantic": ["$(courseRoot)/modules/learning/semantic/learning-semantic.json"],
  "pageExtensions": [{
    "page": "course-page",
    "id": "learning-page",
    "transform": "$(courseRoot)/modules/learning/pages/learning-page.xslt"
  }],
  "dependsOn": []
}
```

Modules may declare `semantic`, `schemas`, `pages`, `components`, `styles`, `scripts`, `resources`, `pageExtensions`, and `dependsOn`. Dependencies must occur earlier in the course's module list. A page extension registers an independently selectable definition; it does not alter all uses of the base page.

The `learning` example contributes semantic elements (`l:term`, `l:section`, `l:infonote`, `l:details`, `l:objectives`) and a `learning-page` overlay. It does not need to duplicate the whole parent page XSLT.

See [manifests](../reference/manifests.md) and [XSLT preprocessing](xslt.md).
