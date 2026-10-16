import { parseXML } from './xml.js';

const XSL = 'http://www.w3.org/1999/XSL/Transform';
const XSP = 'urn:coursekit:preprocessor';
const XMLNS = 'http://www.w3.org/2000/xmlns/';

const is = (node, ns, local) => node?.nodeType === 1 &&
    node.namespaceURI === ns && node.localName === local;
const children = node => [...node.childNodes].filter(n => n.nodeType === 1);
const key = (match, mode = '') => `${mode}\u0000${match}`;

function defaultPriority(pattern) {
    if (/^(?:@)?\*$|^(?:node|text|comment|processing-instruction)\(\)$/.test(pattern)) return -0.5;
    if (/^(?:@)?[\w.-]+:\*$/.test(pattern)) return -0.25;
    if (/^(?:@)?(?:[\w.-]+:)?[\w.-]+$/.test(pattern)) return 0;
    return 0.5;
}

/** Compile XSLT 1.0 + CourseKit xsp directives into one ordinary XSLT stylesheet.
 * ResourceManager must provide relative(reference, ownerURL) and text(resolvedURL).
 * Symbolic $(frameworkRoot)/$(courseRoot) references are resolved by ResourceManager.
 */
export class XSLTPreprocessor {
    constructor(resources) {
        this.resources = resources;
        this.sequence = 0;
        this.importRank = 0;
        this.entries = [];
        this._namespaces = new Map();
    }

    async process(url, overlays = []) {
        this.sequence = 0;
        this.importRank = 0;
        this.entries = [];
        this._namespaces = new Map();
        await this._collect(url, []);
        for (const overlay of overlays) await this._collect(overlay, []);

        const doc = document.implementation.createDocument(XSL, 'xsl:stylesheet', null);
        const root = doc.documentElement;
        root.setAttribute('version', '1.0');
        for (const [name, uri] of this._namespaces) {
            if (name === 'xmlns') root.setAttributeNS(XMLNS, name, uri);
            else root.setAttributeNS(XMLNS, name, uri);
        }
        // Work on imported copies; never mutate cached source documents.
        const entries = this.entries.map(e => ({...e, node: doc.importNode(e.node, true)}));
        const templates = entries.filter(e => is(e.node, XSL, 'template'));
        const selectTemplate = (match, mode) => {
            const found = templates.filter(e => e.node.getAttribute('match') === match &&
                (e.node.getAttribute('mode') || '') === (mode || ''));
            found.sort((a, b) => b.rank - a.rank || b.order - a.order);
            if (!found.length) throw Error(`XSLT: template not found (${match}, mode=${mode || '(default)'})`);
            return found[0];
        };

        // xsp:extend is a top-level directive. Slots are owned by the matched rule.
        const extensions = entries.filter(e => is(e.node, XSP, 'extend'))
            .sort((a, b) => a.rank - b.rank || a.order - b.order);
        for (const ext of extensions) {
            const match = ext.node.getAttribute('match');
            const mode = ext.node.getAttribute('mode') || '';
            const slotName = ext.node.getAttribute('slot');
            if (!match || !slotName) throw Error('xsp:extend needs match and slot');
            const target = selectTemplate(match, mode).node;
            const slots = [...target.getElementsByTagNameNS(XSP, 'slot')]
                .filter(n => n.getAttribute('name') === slotName);
            if (slots.length !== 1) throw Error(`xsp:extend: expected one slot '${slotName}' on ${match}, found ${slots.length}`);
            for (const child of [...ext.node.childNodes]) slots[0].appendChild(doc.importNode(child, true));
        }

        const generated = [];
        let counter = 0;
        const inheritTemplate = (entry, stack = []) => {
            if (stack.includes(entry)) throw Error('XSLT xsp:inherit cycle');
            for (const inheritor of [...entry.node.getElementsByTagNameNS(XSP, 'inherit')]) {
                const match = inheritor.getAttribute('match');
                const mode = inheritor.hasAttribute('mode')
                    ? inheritor.getAttribute('mode')
                    : (entry.node.getAttribute('mode') || '');
                if (!match) throw Error('xsp:inherit needs match');
                const parent = selectTemplate(match, mode);
                if (parent === entry) throw Error(`xsp:inherit cannot target itself (${match})`);
                inheritTemplate(parent, [...stack, entry]);
                const name = `__ck_inherit_${++counter}`;
                const named = doc.importNode(parent.node, true);
                named.removeAttribute('match');
                named.removeAttribute('mode');
                named.removeAttribute('priority');
                named.setAttribute('name', name);
                generated.push(named);
                const call = doc.createElementNS(XSL, 'xsl:call-template');
                call.setAttribute('name', name);
                inheritor.replaceWith(call);
            }
        };
        for (const entry of templates) inheritTemplate(entry);

        // Slots without extensions collapse to their original XSLT instructions.
        for (const entry of templates) {
            const slots = [...entry.node.getElementsByTagNameNS(XSP, 'slot')];
            for (const slot of slots) slot.replaceWith(...[...slot.childNodes]);
        }
        for (const template of generated) {
            const slots = [...template.getElementsByTagNameNS(XSP, 'slot')];
            for (const slot of slots) slot.replaceWith(...[...slot.childNodes]);
        }

        // Imported rules must lose to later imports and main stylesheet rules.
        // Give each import-precedence tier its own explicit priority band.
        const matched = templates.filter(e => e.node.hasAttribute('match'));
        const priorities = new Map();
        for (const e of matched) {
            const explicit = e.node.getAttribute('priority');
            const value = explicit !== null ? Number(explicit) : defaultPriority(e.node.getAttribute('match'));
            if (!Number.isFinite(value)) throw Error(`Invalid XSLT priority: ${explicit}`);
            e.priorityValue = value;
            if (!priorities.has(e.rank)) priorities.set(e.rank, new Set());
            priorities.get(e.rank).add(value);
        }
        const ranks = [...priorities.keys()].sort((a, b) => a - b);
        const tierStart = new Map();
        let next = 0;
        for (const rank of ranks) {
            const values = [...priorities.get(rank)].sort((a, b) => a - b);
            tierStart.set(rank, {start: next, values});
            next += values.length + 1;
        }
        for (const e of matched) {
            const tier = tierStart.get(e.rank);
            e.node.setAttribute('priority', String(tier.start + tier.values.indexOf(e.priorityValue)));
        }

        // Named templates, globals and keys: later definitions win for identical names.
        const winners = new Map();
        for (const e of entries) {
            const n = e.node;
            if (!['template', 'param', 'variable', 'key'].includes(n.localName) || n.namespaceURI !== XSL) continue;
            if (!n.hasAttribute('name')) continue;
            const k = `${n.localName}:${n.getAttribute('name')}`;
            const prev = winners.get(k);
            if (!prev || e.rank > prev.rank || (e.rank === prev.rank && e.order > prev.order)) winners.set(k, e);
        }
        // Keep a single effective xsl:output (the last/highest precedence wins).
        const outputs = entries.filter(e => is(e.node, XSL, 'output'));
        const winningOutput = outputs.sort((a, b) => b.rank - a.rank || b.order - a.order)[0];
        for (const e of entries) {
            if (is(e.node, XSP, 'extend')) continue;
            if (is(e.node, XSL, 'output') && e !== winningOutput) continue;
            if (e.node.namespaceURI === XSL && e.node.hasAttribute('name') &&
                ['template', 'param', 'variable', 'key'].includes(e.node.localName) &&
                winners.get(`${e.node.localName}:${e.node.getAttribute('name')}`) !== e) continue;
            root.appendChild(e.node);
        }
        for (const node of generated) root.appendChild(node);
        if (doc.getElementsByTagNameNS(XSP, 'inherit').length ||
            doc.getElementsByTagNameNS(XSP, 'slot').length ||
            doc.getElementsByTagNameNS(XSP, 'extend').length)
            throw Error('Unprocessed xsp directive in composed XSLT');
        return doc;
    }

