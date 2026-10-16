/**
 * CourseKit entry point.
 * Initializes the managers and delegates page rendering to ContentManager.
 * Deployment paths are supplied by bootstrap-config.js through the loader script.
 */
import { ConfigManager } from './scripts/config-manager.js';
import { ContentManager } from './scripts/content-manager.js';
import { PagesManager } from './scripts/pages-manager.js';
import { ComponentsManager } from './scripts/components-manager.js';
import { ModulesManager } from './scripts/modules-manager.js';
import { ResourceLoader } from './scripts/resources.js';
import { ContentResolver } from './scripts/content-resolver.js';
import { ManifestValidator } from './scripts/manifest-validator.js';
import { LinkResolver } from './scripts/link-resolver.js';
import { FontLoader } from './scripts/font-loader.js';
import { StyleLoader } from './scripts/style-loader.js';
import { ScriptLoader } from './scripts/script-loader.js';
function readBootstrapSettings() {
    const bootstrapURL = import.meta.url;
    const loader = Array.from(document.scripts).find(script => script.src === bootstrapURL);
    if (!loader) {
        throw new Error('[CourseKit] Bootstrap loader script not found.');
    }
    const { courseRoot, courseConfig, content, table } = loader.dataset;
    if (!courseRoot || !courseConfig) {
        throw new Error('[CourseKit] Missing courseRoot or courseConfig.');
    }
    return {
        frameworkRoot: new URL('.', bootstrapURL),
        courseRoot: new URL(courseRoot),
        courseConfig,
        content,
        table
    };
}
export async function start() {
    const config = readBootstrapSettings();
    const resources = new ResourceLoader(config.frameworkRoot, config.courseRoot);
    resources.manifestValidator = new ManifestValidator(resources);
    const settings = new ConfigManager(resources);
    await settings.init(config.courseConfig);
    const links = new LinkResolver(settings.data);
    const styleLoader = new StyleLoader(resources);
    const fontLoader = new FontLoader(resources, styleLoader);
    const scriptLoader = new ScriptLoader(resources);
    const context = { resources, settings, links, styleLoader, scriptLoader };
    const content = new ContentManager(context);
    const pages = new PagesManager(context);
    const components = new ComponentsManager(context);
    context.content = content;
    context.pages = pages;
    context.components = components;
    const modules = new ModulesManager(context, { content, pages, components });
    await Promise.all([
        content.init(),
        pages.init(),
        components.init()
    ]);
    await modules.init();
    await components.prepare();
    await pages.prepare();
    await content.prepare();
    // Resource declarations are owned by the framework registry and course config.
    // ConfigManager only exposes configuration; specialized loaders perform the work.
    const registry = await resources.json(resources.framework('registry.json'));
    const frameworkResources = registry.resources || {};
    const courseResources = settings.data.resources || {};

    await styleLoader.load((frameworkResources.styles || []).map(path => resources.framework(path)));
    await styleLoader.load(await Promise.all(
        (courseResources.styles || []).map(path => resources.resolve(path, 'styles'))
    ));
    await fontLoader.load(frameworkResources.fonts || []);
    await fontLoader.load(courseResources.fonts || settings.data.fonts || []);
    styleLoader.applyTheme(settings.data.theme);
    await scriptLoader.load((frameworkResources.scripts || []).map(path => resources.framework(path)));
    await scriptLoader.load(await Promise.all(
        (courseResources.scripts || []).map(path => resources.resolve(path, 'scripts'))
    ));
    await modules.loadResources({ styleLoader, scriptLoader, fontLoader });
    const contentPath = await new ContentResolver(resources).resolve({
        content: config.content,
        table: config.table
    });
    await content.show(contentPath, { pages, components });
    return { settings, content, pages, components, modules };
}
start().catch(error => {
    console.error('[CourseKit]', error);
    const target = document.getElementById('coursekit-root') || document.body;
    const pre = document.createElement('pre');
    pre.textContent = 'CourseKit: ' + error.message;
    target.appendChild(pre);
});
