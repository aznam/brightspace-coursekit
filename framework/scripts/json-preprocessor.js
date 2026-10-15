/** Expands explicitly root-qualified resource references in JSON manifests. */
export class JSONPreprocessor {
    constructor(resources) { this.resources = resources; }

    process(value, sourceURL) {
        const visit = (node) => {
            if (typeof node === 'string') {
                return /^\$\((frameworkRoot|courseRoot)\)(?:\/|$)/.test(node)
                    ? this.resources.expand(node, sourceURL)
                    : node;
            }
            if (Array.isArray(node)) return node.map(visit);
            if (node && typeof node === 'object') {
                return Object.fromEntries(Object.entries(node).map(([key, val]) =>
                    [key, visit(val)]));
            }
            return node;
        };
        return visit(value);
    }
}
