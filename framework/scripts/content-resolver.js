import { BrightspaceContext } from './brightspace-context.js';

/** Resolve a semantic content path, optionally through a Brightspace topic mapping. */
export class ContentResolver {
    constructor(resources) {
        this.resources = resources;
    }

    async resolve({ content, table } = {}) {
        if (table) {
            try {
                return await this.resolveTable(table);
            } catch (error) {
                if (!content) throw error;
                console.warn('[CourseKit] Dynamic content resolution failed; using data-content fallback.', error);
            }
        }
        if (content) return content; // Preserve the existing static loading behavior.
        throw new Error('[CourseKit] Missing data-content or data-table on bootstrap-config.js script.');
    }

    async resolveTable(tablePath) {
        // No fixed folder: use the ResourceLoader's normal candidate hierarchy.
        const tableUrl = await this.resources.resolve(tablePath, 'content');
        const mapping = await this.resources.json(tableUrl);
        if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
            throw new Error(`[CourseKit] Invalid content mapping: ${tableUrl}`);
        }
        const topic = BrightspaceContext.currentTopic();
        if (!topic?.id) {
            throw new Error('[CourseKit] Cannot identify the current Brightspace topic.');
        }
        const path = Object.hasOwn(mapping, topic.id) ? mapping[topic.id] : undefined;
        if (typeof path !== 'string' || !path.trim()) {
            throw new Error(`[CourseKit] No content mapping for Brightspace topic ${topic.id}.`);
        }
        // Resolve the XML location with the same hierarchy as any other resource.
        return this.resources.resolve(path, 'content');
    }
}
