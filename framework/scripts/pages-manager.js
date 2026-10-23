import { parseXML, serialize, transform, NS } from './xml.js';
import { compileXSD } from './xsd.js';
import { loadManifest, mergeDefinition } from './manifest.js';
import { XSDPreprocessor } from './xsd-preprocessor.js'; // Import du pré-processeur
import { XSLTPreprocessor } from './xslt-preprocessor.js';

function diagnoseXSD(entry, files) {
    console.log('🔍 Diagnostic XSD VFS - Entrée :', entry);
    const fileKeys = Object.keys(files);
    
    let missing = [];
    
    fileKeys.forEach(filename => {
        const doc = new DOMParser().parseFromString(files[filename], 'application/xml');
        const imports = [
            ...doc.getElementsByTagNameNS('http://www.w3.org/2001/XMLSchema', 'include'), 
            ...doc.getElementsByTagNameNS('http://www.w3.org/2001/XMLSchema', 'import')
        ];
        
        imports.forEach(node => {
            const loc = node.getAttribute('schemaLocation');
            if (loc && !files[loc]) {
                missing.push(`-> Dans le fichier [${filename}], le lien schemaLocation="${loc}" pointe vers le vide.`);
            }
        });
    });
    
    if (missing.length > 0) {
        console.error('❌ ERREUR VFS : Voici exactement ce qu\'il manque en mémoire :');
        missing.forEach(err => console.error(err));
    } else {
        console.log('✅ VFS XSD OK. Tous les liens sont valides.');
    }
}

export class PagesManager {
    constructor(context) {
        this.ctx = context;
        this.pages = new Map();
    }

    async init() {
        const r = this.ctx.resources, registry = await r.json(r.framework('registry.json'));
        for (const item of registry.pages || [])
            await this.register(r.framework(item));
    }

    async register(url, operation = 'add') {
        const m = await loadManifest(this.ctx.resources, url, 'page', ['schema', 'transform']);
        const previous = this.pages.get(m.id);
        this.pages.set(m.id, mergeDefinition(previous, m, operation));
    }

    registerExtension(extension) {
        const parent = this.pages.get(extension.page);
        if (!parent) throw Error(`Unknown page extension target: ${extension.page}`);
        const id = extension.id;
        if (!id || typeof id !== 'string')
            throw Error(`Page extension of ${extension.page} requires an explicit id`);
        if (id === parent.id || this.pages.has(id))
            throw Error(`Duplicate page definition: ${id}`);
        if (!extension.transform)
            throw Error(`Page extension ${id} requires a transform`);

        this.pages.set(id, {
            ...parent,
            id,
            basePage: parent.id,
            parameters: { ...(parent.parameters || {}), ...(extension.parameters || {}) },
            styles: [...(parent.styles || [])],
            scripts: [...(parent.scripts || [])],
            overlays: [...(parent.overlays || []), extension.transform],
            transformDoc: null,
            transformPromise: null
        });
    }

