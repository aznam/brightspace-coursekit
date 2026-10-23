# Module `learning-module`

**Manifest:** `example-course/modules/learning/module.json`

## Registered contracts

| Field | Value |
| --- | --- |
| `id` | `learning-module` |
| `name` | `Learning Extension Module` |
| `version` | `1.0.0` |
| `namespace` | `urn:coursekit:semantic:learning` |
| `dependsOn` | `[]` |

### `semantic`

- `$(courseRoot)/modules/learning/semantic/learning-semantic.json`

### `pages`

None.

### `components`

None.

### `pageExtensions`

- `{'page': 'course-page', 'transform': '$(courseRoot)/modules/learning/pages/learning-page.xslt', 'id': 'learning-page'}`

### `styles`

None.

### `scripts`

None.

## XSD declarations

| Schema | Target namespace |
| --- | --- |
| [`example-course/modules/learning/pages/learning-page.xsd`](/reference/catalog/example-course--modules--learning--pages--learning-page) | `urn:coursekit:page:learning` |
| [`example-course/modules/learning/semantic/learning-semantic.xsd`](/reference/catalog/example-course--modules--learning--semantic--learning-semantic) | `urn:coursekit:semantic:learning` |

## CSS custom properties (observed, not automatically public)

No module CSS stylesheets in this snapshot.

**Public CSS contract rule:** Expose an intentionally named component variable and resolve internal variables through it; reuse `tokens.css` before introducing new values. The presence of a variable in CSS does not alone make it supported public API.