    async _collect(url, stack, includeRank = null) {
        const sourceURL = this.resources.relative(url, stack.at(-1) || url);
        if (stack.includes(sourceURL)) throw Error(`Cyclic XSLT import/include: ${[...stack, sourceURL].join(' -> ')}`);
        const xml = parseXML(await this.resources.text(sourceURL), sourceURL);
        const sourceRoot = xml.documentElement;
        if (!is(sourceRoot, XSL, 'stylesheet') && !is(sourceRoot, XSL, 'transform'))
            throw Error(`Not an XSLT stylesheet: ${sourceURL}`);
        for (const attr of [...sourceRoot.attributes]) {
            if (attr.namespaceURI === XMLNS) {
                const old = this._namespaces.get(attr.name);
                if (old && old !== attr.value) throw Error(`Conflicting XSLT prefix ${attr.name} in ${sourceURL}`);
                this._namespaces.set(attr.name, attr.value);
            }
        }
        const nextStack = [...stack, sourceURL];
        const nodes = children(sourceRoot);
        // All imports have lower precedence than rules from this stylesheet.
        for (const n of nodes.filter(n => is(n, XSL, 'import'))) {
            await this._collect(this._reference(n, sourceURL), nextStack);
        }
        const rank = includeRank ?? ++this.importRank;
        for (const node of nodes) {
            if (is(node, XSL, 'import')) continue;
            if (is(node, XSL, 'include')) {
                await this._collect(this._reference(node, sourceURL), nextStack, rank);
            } else {
                this.entries.push({node, rank, order: ++this.sequence});
            }
        }
    }

    _reference(node, owner) {
        const href = node.getAttribute('href');
        if (!href) throw Error(`Missing XSLT href in ${owner}`);
        const resolved = this.resources.relative(href, owner);
        if (/\$\((?:frameworkRoot|courseRoot)\)/.test(resolved))
            throw Error(`ResourceManager did not resolve XSLT reference: ${href}`);
        return resolved;
    }
}
