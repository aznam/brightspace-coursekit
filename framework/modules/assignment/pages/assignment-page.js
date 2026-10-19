/** Load assignment metadata before the page XSLT transformation. */
export async function preLoad({ settings, resources, params, content }) {
    const path = params['assignment-ref'];
    if (!path) {
        throw new Error('assignment-page requires s:content/@assignment-ref');
    }

    const url = resources.expand(path);
    const assignment = await resources.json(url);

    // Reloading an assignment page replaces its previous runtime namespace.
    settings.unregister('assignment');
    settings.registerNamespace('assignment', assignment);

    // Make LO entries available to the page XSLT before transformation.
    const outcomes = assignment.learningOutcomes || [];
    const catalog = settings.data.learningOutcomes || [];
    for (const code of outcomes) {
        const entry = catalog.find(item => item.code === code || item.id === code);
        if (!entry) {
            throw new Error(`Unknown learning outcome: ${code}`);
        }

        const node = content.createElementNS('urn:coursekit:semantic', 's:assignment-outcome');
        node.setAttribute('code', code);
        node.setAttribute('description', entry.description ?? entry.label ?? entry.title ?? '');
        content.documentElement.append(node);
    }
}
