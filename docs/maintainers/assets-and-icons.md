# Fonts and icon resolution

The implementations are `framework/scripts/font-loader.js` (`FontLoader`) and `framework/scripts/icon-resolver.js` (`IconResolver`).

## Fonts

`FontLoader.load(fonts, origin)` accepts declarations having `family` and `source`. `source: "online"` requires a stylesheet `url` and delegates loading to `StyleLoader.loadUrl`. `source: "local"` consumes `files` (or a single `src` fallback) and creates `FontFace` objects with per-file `weight` and `style`; the URL is resolved relative to the declaration origin or through `ResourceLoader.asset(..., 'fonts', location)`. Faces are registered in `document.fonts`; load failures warn without preventing page fallback.

`cssVariable` (validated `--...`) writes the composed `"family", fallback` stack onto `document.documentElement`. The module uses `font-loader.js` rather than assuming a `FontsManager` named API exists in the current snapshot.

## Icons

`IconResolver.resolve(name, component)` first searches scoped key `icons[component + '.' + name]`, then global `icons[name]`. Empty/`none` returns null. `apply()` supports `type: "text"` (a text node) or `type: "font"` (a `span` with configured CSS classes), replacing the target element's children. It does **not** inject arbitrary HTML or load vendor CSS.

The Font Awesome framework module makes font assets available independently from the logical `icons` map. Components should request logical names, not assume a particular vendor.

Examples of actual declaration formats live in `example-course/course.json`.
