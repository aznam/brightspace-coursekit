/** Toolkit catalogue and tool manifests; all paths use ResourceLoader. */
export class ToolsManager {
    constructor(resources) {
        this.resources = resources;
    }

    async load(catalogPath) {
        const catalogUrl = await this.resources.resolve(catalogPath, 'content');
        const catalog = await this.resources.json(catalogUrl);
        await this.resources.manifestValidator.validate('tool-catalog', catalog, catalogUrl);
        const tools = [];
        const ids = new Set();
        for (const reference of catalog.tools) {
            const manifestUrl = this.resources.relative(reference, catalogUrl);
            const manifest = await this.resources.json(manifestUrl);
            await this.resources.manifestValidator.validate('tool', manifest, manifestUrl);
            if (ids.has(manifest.id)) throw new Error(`Duplicate toolkit tool: ${manifest.id}`);
            ids.add(manifest.id);
            const expectedCategory = new URL(manifestUrl).pathname.includes('/deployed/') ? 'deployed'
                : new URL(manifestUrl).pathname.includes('/local/') ? 'local' : null;
            if (expectedCategory !== manifest.category) {
                throw new Error(`Tool ${manifest.id}: category and manifest directory do not match`);
            }
            const entryUrl = this.resources.relative(manifest.entry, manifestUrl);
            await this.resources.verify(entryUrl);
            tools.push(Object.freeze({ ...manifest, manifestUrl, entryUrl }));
        }
        return tools;
    }
}
