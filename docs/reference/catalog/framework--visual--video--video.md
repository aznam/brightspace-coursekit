# `framework/visual/video/video.xsd`

**Category:** visual · **Ownership:** native · **Target namespace:** `urn:coursekit:visual`

**Source XSD:** `framework/visual/video/video.xsd`

## Manifest

| Key | Value |
| --- | --- |
| id | `video` |
| schema | `$(frameworkRoot)/visual/video/video.xsd` |
| template | `$(frameworkRoot)/visual/video/template.xslt` |
| renderer | `$(frameworkRoot)/visual/video/renderer.js` |
| styles | $(frameworkRoot)/visual/video/video.css |
| scripts |  |
| variants | default |


## Global element declarations

No global element declared in this XSD. The element may be declared by the page composition XSD.

## Named types and inheritance

| Type | Mixed content |
| --- | --- |
| `VideoType` | not declared mixed |


**Native XSD derivations:**

| Type | Base |
| --- | --- |
| `VideoType` | `c:VisualNode` |


## Directly declared attributes

| Type | Attribute | XSD type | Use | Default |
| --- | --- | --- | --- | --- |
| `VideoType` | `src` | `xs:string` | required | — |
| `VideoType` | `poster` | `xs:string` | optional | — |
| `VideoType` | `preload` | `xs:string` | optional | — |
| `VideoType` | `alt` | `xs:string` | optional | — |
| `VideoType` | `legend` | `xs:string` | optional | — |


## Child elements / references

No child references declared directly.

## CSS interface (source inventory)

**Stylesheet:** `framework/visual/video/video.css`

**Important:** Declarations below are observed in the CSS, not automatically an approved public override API. Public status must be verified against the component contract and `CONVENTIONS.md`.

No local `--ck-*` custom-property declarations.

**Custom properties consumed via `var(...)`:** `--ck-font-footnote`, `--ck-leading-footnote`, `--ck-space-xs`, `--ck-surface`, `--ck-text-main`, `--ck-video-aspect-ratio`, `--ck-video-background`, `--ck-video-caption-color`, `--ck-video-caption-font-size`, `--ck-video-caption-gap`, `--ck-video-caption-line-height`, `--ck-video-max-width`

**Template output elements (static inventory):** `figcaption`, `figure`, `video`

## Mapping and scope

Semantic-to-page mappings are defined in the page transformation XSLT, not in this individual XSD. Consult the [mapping index](/reference/xml-mappings) and the [page parameters](/reference/page-parameters).

> This entry is generated from the source schema and associated component assets. It distinguishes direct declarations from inherited/page-level contracts.
