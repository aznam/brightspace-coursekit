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

        // A synthetic schema gathers the visual component declarations.
        const virtualKey = '__generated__/virtual_components.xsd';
        const virtualSchemaDoc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
        const vSchema = virtualSchemaDoc.documentElement;
        vSchema.setAttribute('targetNamespace', 'urn:coursekit:visual');
        vSchema.setAttribute('elementFormDefault', 'qualified');
        for (const schemaKey of componentSchemas) {
            const inc = virtualSchemaDoc.createElementNS(NS.xs, 'xs:include');
            inc.setAttribute('schemaLocation', r.virtualRelative(virtualKey, schemaKey));
            vSchema.appendChild(inc);
        }
        // Generated references are already VFS-relative; no source URL is required.
        preprocessor.addSchema(virtualKey, virtualSchemaDoc, 'urn:coursekit:visual');
        const basePageURL = r.framework('pages/base/base.xsd');
        preprocessor.addSchema(
            r.virtualKey(basePageURL),
            parseXML(await r.text(basePageURL), basePageURL),
            'urn:coursekit:page',
            basePageURL
        );
        const processedSchemas = preprocessor.processAll();
        for (const [filename, xsdString] of Object.entries(processedSchemas)) {
            files[filename] = xsdString;
        }

        for (const page of this.pages.values()) {
            //const schema = await r.text(r.relative(page.schema, page.manifestUrl));
            // diagnoseXSD(page.schemaKey, files);
            page.validator = await compileXSD(page.schemaKey, files);
            page.transformDoc = null;
            page.transformPromise = null;
            page.behaviors = [];
            for (const script of page.scripts || []) {
                const url = r.relative(script, page.manifestUrl);
                await this.ctx.scriptLoader.loadUrl(url);
                const module = await import(url);
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
                value = this.ctx.settings.get(ref, null);

                if (value === null || typeof value === 'object') {
                    throw new Error(`Unknown or invalid JSON variable: ${ref}`);
                }
            } else {
                value = variable.getAttribute('value');
            }

            variables.set(name, String(value));
            variable.setAttribute('value', String(value));
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
