# Managers and lifecycle

`framework/bootstrap.js` owns orchestration, not individual transformations. The current initialization sequence is:

1. Read loader data (`courseRoot`, `courseConfig`, `content`) and initialize `ResourceLoader` and manifest validation.
2. `ConfigManager.init()` loads and validates `course.json`; create `LinkResolver`, `StyleLoader`, `FontLoader`, and `ScriptLoader`.
3. Create `ContentManager`, `PagesManager`, and `ComponentsManager`; call their `init()` methods.
4. `ModulesManager.init()` registers module contributions, including semantic contracts, pages, visual components, and selectable page extensions.
5. Run `ComponentsManager.prepare()`, `PagesManager.prepare()`, then `ContentManager.prepare()` to load schemas, templates, and validators.
6. Load framework, course, and module styles/scripts/fonts; apply theme.
7. Call `ContentManager.show(data-content, { pages, components })`.

During rendering, `ContentManager` validates semantic XML, then calls `PagesManager.render()`. `PagesManager` composes the **selected** page XSLT and its dependencies on demand, checks parameters, resolves page variables, and validates the generated page XML. `ComponentsManager` renders the visual-root component recursively. Finally `ContentManager` mounts it and invokes post-render behaviors.

| Service | Scope |
| --- | --- |
| `ConfigManager` | Course configuration, JSON lookups and semantic interpolation |
| `ContentManager` | Semantic contracts, XML loading/validation, mounting, lifecycle |
| `PagesManager` | Page definitions, page-XSD validation and selected XSLT composition |
| `ComponentsManager` | Component manifests, templates, renderers, visual trees |
| `ModulesManager` | Module registration and dependency/resource verification |
| `ResourceLoader` | Root-qualified paths, VFS identities, loading and caching |
| `LinkResolver` | Link resolution |
| `FontLoader`, `StyleLoader`, `ScriptLoader` | Their resource classes and application |
| `ManifestValidator` | JSON schema validation |

`ModulesManager` registers contributions; it does not mean that every page's XSLT is merged. `pageExtensions` creates a separately selectable page definition.