    async prepare() {
        const r = this.ctx.resources;
        const files = {};
        const preprocessor = new XSDPreprocessor(r);
        const componentSchemas = [];

        const base = this.ctx.components.baseSchema;
        if (base) {
            const key = r.virtualKey(base.url);
            preprocessor.addSchema(key, parseXML(base.content, base.filename), base.namespace, base.url);
        }
        
        for (const m of this.ctx.components.components.values()) {
            if (!m.schema) continue;
            const url = r.relative(m.schema, m.manifestUrl);
            const xsd = await r.text(url);
            const doc = parseXML(xsd, m.schema);
            const key = r.virtualKey(url);
            preprocessor.addSchema(key, doc, doc.documentElement.getAttribute('targetNamespace'), url);
            componentSchemas.push(key);
        }

        const registeredSchemas = new Set();
        for (const page of this.pages.values()) {
            const url = r.relative(page.schema, page.manifestUrl);
            const key = r.virtualKey(url);
            page.schemaKey = key;
            if (registeredSchemas.has(key)) continue;
            const xsd = await r.text(url);
            const doc = parseXML(xsd, page.schema);
            page.schemaKey = r.virtualKey(url);
            preprocessor.addSchema(page.schemaKey, doc, doc.documentElement.getAttribute('targetNamespace'), url);
            registeredSchemas.add(key);
        }

        // Build an independent visual master for each registered namespace.
        const componentGroups = new Map();
        for (const key of componentSchemas) {
            const item = preprocessor.documents.get(key);
            const namespace = item.doc.documentElement.getAttribute('targetNamespace');
            if (!componentGroups.has(namespace)) componentGroups.set(namespace, []);
            componentGroups.get(namespace).push(key);
        }
        const visualMasters = new Map();
        for (const [namespace, keys] of componentGroups) {
            const virtualKey = namespace === 'urn:coursekit:visual'
                ? '__generated__/virtual_components.xsd'
                : '__generated__/visual_' + namespace.replace(/[^a-zA-Z0-9]/g, '_') + '.xsd';
            const doc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
            const schema = doc.documentElement;
            schema.setAttribute('targetNamespace', namespace);
            schema.setAttribute('elementFormDefault', 'qualified');
            for (const key of keys) {
                const include = doc.createElementNS(NS.xs, 'xs:include');
                include.setAttribute('schemaLocation', r.virtualRelative(virtualKey, key));
                schema.append(include);
            }
            preprocessor.addSchema(virtualKey, doc, namespace);
            visualMasters.set(namespace, virtualKey);
        }
        const nativePageURL = r.framework('pages/base/base.xsd');
        preprocessor.addSchema(
            r.virtualKey(nativePageURL),
            parseXML(await r.text(nativePageURL), nativePageURL),
            'urn:coursekit:page',
            nativePageURL
        );
        const nativePageMaster = '__generated__/native_page_master.xsd';
        const nativeDoc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
        nativeDoc.documentElement.setAttribute('targetNamespace', 'urn:coursekit:page');
        nativeDoc.documentElement.setAttribute('elementFormDefault', 'qualified');
        const coursePageKey = r.virtualKey(r.framework('pages/course-page/course-page.xsd'));
        const nativeInclude = nativeDoc.createElementNS(NS.xs, 'xs:include');
        nativeInclude.setAttribute('schemaLocation', r.virtualRelative(nativePageMaster, coursePageKey));
        nativeDoc.documentElement.append(nativeInclude);
        preprocessor.addSchema(nativePageMaster, nativeDoc, 'urn:coursekit:page');
        // Group module-owned page declarations into per-namespace masters.
        const pageMasters = new Map();
        const pageGroups = new Map();
        for (const key of registeredSchemas) {
            const record = preprocessor.documents.get(key);
            const namespace = record.doc.documentElement.getAttribute('targetNamespace');
            if (namespace === 'urn:coursekit:page') continue;
            if (!pageGroups.has(namespace)) pageGroups.set(namespace, []);
            pageGroups.get(namespace).push(key);
        }
        for (const [namespace, keys] of pageGroups) {
            const masterKey = '__generated__/page_' + namespace.replace(/[^a-zA-Z0-9]/g, '_') + '.xsd';
            const doc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
            doc.documentElement.setAttribute('targetNamespace', namespace);
            doc.documentElement.setAttribute('elementFormDefault', 'qualified');
            for (const key of keys) {
                const include = doc.createElementNS(NS.xs, 'xs:include');
                include.setAttribute('schemaLocation', r.virtualRelative(masterKey, key));
                doc.documentElement.append(include);
            }
            preprocessor.addSchema(masterKey, doc, namespace);
            pageMasters.set(namespace, masterKey);
        }
        // Apply cross-namespace xsp:extend to a validation-only copy of the native
        // schema. The module's declarations remain in their own namespace.
        const XSP_NAMESPACE = 'urn:coursekit:preprocessor';
        for (const [key, record] of preprocessor.documents) {
            const sourceRoot = record.doc.documentElement;
            const extensions = [...sourceRoot.getElementsByTagNameNS(XSP_NAMESPACE, 'extend')];
            for (const extension of extensions) {
                const [prefix, name] = extension.getAttribute('target').split(':');
                const namespace = extension.lookupNamespaceURI(prefix);
                if (namespace === sourceRoot.getAttribute('targetNamespace')) continue;
                const slotName = extension.getAttribute('slot');
                const targetSchema = [...preprocessor.documents.values()].find(item =>
                    item.doc.documentElement.getAttribute('targetNamespace') === namespace &&
                    [...item.doc.documentElement.children].some(element =>
                        element.namespaceURI === NS.xs && element.localName === 'element' &&
                        element.getAttribute('name') === name &&
                        element.getElementsByTagNameNS(XSP_NAMESPACE, 'slot').length));
                if (!targetSchema) throw Error(`Unresolved XSD extension target ${namespace}:${name}`);
                const targetRoot = targetSchema.doc.documentElement;
                const target = [...targetRoot.children].find(element =>
                    element.namespaceURI === NS.xs && element.localName === 'element' &&
                    element.getAttribute('name') === name);
                const slots = [...target.getElementsByTagNameNS(XSP_NAMESPACE, 'slot')].filter(slot =>
                    slot.getAttribute('name') === slotName);
                if (slots.length !== 1) throw Error(`XSD extension slot not found: ${name}/${slotName}`);
                const moduleNamespace = sourceRoot.getAttribute('targetNamespace');
                const modulePrefix = 'ckmodule_' + moduleNamespace.replace(/[^a-zA-Z0-9]/g, '_');
                targetRoot.setAttributeNS('http://www.w3.org/2000/xmlns/',
                    'xmlns:' + modulePrefix, moduleNamespace);
                if (![...targetRoot.children].some(node =>
                    node.namespaceURI === NS.xs && node.localName === 'import' &&
                    node.getAttribute('namespace') === moduleNamespace)) {
                    const imported = targetSchema.doc.createElementNS(NS.xs, 'xs:import');
                    imported.setAttribute('namespace', moduleNamespace);
                    targetRoot.insertBefore(imported, targetRoot.firstChild);
                }
                for (const particle of [...extension.children]) {
                    const copied = targetSchema.doc.importNode(particle, true);
                    for (const item of [copied, ...copied.getElementsByTagNameNS(NS.xs, '*')]) {
                        for (const attribute of ['ref', 'type', 'base']) {
                            const value = item.getAttribute(attribute);
                            if (!value || !value.includes(':')) continue;
                            const [namePrefix, local] = value.split(':');
                            if (particle.lookupNamespaceURI(namePrefix) === moduleNamespace)
                                item.setAttribute(attribute, modulePrefix + ':' + local);
                        }
                    }
                    slots[0].appendChild(copied);
                }
                extension.remove();
            }
        }
        const processedSchemas = preprocessor.processAll();
        for (const [filename, xsdString] of Object.entries(processedSchemas)) {
            files[filename] = xsdString;
        }

        // Resolve imports to namespace masters in the validation-only graph.
        for (const [filename, source] of Object.entries(files)) {
            const xml = parseXML(source);
            const schema = xml.documentElement;
            const ownNamespace = schema.getAttribute('targetNamespace');
            let changed = false;
            for (const dependency of [...schema.children]) {
                if (dependency.namespaceURI !== NS.xs || dependency.localName !== 'import') continue;
                const namespace = dependency.getAttribute('namespace');
                const target = namespace === 'urn:coursekit:page'
                    ? nativePageMaster
                    : (visualMasters.get(namespace) || pageMasters.get(namespace));
                if (!target || filename === target || ownNamespace === namespace) continue;
                const path = r.virtualRelative(filename, target);
                if (dependency.getAttribute('schemaLocation') !== path) {
                    dependency.setAttribute('schemaLocation', path);
                    changed = true;
                }
            }
            // Includes must precede imports for the Xerces compilation path.
            const declarations = [...schema.children].filter(node =>
                node.namespaceURI === NS.xs && ['include', 'import'].includes(node.localName));
            const expected = [...declarations].sort((a, b) =>
                (a.localName === 'include' ? 0 : 1) - (b.localName === 'include' ? 0 : 1));
            if (expected.some((node, index) => node !== declarations[index])) {
                const first = declarations[0];
                for (const node of declarations) node.remove();
                const anchor = [...schema.children].find(node =>
                    node.namespaceURI === NS.xs && node.localName !== 'annotation');
                for (const node of expected) schema.insertBefore(node, anchor || null);
                changed = true;
            }
            if (changed) files[filename] = serialize(xml);
        }

        for (const page of this.pages.values()) {
            //const schema = await r.text(r.relative(page.schema, page.manifestUrl));
            // diagnoseXSD(page.schemaKey, files);
            page.validator = await compileXSD(page.schemaKey, files);
            page.transformDoc = null;
            page.transformPromise = null;
            page.behaviors = [];
            page.preLoadHooks = [];
            for (const script of page.scripts || []) {
                const url = r.relative(script, page.manifestUrl);
                await this.ctx.scriptLoader.loadUrl(url);
                const module = await import(url);
                if (typeof module.preLoad === 'function') {
                    page.preLoadHooks.push(module.preLoad);
                }
                if (typeof module.main === 'function') {
                    page.behaviors.push(module.main);
                }
            }
        }
    }

