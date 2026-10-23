# XSD preprocessor

`framework/scripts/xsd-preprocessor.js` extends XSD processing with `xsp:inherit` in namespace `urn:coursekit:preprocessor`. It operates on registered XSD documents before passing them to Xerces.

```xml
<xs:complexType name="LearningSectionType"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:xsp="urn:coursekit:preprocessor"
  xmlns:s="urn:coursekit:semantic"
  xmlns:l="urn:coursekit:semantic:learning">
  <xsp:inherit base="s:SectionType">
    <xs:element ref="l:paragraph"/>
    <xs:element ref="l:infonote"/>
  </xsp:inherit>
</xs:complexType>
```

`base` is a QName of a registered named complex type. The preprocessor locates the base type by namespace and local name, collects its model and attributes (including type hierarchy), copies them into the derived declaration, and appends the local child declarations to the copied content model. This is **preprocessing**, not native XSD inheritance; it produces an XSD that is later validated normally. The `learning-semantic.xsd` example uses it for terms, rich paragraphs, notes, details, and sections.

`xs:include` and `xs:import` references use `$(frameworkRoot)` and `$(courseRoot)` where appropriate. The preprocessor resolves them into VFS-relative names; every referenced schema must already be registered. The VFS preserves full paths and rejects duplicate keys.

### Limitations

`xsp:inherit` works with named complex types and their supported content models. It is not a general-purpose implementation of every XML Schema derivation pattern. The preprocessor handles referenced registered files, rather than discovering arbitrary missing imports automatically.