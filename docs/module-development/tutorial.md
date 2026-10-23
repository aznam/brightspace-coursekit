# Tutorial: build a CourseKit module

This tutorial targets a module author (framework or course). It describes the contracts evidenced by `ModulesManager`, `ContentManager`, `PagesManager` and manifests in the supplied repository.

## 1. Allocate distinct namespaces

Choose a stable module ID, e.g. `acme`, and child namespaces `urn:coursekit:semantic:acme`, `urn:coursekit:page:acme` and `urn:coursekit:visual:acme` for the categories you contribute.

## 2. Declare semantic types separately from elements

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           xmlns:s="urn:coursekit:semantic"
           xmlns:a="urn:coursekit:semantic:acme"
           targetNamespace="urn:coursekit:semantic:acme"
           elementFormDefault="qualified">
    <xs:import namespace="urn:coursekit:semantic"/>

    <xs:complexType name="MessageType" mixed="true">
        <xs:attribute name="title" type="xs:string" use="required"/>
    </xs:complexType>

    <xs:element name="message" type="a:MessageType"
                substitutionGroup="s:component"/>
</xs:schema>
```

The complex type defines a reusable contract; the global element declares the name used in authored XML. For nested local elements, use the XSD content model deliberately.

## 3. Register the semantic descriptor

Create a manifest containing `id`, `schema`, `namespace`; add it under `module.json` → `semantic`. The module is loaded via `course.json` → `modules`. Use resource substitutions where supported (`$(courseRoot)` / `$(frameworkRoot)`).

## 4. Add a page only if the module needs its own page type

A page manifest declares `id`, `schema`, `transform`, and supported `parameters`. A page XSD defines a page type and element, typically using its own child `page` namespace and referencing native page infrastructure through `xs:import`. Page XSLT transforms semantic input into intermediate page XML.

If a new semantic document **root** is needed, register the pair `rootScheme` and `rootElement` with the correct `namespace` and `localName`, rather than assuming every module uses `s:content`. Consult [Root elements](/module-development/root-elements).

## 5. Add visual components

Register each `component.json` with `schema`, `template`, `renderer`, and optional `styles`/`scripts`/`variants`. Define its type in the module visual namespace; expose an appropriate page element that references that type. Use namespace-aware names.

Use [Visual XSD catalog](/reference/visual-xsd) for the actual examples and [CSS rules](/reference/css-conventions) for public tokens and internal variables.

## 6. Extend, rather than duplicate

Use `xsp:inherit` when a new derived type needs a copied/adapted model from a registered named complex type. Use `xsp:extend`/`xsp:slot` where the schema preprocessing contract supports controlled augmentation; these directives are compiled away *before* Xerces. See [XSD preprocessor](/module-development/xsd-extensions).

## 7. Validate end-to-end

Verify manifests, XML well-formedness, generated master schemas, libxml2/Xerces compilation where available, semantic input validity, intermediate page validity, rendered component dispatch, CSS responsive behavior and any lifecycle scripts. Run the same checks with and without the module to detect accidental namespace leaks.

**Not an automatic guarantee:** a syntactically valid XSD does not prove the page transform or rendering behavior.
