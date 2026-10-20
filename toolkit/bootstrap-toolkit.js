/** Toolkit bootstrap. All roots are supplied by tools/bootstrap-config.js. */
import { CoursesManager } from './scripts/courses-manager.js';
import { ToolsManager } from './scripts/tools-manager.js';
import { ToolkitManifestValidator } from './scripts/toolkit-manifest-validator.js';
import { createToolkitCourseContext } from './scripts/toolkit-course-context.js';

function readSettings() {
    const script = Array.from(document.scripts).find(node => node.src === import.meta.url);
    if (!script) throw new Error('[Toolkit] Bootstrap module tag not found.');
    const { frameworkRoot, toolkitRoot, toolsRoot, toolkitConfig, courseRoot, courseCatalog } = script.dataset;
    if (!frameworkRoot || !toolkitRoot || !toolsRoot || !toolkitConfig) {
        throw new Error('[Toolkit] Missing bootstrap root or manifest URL.');
    }
    return {
        frameworkRoot: new URL(frameworkRoot),
        toolkitRoot: new URL(toolkitRoot),
        toolsRoot: new URL(toolsRoot),
        toolkitConfig,
        courseRoot: courseRoot || null,
        courseCatalog: courseCatalog || 'courses.json'
    };
}

export async function start() {
    const settings = readSettings();
    const frameworkModule = name => new URL(`scripts/${name}.js`, settings.frameworkRoot).href;
    const [{ ResourceLoader }, { ManifestValidator }, { Ajv2020 }] = await Promise.all([
        import(frameworkModule('resources')),
        import(frameworkModule('manifest-validator')),
        import(new URL('vendor/ajv/ajv2020.js', settings.frameworkRoot).href)
    ]);
    const resources = new ResourceLoader(settings.frameworkRoot, settings.toolsRoot);
    const originalValidator = new ManifestValidator(resources);
    resources.manifestValidator = new ToolkitManifestValidator(
        resources, originalValidator, Ajv2020, settings.toolkitRoot
    );
    const toolkitManifest = await resources.json(settings.toolkitConfig);
    await resources.manifestValidator.validate('toolkit', toolkitManifest, settings.toolkitConfig);
    resources.configure({ siteId: null, customPaths: toolkitManifest.customPaths || {} });

    const toolsManager = new ToolsManager(resources);
    const coursesManager = new CoursesManager(resources, settings.frameworkRoot);
    const courses = await coursesManager.load({
        courseRoot: settings.courseRoot,
        catalog: settings.courseCatalog
    });
    const context = Object.freeze({
        resources, toolsManager, coursesManager, courses, toolkitManifest,
        frameworkRoot: settings.frameworkRoot.href,
        toolkitRoot: settings.toolkitRoot.href,
        toolsRoot: settings.toolsRoot.href,
        loadTools: () => toolsManager.load(toolkitManifest.catalog),
        createCourseContext: (root, path = 'course.json', options = {}) =>
            createToolkitCourseContext(settings.frameworkRoot, new URL(root), path, options)
    });
    document.dispatchEvent(new CustomEvent('coursekit:toolkit-ready', { detail: context }));
    return context;
}

window.CourseKitToolkit = start();
window.CourseKitToolkit.catch(error => {
    console.error('[Toolkit]', error);
    document.dispatchEvent(new CustomEvent('coursekit:toolkit-error', { detail: error }));
    const status = document.getElementById('toolkit-status');
    if (status) status.textContent = `Toolkit error: ${error.message}`;
});
