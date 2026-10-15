/** CourseKit link targets: local, Brightspace, or external. */
export class LinkResolver {
    constructor(config = {}, baseURI = document.baseURI) {
        this.baseURI = baseURI;
        this.origins = new Set([
            new URL(baseURI).origin,
            ...((config.links?.brightspaceOrigins || []).map(value => new URL(value, baseURI).origin))
        ]);
        this.extraOrigins = new Set((config.links?.brightspaceOrigins || []).map(value => new URL(value, baseURI).origin));
    }
    classify(href) {
        if (!href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:)/i.test(href)) {
            return 'local';
        }
        const url = new URL(href, this.baseURI);
        if (this.origins.has(url.origin) && (url.pathname.startsWith('/content/enforced/') ||
            url.pathname.startsWith('/d2l/') ||
            this.extraOrigins.has(url.origin))) {
            return 'brightspace';
        }
        return 'external';
    }
    apply(anchor, explicitTarget = null) {
        if (explicitTarget) {
            anchor.target = explicitTarget;
        }
        else {
            const kind = this.classify(anchor.getAttribute('href'));
            if (kind !== 'local') {
                anchor.target = kind === 'brightspace' ? '_top' : '_blank';
            }
        }
        if (anchor.target === '_blank') {
            anchor.rel = 'noopener noreferrer';
        }
        return anchor;
    }
}
