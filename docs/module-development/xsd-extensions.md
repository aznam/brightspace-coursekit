# Authoring with XSD preprocessing

`xsp` denotes `urn:coursekit:preprocessor`; `xsp:*` is CourseKit input syntax, **not XSD syntax understood by Xerces**. The preprocessor compiles it into standard schema declarations before validation.

## `xsp:inherit`

Inside a named complex type, `xsp:inherit base="prefix:TypeName"` copies the registered base type's supported particle structure and attributes, then integrates locally declared children. It does not create a native `xs:extension` link. The referenced base QName must resolve to a registered type; copied child refs must remain resolvable in the final schema graph.

## `xsp:extend` and `xsp:slot`

`xsp:extend` is the schema extension mechanism for modifying a target's prepared content model, while `xsp:slot` identifies insertion locations (and must be eliminated from the output). Include expansion occurs only for schemas that use `xsp:extend`, as implemented in `XSDPreprocessor._expandIncludes`. Do not infer that a module may arbitrarily mutate native XSD source files: the changes apply to the validation copy.

The exact supported attributes and placement rules are described in source `framework/scripts/xsd-preprocessor.js`, which remains authoritative.

## Cross-namespace contract

Use `<xs:import namespace="..."/>` with no location when authoring module XSDs, and let the manager resolve the namespace master. Import and include are different XSD directives.
