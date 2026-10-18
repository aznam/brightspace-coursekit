import { parseXML, serialize, NS } from './xml.js';
import { compileXSD } from './xsd.js';
import { XSDPreprocessor } from './xsd-preprocessor.js';
import { loadManifest } from './manifest.js';
export class ContentManager {
    constructor(context) {
        this.ctx = context;
        this.schemas = [];
        this.validator = null;
        this.behaviors = [];
    }
    async init() {
        const r = this.ctx.resources, registry = await r.json(r.framework('registry.json'));
        this.registry = registry;
        for (const item of registry.semantic || [])
            await this.register(r.framework(item));
    }
    async register(url) {
        const r = this.ctx.resources, m = await loadManifest(r, url, 'semantic', ['schema']);
        this.schemas.push(m);
    }
    async registerSchema(url, moduleId) {
        const resources = this.ctx.resources;
        await resources.verify(url);
        this.schemas.push({
            id: `schema:${moduleId}:${this.schemas.length}`,
            schema: url,
            manifestUrl: url,
            directSchemaURL: url
        });
    }
    async prepare() {
        const files = {}, nsMap = new Map(), r = this.ctx.resources;
        const preprocessor = new XSDPreprocessor(r);

        for (const m of this.schemas) {
            const url = m.directSchemaURL || r.relative(m.schema, m.manifestUrl);
            m.schemaKey = r.virtualKey(url);
            const xsd = await r.text(url);
            const doc = parseXML(xsd, m.schema);
            const ns = doc.documentElement.getAttribute('targetNamespace');
            if (!nsMap.has(ns)) nsMap.set(ns, []);
            nsMap.get(ns).push(m);

            preprocessor.addSchema(m.schemaKey, doc, ns, url);
        }
        const processedSchemas = preprocessor.processAll();

        for (const [filename, xsdString] of Object.entries(processedSchemas)) {
            files[filename] = xsdString;
        }

        // Entry schema imports only the semantic declarations actually registered.
        const root = this.schemas.find(m => m.id === 'content');
        if (!root)
            throw Error('No semantic content contract');

        const rootXML = parseXML(files[root.schemaKey]);
        const schema = rootXML.documentElement;


        for (const [ns, manifests] of nsMap) {
            if (ns === schema.getAttribute('targetNamespace')) {
                for (const m of manifests) {
                    if (m.schemaKey !== root.schemaKey) {
                        const inc = rootXML.createElementNS(NS.xs, 'xs:include');
                        inc.setAttribute('schemaLocation', r.virtualRelative(root.schemaKey, m.schemaKey));
                        // On insère l'include au début du schéma
                        schema.insertBefore(inc, schema.firstChild);
                    }
                }
                continue;
            }

            const virtualSchemaName = `__generated__/virtual_master_${ns.replace(/[^a-zA-Z0-9]/g, '_')}.xsd`;
            const virtualSchemaDoc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
            const vSchema = virtualSchemaDoc.documentElement;
            vSchema.setAttribute('targetNamespace', ns);
            vSchema.setAttribute('elementFormDefault', 'qualified');
            
            for (const m of manifests) {
                const inc = virtualSchemaDoc.createElementNS(NS.xs, 'xs:include');
                inc.setAttribute('schemaLocation', r.virtualRelative(virtualSchemaName, m.schemaKey));
                vSchema.appendChild(inc);
            }
            
            files[virtualSchemaName] = serialize(virtualSchemaDoc);

            const imp = rootXML.createElementNS(NS.xs, 'xs:import');
            imp.setAttribute('namespace', ns);
            imp.setAttribute('schemaLocation', r.virtualRelative(root.schemaKey, virtualSchemaName));
            schema.insertBefore(imp, schema.firstChild);
        }

        files[root.schemaKey] = serialize(rootXML);
        this.validator = await compileXSD(root.schemaKey, files);
    }
    async show(path, { pages, components }) {
        const url = await this.ctx.resources.resolve(path, 'content');
        const source = await this.ctx.resources.text(url);
        const xml = parseXML(source, url);
        this.ctx.settings.variables(xml);
        await this.validator.validate(serialize(xml)); // Content XML's page params are admitted via anyAttribute, validated by PagesManager.
        const pageXML = await pages.render(xml);
        const pageRoot = pageXML.documentElement;

        const meta = [...pageRoot.children].find(
            child => child.namespaceURI === NS.page &&
                    child.localName === 'meta'
        );

        const variables = new Map(
            [...meta.children]
                .filter(child => child.namespaceURI === NS.page &&
                                child.localName === 'var')
                .map(child => [
                    child.getAttribute('name'),
                    child.getAttribute('value')
                ])
        );

        const visualRoot = [...pageRoot.children].find(
            child => child.namespaceURI === NS.page &&
                    child.localName !== 'meta'
        );

        if (!visualRoot) {
            throw Error('Page contains no visual root component');
        }

        const { node, instances } = await components.render(
            visualRoot,
            variables
        );

        const courseCode = this.ctx.settings.get('course.code');
        const courseTitle = this.ctx.settings.get('course.title');
        const pageTitle = xml.documentElement.getAttribute('page-title') || xml.documentElement.getAttribute('title');
        
        const titleParts = [];
        if (courseCode) titleParts.push(courseCode);
        
        if (pageTitle) {
            titleParts.push(pageTitle);
        } else if (courseTitle) {
            titleParts.push(courseTitle);
        }
        
        if (titleParts.length > 0) {
            document.title = titleParts.join(' - ');
        }
        
        const mount = document.getElementById('coursekit-root') || document.body;
        for (const dispose of this.disposers || []) dispose?.();
        this.disposers = [];

        mount.replaceChildren(node);

        for (const renderer of instances) {
            if (typeof renderer.mounted === 'function') {
                await renderer.mounted();
            }
            /*for (const behavior of renderer.componentBehaviors || []) {
                const dispose = await behavior(renderer.element, renderer.xml);
                if (typeof dispose === 'function') this.disposers.push(dispose);
            }*/
           if (typeof renderer.setBehavior === 'function') {
                const dispose = await renderer.setBehavior();
                if (typeof dispose === 'function') this.disposers.push(dispose);
            }
        }

        // Post-initialization message phase: every component is mounted,
        // and all behaviors have been attached before any messages are sent.
        // Preserve the existing renderer order (descendants before ancestors).
        for (const renderer of instances) {
            await renderer.postMounted();
        }

        const pageType = xml.documentElement.getAttribute('page-type');
        const pageManifest = pages.pages.get(pageType);
        
        if (pageManifest && pageManifest.behaviors) {
            for (const pageBehavior of pageManifest.behaviors) {
                const dispose = await pageBehavior(mount, xml);
                if (typeof dispose === 'function') this.disposers.push(dispose);
            }
        }
        return mount;
    }
}