    getType(xml) {
        return xml.documentElement.getAttribute('page-type');
    }

    checkParams(xml, page) {
        const el = xml.documentElement;
        for (const a of [...el.attributes]) {
            if (a.name === 'page-type' || a.name === 'xmlns' || a.name.startsWith('xmlns:') || a.namespaceURI === 'http://www.w3.org/2001/XMLSchema-instance')
                continue;
            if (!Object.hasOwn(page.parameters || {}, a.name))
                throw Error(`Page ${page.id}: unknown parameter ${a.name}`);
        }
        for (const [name, definition] of Object.entries(page.parameters || {})) {
            const value = el.getAttribute(name);
            if (value === null) {
                if (definition.required)
                    throw Error(`Page ${page.id}: required ${name}`);
                if (definition.default !== undefined)
                    el.setAttribute(name, String(definition.default));
                continue;
            }
            if (definition.type === 'boolean' && !['true', 'false', '0', '1'].includes(value))
                throw Error(`Page ${page.id}: ${name} must be boolean`);
            if (definition.type === 'number' && !Number.isFinite(Number(value)))
                throw Error(`Page ${page.id}: ${name} must be number`);
            if (definition.enum && !definition.enum.includes(value))
                throw Error(`Page ${page.id}: invalid ${name}`);
        }
    }

