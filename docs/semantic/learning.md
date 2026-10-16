# Learning module: semantic extensions

These elements use `urn:coursekit:semantic:learning` (prefix `l:` in the example) and come from `example-course/modules/learning/semantic/learning-semantic.xsd`. Enable the module through `course.json`, and select `page-type="learning-page"` for its page-specific XSLT mapping. Merely registering semantic elements does not make the `course-page` transformer understand them.

| Element | Contract and mapping |
| --- | --- |
| `l:section` | Inherits `s:SectionType` via XSD `xsp:inherit`, adding `l:paragraph`, `l:infonote`, `l:details`, and `l:section` child choices. Its XSLT inherits the base `s:section` rule in normal, `navbar`, and `toc` modes. |
| `l:paragraph` | Inherits the mixed `s:ParagraphType` model, adding `l:term`. XSLT reuses the `s:paragraph` rule. |
| `l:term` | Mixed text content; inherits `s:Text` (`id`, `title`) and adds optional `definition-title`. Maps to `p:hoverbox`. |
| `l:infonote` | Inherits `s:NoteType`: `s:paragraph` and `s:list` children; maps to `p:infobox` with `variant="info"`, `icon="info"`, `style-ref="course-note"`. |
| `l:details` | Inherits `s:NoteType`, adds optional boolean `open`; maps to `p:collapse-box`. |
| `l:objectives` | Contains **one or more** `l:objective` (text), with optional `id`, `title`, `nav`; maps to `p:section` containing `p:list`. |
| `l:objective` | Text item inside `l:objectives`. |

## Example

```xml
<s:content xmlns:s="urn:coursekit:semantic"
           xmlns:l="urn:coursekit:semantic:learning"
           page-type="learning-page"
           title="Learning module">
  <l:section id="intro" title="Introduction" nav="true">
    <l:paragraph>Important <l:term title="term" definition-title="Definition">Explanation.</l:term></l:paragraph>
    <l:infonote title="Remember"><s:paragraph>A short note.</s:paragraph></l:infonote>
    <l:details title="More detail"><s:paragraph>Further explanation.</s:paragraph></l:details>
  </l:section>
  <l:objectives id="objectives" title="Learning objectives" nav="true">
    <l:objective>Recognize the components.</l:objective>
  </l:objectives>
</s:content>
```

**Schema caveat:** `l:section` expands its allowed child types specifically; it does not simply allow arbitrary `l:*` descendants. Its detailed source of truth is the module XSD.
