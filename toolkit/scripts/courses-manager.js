/** Load one configured course or all courses declared by the Toolkit catalogue. */
import { createToolkitCourseContext } from './toolkit-course-context.js';

export class CoursesManager {
    constructor(resources, frameworkRoot) {
        this.resources = resources;
        this.frameworkRoot = frameworkRoot;
        this.courses = [];
    }

    async load({ courseRoot = null, catalog = 'courses.json' } = {}) {
        let roots;
        if (courseRoot) {
            roots = [new URL(courseRoot).href];
        } else {
            const catalogUrl = await this.resources.resolve(catalog, 'content');
            const definition = await this.resources.json(catalogUrl);
            await this.resources.manifestValidator.validate('course-catalog', definition, catalogUrl);
            roots = definition.courses.map(entry =>
                this.resources.relative(entry.root, catalogUrl));
        }

        const seen = new Set();
        const loaded = [];
        for (const root of roots) {
            const normalized = new URL(root.endsWith('/') ? root : `${root}/`).href;
            if (seen.has(normalized)) {
                throw new Error(`[CourseKit Toolkit] Duplicate course root: ${normalized}`);
            }
            seen.add(normalized);
            const context = await createToolkitCourseContext(
                this.frameworkRoot, new URL(normalized), 'course.json');
            loaded.push(context);
        }
        this.courses = loaded;
        return loaded;
    }
}
