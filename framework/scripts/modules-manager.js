import { loadManifest } from './manifest.js';
/** Registers module contributions in course.json order; the last explicit override wins. */
export class ModulesManager {
    constructor(context, managers) {
        this.ctx = context;
        this.managers = managers;
        this.modules = [];
    }
    async init() {
        const resources = this.ctx.resources;
        const declarations = this.ctx.settings.data.modules || [];
        const loaded = new Set();
        for (const path of declarations) {
            const moduleURL = resources.course(path);
            const module = await loadManifest(resources, moduleURL, 'module');
            for (const dependency of module.dependsOn || []) {
                if (!loaded.has(dependency)) {
                    throw new Error(`Module ${module.id} requires a previously loaded module: ${dependency}`);
                }
            }
            if (loaded.has(module.id)) {
                throw new Error(`Duplicate module id: ${module.id}`);
            }
            if ((module.rootScheme === undefined) !== (module.rootElement === undefined)) {
                throw new Error(`Module ${module.id} must declare rootScheme and rootElement together.`);
            }
            if (module.rootScheme) {
                await this.managers.content.registerRoot({
                    ...module.rootElement,
                    schema: resources.relative(module.rootScheme, module.manifestUrl),
                    owner: module.id
                });
            }
            // Verify module resources at initialization; loading belongs to the loaders.
            for (const resource of [
                ...(module.styles || []),
                ...(module.resources?.styles || []),
                ...(module.scripts || []),
                ...(module.resources?.scripts || [])
            ]) {
                await resources.verify(resources.relative(resource, module.manifestUrl));
            }
            for (const font of module.resources?.fonts || []) {
                if (font.source === 'local') {
                    for (const file of font.files || (font.src ? [{ file: font.src }] : [])) {
                        const url = font.location
                            ? await resources.asset(file.file, 'fonts', font.location)
                            : resources.relative(file.file, module.manifestUrl);
                        await resources.verify(url);
                    }
                }
            }
            // Independent semantic schemas are registered as semantic contracts.
            for (const item of [...(module.semantic || []), ...(module.schemas || [])]) {
                if (typeof item === 'string' && item.endsWith('.xsd')) {
                    await this.managers.content.registerSchema(resources.relative(item, module.manifestUrl), module.id);
                }
                else {
                    const reference = typeof item === 'string' ? item : item.manifest;
                    await this.managers.content.register(resources.relative(reference, module.manifestUrl));
                }
            }
            for (const item of module.pages || []) {
                const reference = typeof item === 'string' ? item : item.manifest;
                await this.managers.pages.register(resources.relative(reference, module.manifestUrl), typeof item === 'string' ? 'add' : (item.operation || 'add'));
            }
            for (const item of module.components || []) {
                const reference = typeof item === 'string' ? item : item.manifest;
                await this.managers.components.register(resources.relative(reference, module.manifestUrl), typeof item === 'string' ? 'add' : (item.operation || 'add'));
            }
            for (const extension of module.pageExtensions || []) {
                // Register an independently selectable page; never mutate its base.
                const overlay = extension.transform
                    ? resources.relative(extension.transform, module.manifestUrl)
                    : null;
                if (overlay) await resources.verify(overlay);
                this.managers.pages.registerExtension({
                    ...extension,
                    transform: overlay
                });
            }
            loaded.add(module.id);
            this.modules.push(module);
        }
    }

    async loadResources({ styleLoader, scriptLoader, fontLoader }) {
        const resources = this.ctx.resources;
        for (const module of this.modules) {
            await styleLoader.load([
                ...(module.styles || []),
                ...(module.resources?.styles || [])
            ].map(path => resources.relative(path, module.manifestUrl)));
            await fontLoader.load(module.resources?.fonts || [], module.manifestUrl);
            await scriptLoader.load([
                ...(module.scripts || []),
                ...(module.resources?.scripts || [])
            ].map(path => resources.relative(path, module.manifestUrl)));
        }
    }

}