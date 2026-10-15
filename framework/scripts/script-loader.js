/** Loads declared JavaScript resources without interpreting manifests. */
export class ScriptLoader {
    constructor(resources) {
        this.resources = resources;
        this.loaded = new Set();
    }

    async load(urls = []) {
        for (const url of urls) {
            await this.loadUrl(url);
        }
    }

    async loadUrl(url) {
        if (this.loaded.has(url)) return;
        await this.resources.verify(url);
        await import(url);
        this.loaded.add(url);
    }
}
