# Module template

A module is a reusable library that can provide components, page types, schemas, scripts, and styles. It is distinct from course `resources`, which are manually loaded CSS/JS/font files that do not register framework capabilities.

1. Copy this directory.
2. Rename the module and update `module.json` (`id`, `name`, `namespace`).
3. Add components under `components/`.
4. Add page types only when the module genuinely provides a new page type.
5. Declare module-level styles/scripts/schemas only when they belong to the library as a whole.
6. Register the module with the framework/course registry when module loading is enabled.
