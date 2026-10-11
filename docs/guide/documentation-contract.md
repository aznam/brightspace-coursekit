# Component documentation contract

Each component has:

- `component.json`: **runtime manifest** and component loader configuration. Do not duplicate renderer internals in the manifest.
- `COMPONENT.md`: **human/agent-readable public contract**. YAML front matter is stable machine-readable metadata; headings are stable sections. Markdown examples are real XML examples, not a substitute for XSD validation.
- `renderer.js` (if owned by the component): **JSDoc annotations for JS APIs**. For inherited components, document the renderer on its defining component.
- `course-page.xsd`: **formal XML validator**. Documentation must not claim features that the XSD or runtime do not support.

Stable front matter fields: `id`, `element`, `status`, `manifest`. The document sections are `XML contract`, `Example`, `Behavior and constraints`, `Implementation`.

The `docs:check` script compares documented attributes against the XSD and checks identity metadata. It does not prove every example renders correctly; runtime tests are still needed.
