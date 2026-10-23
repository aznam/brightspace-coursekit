# Schema preparation and Xerces integration

**Audience: CourseKit framework maintainers.** This is not a page-authoring API.

## Pipeline

1. Load registered semantic/page/component schemas from the framework registry and modules.
2. Register the original XSD documents under VFS keys with their target namespaces.
3. Process `xsp:extend`, `xsp:slot` and `xsp:inherit` in `XSDPreprocessor`.
4. Resolve XSD locations and assemble per-namespace master schemas with `xs:include` for same-namespace declarations.
5. Resolve `xs:import namespace="..."` to the corresponding master during generation, and keep `xs:include` before `xs:import` in the prepared files to accommodate the Xerces integration.
6. Normalize the VFS where required by `xsd-xerces-workaround.js` (potential basename collisions); note original → normalized VFS path mapping.
7. Pass the prepared entry and file map to `compileXSD` in `xsd.js` and validate the input document.

A namespace master is a schema assembly artifact, not a source component. `xs:include` contributes same-namespace definitions; `xs:import` exposes another namespace. Cyclic file references alone do not imply that the schema is semantically invalid.

## Diagnostics

The optional audit module is `framework/scripts/xsd-audit.js`. Depending on the installed version, enable it with `?ck-xsd-audit=1` or pre-bootstrap `window.CourseKitXsdAuditEnabled = true`. Verify the actual deployed script before relying on either switch.

## Debugging protocol

Capture both *pre-normalization* and *post-normalization* XSD graphs; test compilation separately from XML validation. Compare libxml2 or native Xerces against Xerces-WASM using the exact final files, not raw source schemas. A passing independent validator does not establish WASM behavior.

See `framework/scripts/content-manager.js`, `pages-manager.js`, `components-manager.js`, `xsd-preprocessor.js`, `xsd-xerces-workaround.js`, `xsd-audit.js`, and `xsd.js`.
