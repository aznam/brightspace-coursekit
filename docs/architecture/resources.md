# Resource paths and virtual files

`ResourceLoader` accepts two explicit roots supplied by the bootstrap: `frameworkRoot` and `courseRoot`. `siteId` does not change `courseRoot`.

Preferred references in manifests and XML schemas:

```text
$(frameworkRoot)/pages/course-page/transform.xslt
$(frameworkRoot)/semantic/core/core.xsd
$(courseRoot)/modules/learning/module.json
```

`expand(reference, base)` resolves root placeholders or legacy relative paths to a URL. Root placeholders must appear at the beginning of a reference. `virtualKey(url)` produces stable identities such as `framework/pages/course-page/course-page.xsd` and `course/modules/learning/...`. `virtualRelative(from, to)` computes relative references for the compilation VFS, preserving directory structure. `createVirtualFS()` creates isolated workspaces with duplicate-key checks.

`JSONPreprocessor` expands root-qualified strings in JSON; `XSDPreprocessor` converts includes/imports to paths inside the Xerces VFS. `XSLTPreprocessor` resolves imported/included stylesheets via the same `ResourceLoader` URL rules.

Resource directories (`assets`, `attachments`, `content`, `styles`, `scripts`, `fonts`, `schemas`) can be configured with `customPaths` in `course.json`. Manifest paths should be root-qualified for portability.

**Do not confuse URLs with virtual keys:** `$(frameworkRoot)` is an authoring reference; `framework/...` is an internal VFS identity; the compiler may receive VFS-relative `schemaLocation`s.
