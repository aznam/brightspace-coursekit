/**
 * CourseKit Toolkit — ContentCatalog.
 * Enumerates Brightspace topic -> semantic XML mappings without depending on
 * the current Brightspace topic or changing the framework ContentResolver.
 */
export class ContentCatalog {
    constructor(resources, settings) {
        if (!resources || typeof resources.resolve !== 'function' || typeof resources.json !== 'function') {
            throw new TypeError('ContentCatalog requires a configured CourseKit ResourceLoader.');
        }
        if (!settings || typeof settings.variables !== 'function') {
            throw new TypeError('ContentCatalog requires the course ConfigManager.');
        }
        this.resources = resources;
        this.settings = settings;
    }

    async listTable(tablePath, { metadata = true } = {}) {
        if (typeof tablePath !== 'string' || !tablePath.trim()) {
            throw new Error('A content mapping table path is required.');
        }

        // Identical resource resolution policy to ContentResolver.resolveTable().
        const tableUrl = await this.resources.resolve(tablePath.trim(), 'content');
        const mapping = await this.resources.json(tableUrl);
        if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
            throw new Error(`Invalid content mapping table: ${tableUrl}`);
        }

        const entries = Object.entries(mapping);
        for (const [topicId, path] of entries) {
            if (!topicId.trim() || typeof path !== 'string' || !path.trim()) {
                throw new Error(`Invalid content mapping entry for topic "${topicId}" in ${tableUrl}`);
            }
        }

        // Keep table insertion order; do not infer Brightspace's lesson ordering.
        const pages = [];
        for (const [topicId, contentPath] of entries) {
            const contentUrl = await this.resources.resolve(contentPath, 'content');
            const page = { topicId, contentPath, contentUrl };
            if (metadata) page.metadata = await this.readMetadata(contentUrl);
            pages.push(page);
        }
        return { tableUrl, pages };
    }

    async readMetadata(contentUrl) {
        const source = await this.resources.text(contentUrl);
        const documentXML = new DOMParser().parseFromString(source, 'application/xml');
        const parseError = documentXML.getElementsByTagName('parsererror')[0];
        if (parseError) throw new Error(`Invalid XML: ${contentUrl}: ${parseError.textContent}`);
        // Mirror ContentManager.show(): interpolate semantic XML using the
        // course ConfigManager before extracting metadata.
        this.settings.variables(documentXML);
        const root = documentXML.documentElement;
        if (root.namespaceURI !== 'urn:coursekit:semantic' || root.localName !== 'content') {
            throw new Error(`Expected s:content semantic XML: ${contentUrl}`);
        }
        return {
            title: root.getAttribute('title') || '',
            subtitle: root.getAttribute('subtitle') || '',
            pageShortTitle: root.getAttribute('page-short-title') || '',
            desc: root.getAttribute('desc') || '',
            hookTitle: root.getAttribute('hook-title') || '',
            summary: root.getAttribute('summary') || '',
            moduleName: root.getAttribute('module-name') || '',
            pageType: root.getAttribute('page-type') || ''
        };
    }
}
