# Module template

Copy this directory into a course module folder, or publish it as a reusable module.
All manifest paths are relative to `module.json`. Registration happens in `course.json` through its ordered `modules` array.

1. Fill in the `module.json` manifest.
2. Place semantic schemas in the root of this folder.
3. Place visual components in the `components/` subfolder.
4. Register this module in your course's `course.json` under the `"modules"` array.

`semantic` provides semantic component manifests; `schemas` provides additional XSD files; `pages` registers page type manifests; `components` registers visual components; `pageExtensions` contributes public parameters and XSLT to existing pages. `styles` and `scripts` are optional module-wide resources; `dependsOn` lists previously declared module IDs.

The example visual renderer imports CourseKit classes using a relative path shown for a module located in `example-course/modules/`. Adjust the relative imports when installing the module in a different location; the class interface is otherwise identical.