    resolveVariables(pageXML) {
        const variables = new Map();
        const root = pageXML.documentElement;

        const meta = [...root.children].find(
            node => node.namespaceURI === NS.page &&
                    node.localName === 'meta'
        );

        if (!meta) {
            throw new Error('Page metadata <meta> is missing.');
        }

        for (const variable of [...meta.children]) {
            if (variable.namespaceURI !== NS.page ||
                variable.localName !== 'var') {
                continue;
            }

            const name = variable.getAttribute('name');
            const hasValue = variable.hasAttribute('value');
            const hasRef = variable.hasAttribute('ref');

            if (!name || hasValue === hasRef) {
                throw new Error(
                    `Invalid page variable ${name || '(unnamed)'}: ` +
                    'exactly one of value or ref is required.'
                );
            }

            if (variables.has(name)) {
                throw new Error(`Duplicate page variable: ${name}`);
            }

            let value;

            if (hasRef) {
                const ref = variable.getAttribute('ref');
                value = this.ctx.settings.get(ref, '');
            } else {
                value = variable.getAttribute('value');
            }

            value = String(value ?? '');

            variables.set(name, value);
            variable.setAttribute('value', value);
            variable.removeAttribute('ref');
        }

        return variables;
    }

    interpolateVariables(pageXML, variables) {
        const resolve = (text) => String(text).replace(
            /\$\{([^{}]+)\}/g,
            (_, rawName) => {
                const name = rawName.trim();

                if (!variables.has(name)) {
                    throw new Error(`Unknown page variable: ${name}`);
                }

                return variables.get(name);
            }
        );

        const walker = pageXML.createTreeWalker(
            pageXML,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );

        let node;

        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = resolve(node.textContent);
            } else {
                for (const attribute of [...node.attributes]) {
                    attribute.value = resolve(attribute.value);
                }
            }
        }

        return pageXML;
    }

    async render(content) {
        const page = this.pages.get(this.getType(content));
        if (!page)
            throw Error('Unknown page type ' + this.getType(content));
        this.checkParams(content, page);

        const params = Object.fromEntries(
            [...content.documentElement.attributes]
                .filter(attribute => !attribute.name.startsWith('xmlns') &&
                    attribute.name !== 'page-type')
                .map(attribute => [attribute.name, attribute.value])
        );

        for (const preLoad of page.preLoadHooks || []) {
            await preLoad({
                settings: this.ctx.settings,
                resources: this.ctx.resources,
                params,
                content,
                page
            });
        }

        // Only the selected page's XSLT and its explicit dependencies are composed.
        if (!page.transformPromise) {
            const sourceURL = this.ctx.resources.relative(page.transform, page.manifestUrl);
            page.transformPromise = new XSLTPreprocessor(this.ctx.resources)
                .process(sourceURL, page.overlays || [])
                .catch(error => {
                    page.transformPromise = null;
                    throw error;
                });
        }
        page.transformDoc = await page.transformPromise;
        const output = transform(content, page.transformDoc);
        if (!output?.documentElement) {
            throw new Error(`Page "${page.id}": XSLT produced no XML`);
        }
        const unknown = output.getElementsByTagNameNS(
            'urn:coursekit:diagnostics',
            'unknown'
        );

        if (unknown.length > 0) {
            const elements = [...unknown].map(node =>
                node.getAttribute('element')
            );

            throw new Error(
                `Page "${page.id}" cannot transform semantic elements: ` +
                [...new Set(elements)].join(', ')
            );
        }
        const variables = this.resolveVariables(output);
        this.interpolateVariables(output, variables);
        await page.validator.validate(serialize(output));
        for (const css of page.styles || [])
            await this.ctx.styleLoader.loadUrl(this.ctx.resources.relative(css, page.manifestUrl));
        return output;
    }
}
