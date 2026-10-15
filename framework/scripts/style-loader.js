/** Loads stylesheet resources and applies course-level CSS theme variables. */
export class StyleLoader {
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

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
        this.loaded.add(url);
    }

    applyTheme(theme = {}) {
        for (const [name, value] of Object.entries(theme.palette || {})) {
            document.documentElement.style.setProperty(`--ck-${name}`, String(value));
        }

        if (theme.fontFamily) {
            document.documentElement.style.setProperty('--ck-font-family', theme.fontFamily);
        }
    }
}
