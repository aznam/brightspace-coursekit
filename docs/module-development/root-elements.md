# Semantic root registration

`ContentManager.registerRoot` keys root definitions by `(namespace, localName)`, requiring a `namespace`, `localName`, `schema` and `owner`. The registry supports a paired `rootScheme` and `rootElement` declaration; module roots are considered when their module manager registers them.

A root is not a module ID, nor the XML filename. It identifies the QName of the document element and supplies an entry schema for that QName. A namespace alone is insufficient when multiple roots can coexist.

Check `framework/registry.json`, `framework/scripts/modules-manager.js`, and `framework/scripts/content-manager.js` when adding a root; the manifest shape is governed by the current `framework/schemas/module.schema.json`. Do not assume that a new page type implies a new semantic root.
