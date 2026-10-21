/** Discover Brightspace Lessons navigation in accessible ancestor documents. */
export class BrightspaceContext {
    static *accessibleDocuments() {
        let frame = window;
        const visited = new Set();
        while (frame && !visited.has(frame)) {
            visited.add(frame);
            try {
                yield frame.document;
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'SecurityError')) throw error;
            }
            if (frame === frame.parent) break;
            frame = frame.parent;
        }
    }

    /** Iterate light DOM, open shadow roots, and assigned slot elements in document order. */
    static *descendants(root, seen = new Set()) {
        if (!root || seen.has(root)) return;
        seen.add(root);
        if (root.nodeType === 1) yield root;
        if (root.shadowRoot) yield* this.descendants(root.shadowRoot, seen);
        if (root.localName === 'slot' && typeof root.assignedElements === 'function') {
            for (const assigned of root.assignedElements({ flatten: true })) {
                yield* this.descendants(assigned, seen);
            }
        }
        for (const child of root.children || []) yield* this.descendants(child, seen);
    }

    static findCurrentItem(root) {
        for (const node of this.descendants(root)) {
            if (node.matches?.('d2l-list-item-nav[current]')) return node;
        }
        return null;
    }

    static currentTopic() {
        for (const doc of this.accessibleDocuments()) {
            const active = this.findCurrentItem(doc);
            if (active) return {
                id: active.getAttribute('key'),
                label: active.getAttribute('label'),
                href: active.getAttribute('action-href')
            };
        }
        return null;
    }

    /**
     * Discover navigable Lessons modules with immediate child topics.
     * The existing navigation DOM is used, never the Brightspace REST API.
     * Parentage comes from nesting where available, otherwise from explicit
     * depth/aria-level metadata. Never infer a module solely by its position.
     */
    static contentModules() {
        for (const doc of this.accessibleDocuments()) {
            const nodes = [...this.descendants(doc)]
                .filter(node => node.matches?.('d2l-list-item-nav'));
            if (!nodes.length) continue;
            const items = nodes.map(node => ({
                node,
                id: String(node.getAttribute('key') || ''),
                title: String(node.getAttribute('label') || '').trim(),
                href: node.getAttribute('action-href') || '',
                level: this.navigationLevel(node)
            }));
            const groups = [];
            const dedup = new Set();
            for (let i = 0; i < items.length; i++) {
                const parent = items[i];
                const children = [];
                for (let j = i + 1; j < items.length; j++) {
                    const child = items[j];
                    const isNested = this.isComposedAncestor(parent.node, child.node);
                    const depthKnown = parent.level != null && child.level != null;
                    if (!isNested && (!depthKnown || child.level <= parent.level)) break;
                    if (isNested || (depthKnown && child.level === parent.level + 1)) {
                        const id = this.topicId(child);
                        if (id && child.title) children.push({ title: child.title, contentId: id });
                    }
                }
                if (!children.length) continue;
                const identity = parent.id || parent.href || `${parent.title}-${i}`;
                if (dedup.has(identity)) continue;
                dedup.add(identity);
                groups.push({ id: identity, title: parent.title || 'Untitled module', pages: children });
            }
            if (groups.length) return groups;
        }
        return [];
    }

    static navigationLevel(node) {
        let current = node;
        for (let index = 0; current && index < 5; index++) {
            for (const attribute of ['aria-level', 'data-depth', 'data-level', 'depth', 'level']) {
                const value = current.getAttribute?.(attribute);
                if (value != null && /^\d+$/.test(value)) return Number(value);
            }
            current = current.parentElement || current.getRootNode?.().host;
        }
        return null;
    }

    static isComposedAncestor(ancestor, node) {
        let current = node.parentNode || node.getRootNode?.().host;
        while (current) {
            if (current === ancestor) return true;
            current = current.parentNode || current.host || null;
        }
        return false;
    }

    static topicId(item) {
        const match = /\/topics\/(\d+)(?:[/?#]|$)/.exec(item.href);
        if (match) return match[1];
        return /^\d+$/.test(item.id) && item.href.includes('/topics/') ? item.id : null;
    }
}
