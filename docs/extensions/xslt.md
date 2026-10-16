# XSLT preprocessor

`framework/scripts/xslt-preprocessor.js` composes XSLT 1.0 documents before they reach the browser's `XSLTProcessor`. It supports root-qualified resources, XSLT import/include, named templates and modes, plus CourseKit `xsp:*` directives.

## `xsl:import` and `xsl:include`

```xml
<xsl:import href="$(frameworkRoot)/pages/course-page/transform.xslt"/>
```

The preprocessor loads references through `ResourceLoader`, detects import/include cycles, and emits one XSLT stylesheet. Import precedence is approximated by generated explicit priorities; this is **not** a complete reimplementation of all native XSLT import-precedence corner cases.

## `xsp:inherit` — reuse a matching rule

```xml
<xsl:template match="l:section" mode="navbar">
  <xsp:inherit match="s:section"/>
</xsl:template>
```

`xsp:inherit` resolves the parent rule identified by `match` and effective `mode`. The preprocessor generates a named template holding the parent rule's body and replaces the directive with `xsl:call-template`, preserving the **current `l:section` node** as context. `xsp:inherit` itself is not an XSLT instruction.

## `xsp:slot` / `xsp:extend` — additive changes

The base rule exposes an insertion point:

```xml
<xsl:template match="/s:content">
  <p:navbar>
    <xsp:slot name="navbar-items">
      <xsl:apply-templates select="*" mode="navbar"/>
    </xsp:slot>
  </p:navbar>
</xsl:template>
```

A contributing stylesheet adds instructions at the named point:

```xml
<xsp:extend match="/s:content" slot="navbar-items">
  <xsl:apply-templates select="l:section" mode="navbar"/>
</xsp:extend>
```

The preprocessor appends extension instructions to the matching slot. A target must have exactly one slot with that name, or processing fails. Unextended slots unwrap to their original XSLT instructions. Use `mode` in `xsp:extend` when the target template uses a non-default mode.

## Named templates and modes

These are standard XSLT mechanisms. `course-page/transform.xslt` uses the `navbar` and `toc` modes so the module can contribute rules without duplicating the root-page template. `learning-page.xslt` demonstrates inheritance from `s:section` and `s:paragraph` and adds module-specific rules.

## Activation

`PagesManager` composes **only the selected page** and its explicit overlays/imports on demand, caching that result. In `module.json`, `pageExtensions` with `{ "page": "course-page", "id": "learning-page", "transform": "..." }` registers a new derived page definition. Selecting `course-page` uses the parent alone; selecting `learning-page` uses the parent and overlay without needing `xsl:import`. An explicitly importing standalone page XSLT is a separate supported pattern.

> The snapshot's preprocessor flattens stylesheet imports and adjusts template priorities, so test nontrivial combinations, especially conflicting wildcard rules and priority expressions.
