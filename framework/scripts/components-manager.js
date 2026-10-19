import { IconResolver } from './icon-resolver.js';
import { loadManifest, mergeDefinition } from './manifest.js';
import { NS, qname } from './xml.js';
import { XSLTPreprocessor } from './xslt-preprocessor.js';
export class ComponentsManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.components = new Map();
        this.icons = new IconResolver(ctx.settings);
    }
    async init() {
        const r = this.ctx.resources, registry = await r.json(r.framework('registry.json'));
        for (const path of registry.components || [])
            await this.register(r.framework(path));
    }
    async register(url, operation = 'add') {
        const m = await loadManifest(this.ctx.resources, url, 'component', ['template', 'renderer']);
        this.components.set(m.id, mergeDefinition(this.components.get(m.id), m, operation));
    }
    async prepare() {
        const r = this.ctx.resources;

        const baseUrl = r.framework('visual/base-component/base-component.xsd');
        this.baseSchema = {
            url: baseUrl,
            content: await r.text(baseUrl),
            namespace: 'urn:coursekit:visual'
        }

        for (const m of this.components.values()) {
            const templateURL = r.relative(m.template, m.manifestUrl);
            m.templateDoc = await new XSLTPreprocessor(r).process(templateURL);
            const mod = await import(r.relative(m.renderer, m.manifestUrl));
            if (typeof mod.default !== 'function')
                throw Error('Renderer must be a default class: ' + m.renderer);
            m.Renderer = mod.default;
            for (const style of m.styles || [])
                await this.ctx.styleLoader.loadUrl(r.relative(style, m.manifestUrl));
            m.behaviors = [];
            for (const script of m.scripts || []) {
                const url = r.relative(script, m.manifestUrl);
                await this.ctx.scriptLoader.loadUrl(url);
                const module = await import(url);
                if (typeof module.set_behaviour === 'function') m.behaviors.push(module.set_behaviour);
            }
        }
    }
    async render(root, variables = new Map())  {
        const instances = [];
        const walk = async (xml, parent = null) => {
            if (xml.nodeType === Node.TEXT_NODE)
                return document.createTextNode(xml.textContent);
            if (xml.nodeType !== Node.ELEMENT_NODE)
                return document.createDocumentFragment();
            if (xml.namespaceURI !== NS.page)
                throw Error('Unexpected visual namespace ' + qname(xml));
            const m = this.components.get(xml.localName);
            if (!m)
                throw Error('No visual component registered: ' + qname(xml));
            const renderer = new m.Renderer({
                xml,
                manifest: m,
                resources: this.ctx.resources,
                settings: this.ctx.settings,
                links: this.ctx.links,
                variables,
                icons: this.icons,
                renderChild: child => walk(child, renderer)
            });
            renderer.parentRenderer = parent;
            if (parent) parent.childRenderers.push(renderer);
            const node = await renderer.render();
            if (!(node instanceof Node))
                throw Error(m.id + ' renderer did not return a Node');

            if (typeof renderer.rendered === 'function') {
                await renderer.rendered();
            }
            
            renderer.componentBehaviors = m.behaviors || [];
            instances.push(renderer);
            return node;
        };
        const node = await walk(root);
        return { node, instances };
    }
}