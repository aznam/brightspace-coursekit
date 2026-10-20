/**
 * CourseKit Toolkit — static HTML snippet exporter.
 *
 * Export a preview already rendered in the document. CourseKit styles may use
 * functions while rendering; the serialized Brightspace fragment may not.
 */
export class SnippetExporter {
    static allowedTags = new Set(['DIV', 'A', 'SPAN', 'P', 'STRONG', 'EM', 'B', 'I']);

    /** Convert a browser-resolved rgb()/rgba() color to literal hexadecimal. */
    static literalColors(value) {
        return value.replace(/rgba?\([^()]*\)/gi, (expression) => {
            const inner = expression.slice(expression.indexOf('(') + 1, -1).trim();
            // Both CSS legacy comma syntax and modern space/slash syntax.
            const parts = inner.includes(',')
                ? inner.split(',').map(part => part.trim())
                : inner.split(/[\s/]+/).filter(Boolean);
            if (parts.length !== 3 && parts.length !== 4) {
                throw new Error(`Cannot convert color to a literal: ${expression}`);
            }
            const byte = (part) => {
                const percent = part.endsWith('%');
                const numeric = Number.parseFloat(part);
                if (!Number.isFinite(numeric)) throw new Error(`Invalid color channel: ${part}`);
                return Math.round(Math.max(0, Math.min(255, percent ? numeric * 2.55 : numeric)));
            };
            const hex = (value) => value.toString(16).padStart(2, '0');
            const channels = parts.slice(0, 3).map(byte);
            let alpha = '';
            if (parts.length === 4) {
                const a = parts[3];
                const numeric = Number.parseFloat(a);
                if (!Number.isFinite(numeric)) throw new Error(`Invalid color opacity: ${a}`);
                const normalized = a.endsWith('%') ? numeric / 100 : numeric;
                alpha = hex(Math.round(Math.max(0, Math.min(1, normalized)) * 255));
            }
            return `#${channels.map(hex).join('')}${alpha}`;
        });
    }

    /** Resolve CSS functions using the actual, styled preview element. */
    static normalizeStyles(source, destination) {
        const serialized = [];
        const computed = window.getComputedStyle(source);

        for (let index = 0; index < source.style.length; index++) {
            const property = source.style.item(index);
            if (property.startsWith('--')) continue;
            let value = source.style.getPropertyValue(property).trim();
            if (/[(){}<>@]/.test(value)) {
                // getComputedStyle resolves var(), calc(), hsl() and related
                // expressions, subject to actual browser style evaluation.
                value = computed.getPropertyValue(property).trim();
            }
            value = this.literalColors(value);
            if (!value || /[(){}<>@]/.test(value)) {
                throw new Error(`Cannot export CSS property ${property} as a literal: ${value || '(empty)'}`);
            }
            serialized.push(`${property}:${value}${source.style.getPropertyPriority(property) ? ' !important' : ''}`);
        }
        if (!serialized.length) {
            throw new Error(`Element ${source.tagName.toLowerCase()} has no inline style.`);
        }
        destination.setAttribute('style', `${serialized.join(';')};`);
    }

    /** Serialize a <div> root containing static, function-free inline CSS. */
    export(root) {
        if (!(root instanceof Element) || root.tagName !== 'DIV') {
            throw new Error('Snippet root must be a div element.');
        }
        if (!root.isConnected) {
            throw new Error('Render the preview in the document before exporting.');
        }
        const copy = root.cloneNode(true);
        const originals = [root, ...root.querySelectorAll('*')];
        const clones = [copy, ...copy.querySelectorAll('*')];

        for (let index = 0; index < originals.length; index++) {
            const source = originals[index];
            const element = clones[index];
            if (!SnippetExporter.allowedTags.has(source.tagName)) {
                throw new Error(`Unsupported snippet element: ${source.tagName.toLowerCase()}`);
            }
            for (const attribute of [...element.attributes]) {
                if (!['style', 'href', 'target', 'rel'].includes(attribute.name.toLowerCase())) {
                    element.removeAttribute(attribute.name);
                }
            }
            SnippetExporter.normalizeStyles(source, element);

            if (element.tagName === 'A') {
                const href = element.getAttribute('href') || '';
                if (!/^\/d2l\/le\/lessons\/(?:[0-9]+\/)?topics\/[0-9]+$/.test(href)) {
                    throw new Error(`Invalid Brightspace topic URL: ${href}`);
                }
                element.setAttribute('target', '_top');
                element.setAttribute('rel', 'noopener');
            } else {
                element.removeAttribute('href');
                element.removeAttribute('target');
                element.removeAttribute('rel');
            }
        }

        const html = copy.outerHTML;
        if (/<\s*(?:script|style|link)\b|\son[a-z]+\s*=|\b(?:javascript|data):/i.test(html)) {
            throw new Error('The snippet contains unsupported active content.');
        }
        return html;
    }
}
