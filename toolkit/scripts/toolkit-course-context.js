/** Build a CourseKit course context using services loaded from the configured framework root. */
export async function createToolkitCourseContext(frameworkRoot, courseRoot, courseConfig = 'course.json', options = {}) {
    const moduleUrl = name => new URL(`scripts/${name}.js`, frameworkRoot).href;
    const modules = await Promise.all([
        'resources', 'manifest-validator', 'config-manager', 'link-resolver',
        'style-loader', 'script-loader', 'font-loader', 'content-manager',
        'pages-manager', 'components-manager', 'modules-manager'
    ].map(name => import(moduleUrl(name))));
    const [
        { ResourceLoader }, { ManifestValidator }, { ConfigManager }, { LinkResolver },
        { StyleLoader }, { ScriptLoader }, { FontLoader }, { ContentManager },
        { PagesManager }, { ComponentsManager }, { ModulesManager }
    ] = modules;
    const resources = new ResourceLoader(frameworkRoot, courseRoot);
    resources.manifestValidator = new ManifestValidator(resources);
    const settings = new ConfigManager(resources);
    await settings.init(courseConfig); // Schema validation, configure(), JSON path preprocessing.

    const links = new LinkResolver(settings.data);
    const styleLoader = new StyleLoader(resources);
    await styleLoader.initBreakpoints(resources.framework('styles/breakpoints.json'));
    const fontLoader = new FontLoader(resources, styleLoader);
    const scriptLoader = new ScriptLoader(resources);
    const context = { resources, settings, links, styleLoader, fontLoader, scriptLoader };

    // Loading configuration and content metadata requires no page rendering.
    if (options.prepareRendering === true) {
        const content = new ContentManager(context);
        const pages = new PagesManager(context);
        const components = new ComponentsManager(context);
        Object.assign(context, { content, pages, components });
        const modules = new ModulesManager(context, { content, pages, components });
        context.modules = modules;
        await Promise.all([content.init(), pages.init(), components.init()]);
        await modules.init();
        await components.prepare();
        await pages.prepare();
        await content.prepare();
    }

    if (options.loadPresentation === true) {
        const registry = await resources.json(resources.framework('registry.json'));
        const frameworkAssets = registry.resources || {};
        const courseAssets = settings.data.resources || {};
        await styleLoader.load((frameworkAssets.styles || []).map(path => resources.framework(path)));
        await styleLoader.load(await Promise.all((courseAssets.styles || []).map(path => resources.resolve(path, 'styles'))));
        await fontLoader.load(frameworkAssets.fonts || []);
        await fontLoader.load(courseAssets.fonts || settings.data.fonts || []);
        styleLoader.applyTheme(settings.data.theme);
        await scriptLoader.load((frameworkAssets.scripts || []).map(path => resources.framework(path)));
        await scriptLoader.load(await Promise.all((courseAssets.scripts || []).map(path => resources.resolve(path, 'scripts'))));
        if (context.modules) await context.modules.loadResources({ styleLoader, scriptLoader, fontLoader });
    }
    return context;
}
