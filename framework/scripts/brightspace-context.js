/** Detect the current Brightspace Lessons topic from accessible parent documents. */
export class BrightspaceContext {
    static currentTopic() {
        let frame = window;
        const visited = new Set();

        while (frame && !visited.has(frame)) {
            visited.add(frame);
            try {
                const active = this.findCurrentItem(frame.document);
                if (active) {
                    return {
                        id: active.getAttribute('key'),
                        label: active.getAttribute('label'),
                        href: active.getAttribute('action-href')
                    };
                }
            } catch (error) {
                // Cross-origin/sandboxed ancestors cannot be inspected.
                if (!(error instanceof DOMException && error.name === 'SecurityError')) {
                    throw error;
                }
            }
            if (frame === frame.parent) break;
            frame = frame.parent;
        }
        return null;
    }

    static findCurrentItem(root) {
        // Look for the current item itself, not an ancestor with _child-current.
        const direct = root.querySelector('d2l-list-item-nav[current]');
        if (direct) return direct;
        for (const element of root.querySelectorAll('*')) {
            if (!element.shadowRoot) continue;
            const found = this.findCurrentItem(element.shadowRoot);
            if (found) return found;
        }
        return null;
    }
}
