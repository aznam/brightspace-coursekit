# XML transformation mapping inventory

Maps `xsl:template/@match` to literal output XML elements seen in the same template. **Static inventory only:** `xsl:apply-templates`, `xsp:inherit`, `xsp:extend`, named templates and runtime components may add other elements; consult the XSLT for the full execution path.

| XSLT source | Input match | Mode | Direct output (sample) |
| --- | --- | --- | --- |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:section` | `default` | Dynamic/none |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:section` | `navbar` | Dynamic/none |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:section` | `toc` | Dynamic/none |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:paragraph` | `default` | Dynamic/none |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:term` | `default` | `{urn:coursekit:page}hoverbox` |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:infonote` | `default` | `{urn:coursekit:page}infobox` |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:details` | `default` | `{urn:coursekit:page}collapse-box` |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:objectives` | `default` | `{urn:coursekit:page}section`, `{urn:coursekit:page}list`, `{urn:coursekit:page}item` |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:objectives` | `navbar` | `{urn:coursekit:page}link` |
| `example-course/modules/learning/pages/learning-page.xslt` | `l:objectives` | `toc` | `{urn:coursekit:page}link` |
| `framework/modules/assignment/pages/assignment-page.xslt` | `/s:content` | `default` | `{urn:coursekit:page:assignment}assignment-page`, `{urn:coursekit:page}meta`, `{urn:coursekit:page}var` |
| `framework/modules/assignment/visual/assignment-band/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}span` |
| `framework/modules/assignment/visual/assignment-layout/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-slot` |
| `framework/modules/assignment/visual/assignment-submit/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}h2`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}a` |
| `framework/modules/document/pages/document-page.xslt` | `/s:content` | `default` | `{urn:coursekit:page:document}document-page`, `{urn:coursekit:page}meta`, `{urn:coursekit:page}var`, `{urn:coursekit:page:document}document-layout` |
| `framework/modules/document/pages/document-page.xslt` | `ms:section\|d:section` | `doc` | `{urn:coursekit:page:document}document-section` |
| `framework/modules/document/pages/document-page.xslt` | `s:paragraph` | `doc` | `{urn:coursekit:page:document}document-paragraph` |
| `framework/modules/document/pages/document-page.xslt` | `text()` | `doc-inline` | Dynamic/none |
| `framework/modules/document/pages/document-page.xslt` | `s:important` | `doc-inline` | `{urn:coursekit:page}text-style` |
| `framework/modules/document/pages/document-page.xslt` | `s:note\|s:information` | `doc` | `{urn:coursekit:page:document}document-note` |
| `framework/modules/document/pages/document-page.xslt` | `s:list` | `doc` | `{urn:coursekit:page:document}document-list` |
| `framework/modules/document/pages/document-page.xslt` | `s:item` | `doc` | `{urn:coursekit:page}item` |
| `framework/modules/document/pages/document-page.xslt` | `s:picture` | `doc` | `{urn:coursekit:page:document}document-figure` |
| `framework/modules/document/pages/document-page.xslt` | `d:author` | `doc` | `{urn:coursekit:page:document}document-author` |
| `framework/modules/document/pages/document-page.xslt` | `d:break` | `doc` | `{urn:coursekit:page:document}document-break` |
| `framework/modules/document/visual/document-author/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}span` |
| `framework/modules/document/visual/document-blank/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}div` |
| `framework/modules/document/visual/document-body/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}main`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-break/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div` |
| `framework/modules/document/visual/document-cover/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-cover-brand/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}img`, `{http://www.w3.org/1999/xhtml}strong`, `{http://www.w3.org/1999/xhtml}hr` |
| `framework/modules/document/visual/document-cover-meta/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}span` |
| `framework/modules/document/visual/document-cover-title/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}h1` |
| `framework/modules/document/visual/document-end/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div` |
| `framework/modules/document/visual/document-figure/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}figure`, `{http://www.w3.org/1999/xhtml}img`, `{http://www.w3.org/1999/xhtml}figcaption` |
| `framework/modules/document/visual/document-flow/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-footer/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}footer`, `{http://www.w3.org/1999/xhtml}div` |
| `framework/modules/document/visual/document-header/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}header`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}img`, `{http://www.w3.org/1999/xhtml}strong` |
| `framework/modules/document/visual/document-layout/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-slot`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-list/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}ul`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-note/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}aside`, `{http://www.w3.org/1999/xhtml}strong`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-page-frame/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-paragraph/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}p`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-section/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}h1`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-sheet/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/modules/document/visual/document-toolbar/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}span`, `{http://www.w3.org/1999/xhtml}strong`, `{http://www.w3.org/1999/xhtml}button` |
| `framework/modules/people/pages/people-page.xslt` | `ms:people-section` | `default` | Dynamic/none |
| `framework/modules/people/pages/people-page.xslt` | `ms:people-section` | `navbar` | Dynamic/none |
| `framework/modules/people/pages/people-page.xslt` | `ms:people-section` | `toc` | Dynamic/none |
| `framework/modules/people/pages/people-page.xslt` | `ms:team` | `default` | `{urn:coursekit:page:people}assistant-grid` |
| `framework/modules/people/pages/people-page.xslt` | `ms:person` | `default` | Dynamic/none |
| `framework/modules/people/pages/people-page.xslt` | `ms:person` | `compact` | Dynamic/none |
| `framework/modules/people/visual/assistant-card/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}article`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}img`, `{http://www.w3.org/1999/xhtml}h3` |
| `framework/modules/people/visual/assistant-grid/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/pages/course-page/transform.xslt` | `/s:content` | `default` | `{urn:coursekit:page}course-page`, `{urn:coursekit:page}meta`, `{urn:coursekit:page}var`, `{urn:coursekit:page}layout`, `{urn:coursekit:page}navbar`, `{urn:coursekit:page}theme-switch` |
| `framework/pages/course-page/transform.xslt` | `*` | `navbar` | Dynamic/none |
| `framework/pages/course-page/transform.xslt` | `s:section` | `navbar` | `{urn:coursekit:page}link` |
| `framework/pages/course-page/transform.xslt` | `*` | `toc` | Dynamic/none |
| `framework/pages/course-page/transform.xslt` | `s:section` | `toc` | `{urn:coursekit:page}link` |
| `framework/pages/course-page/transform.xslt` | `s:section` | `default` | `{urn:coursekit:page}section` |
| `framework/pages/course-page/transform.xslt` | `s:information` | `default` | `{urn:coursekit:page}side` |
| `framework/pages/course-page/transform.xslt` | `s:summary` | `default` | `{urn:coursekit:page}summary-box` |
| `framework/pages/course-page/transform.xslt` | `s:note` | `default` | `{urn:coursekit:page}infobox` |
| `framework/pages/course-page/transform.xslt` | `s:details` | `default` | `{urn:coursekit:page}collapse-box` |
| `framework/pages/course-page/transform.xslt` | `s:paragraph` | `default` | `{urn:coursekit:page}paragraph` |
| `framework/pages/course-page/transform.xslt` | `s:heading` | `default` | `{urn:coursekit:page}heading` |
| `framework/pages/course-page/transform.xslt` | `s:list` | `default` | `{urn:coursekit:page}list` |
| `framework/pages/course-page/transform.xslt` | `s:item` | `default` | `{urn:coursekit:page}item` |
| `framework/pages/course-page/transform.xslt` | `s:link` | `default` | `{urn:coursekit:page}link` |
| `framework/pages/course-page/transform.xslt` | `s:important\|s:emphase\|s:underline` | `default` | `{urn:coursekit:page}text-style` |
| `framework/pages/course-page/transform.xslt` | `s:tutorial` | `default` | `{urn:coursekit:page}tutorial` |
| `framework/pages/course-page/transform.xslt` | `s:steps` | `default` | `{urn:coursekit:page}list` |
| `framework/pages/course-page/transform.xslt` | `s:illustration` | `default` | `{urn:coursekit:page}illustration` |
| `framework/pages/course-page/transform.xslt` | `s:video` | `default` | `{urn:coursekit:page}video` |
| `framework/pages/course-page/transform.xslt` | `s:picture` | `default` | `{urn:coursekit:page}picture` |
| `framework/pages/course-page/transform.xslt` | `text()` | `default` | Dynamic/none |
| `framework/pages/course-page/transform.xslt` | `*` | `default` | `{urn:coursekit:diagnostics}unknown` |
| `framework/visual/central-content/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}main`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/collapse-box/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}details`, `{http://www.w3.org/1999/xhtml}summary`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/heading/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}h3`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/hero/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}h1`, `{http://www.w3.org/1999/xhtml}p` |
| `framework/visual/hoverbox/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}span`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/illustration/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/infobox/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}aside`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}span`, `{http://www.w3.org/1999/xhtml}h3`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/inline-toc/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}nav`, `{http://www.w3.org/1999/xhtml}strong`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/item/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}li`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/link/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}a`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/list/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}ol`, `{http://www.w3.org/1999/xhtml}ck-children`, `{http://www.w3.org/1999/xhtml}ul` |
| `framework/visual/navbar/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}header`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}nav`, `{http://www.w3.org/1999/xhtml}span`, `{http://www.w3.org/1999/xhtml}ck-slot` |
| `framework/visual/page-layout/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children`, `{http://www.w3.org/1999/xhtml}ck-slot`, `{http://www.w3.org/1999/xhtml}main` |
| `framework/visual/paragraph/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}p`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/picture/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}figure`, `{http://www.w3.org/1999/xhtml}img`, `{http://www.w3.org/1999/xhtml}figcaption` |
| `framework/visual/section/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}section`, `{http://www.w3.org/1999/xhtml}h2`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/side/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}aside`, `{http://www.w3.org/1999/xhtml}h2`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/sidebar-after/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/sidebar-before/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/summary-box/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}aside`, `{http://www.w3.org/1999/xhtml}h2`, `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/text-style/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}strong`, `{http://www.w3.org/1999/xhtml}ck-children`, `{http://www.w3.org/1999/xhtml}em`, `{http://www.w3.org/1999/xhtml}u` |
| `framework/visual/theme-switch/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}button`, `{http://www.w3.org/1999/xhtml}span` |
| `framework/visual/tutorial/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}div`, `{http://www.w3.org/1999/xhtml}h3`, `{http://www.w3.org/1999/xhtml}ck-slot`, `{http://www.w3.org/1999/xhtml}ck-children` |
| `framework/visual/video/template.xslt` | `/` | `default` | `{http://www.w3.org/1999/xhtml}figure`, `{http://www.w3.org/1999/xhtml}video`, `{http://www.w3.org/1999/xhtml}figcaption` |
