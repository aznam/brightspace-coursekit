# XML namespace ownership and naming

## Native framework vocabularies

- Framework-native page XSD: `urn:coursekit:page`.
- Framework-native semantic XSD: `urn:coursekit:semantic`.
- Framework-native visual XSD: `urn:coursekit:visual`.

**Native files must not declare child namespaces merely for individual components.** The QName, not the prefix string, identifies an element. Prefixes such as `p`, `s` and `c` are conventions, not part of the namespace URI.

## Modules, including framework-shipped modules

A module owns child namespaces for each vocabulary it contributes, for example `urn:coursekit:page:document`, `urn:coursekit:semantic:document` and `urn:coursekit:visual:document`. The same rule applies to course-provided modules. Names must be unique across installed modules.

Module declarations may **reference** the native framework namespace using imports but should not silently declare their own components inside the native namespace. A module page can reference native `p:meta` while defining its own intermediate page elements in its child page namespace.

Use namespace-aware QNames for dispatch and schema resolution, never the local name alone.

## Imports / includes

- `xs:include` connects schema documents contributing to the **same** target namespace.
- `xs:import` refers to a **different** namespace and module authors write only `<xs:import namespace="urn:coursekit:semantic"/>`; **do not specify** `schemaLocation` on module imports. CourseKit resolves registered namespace masters.
- `xs:include` does not substitute for a cross-namespace `xs:import`.
- In generated validation XSDs, preserve the established include-before-import ordering for compatibility with the current Xerces integration.

See the [maintainer schema pipeline](/maintainers/schema-pipeline) for details of generated XSDs.
