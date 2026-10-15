import { parseXML, serialize, transform, NS } from './xml.js';
import { compileXSD } from './xsd.js';
import { loadManifest, mergeDefinition } from './manifest.js';
import { XSDPreprocessor } from './xsd-preprocessor.js'; // Import du pré-processeur
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

    async prepare() {
        const r = this.ctx.resources;
        const files = {};
        const preprocessor = new XSDPreprocessor();
        const componentSchemas = [];

        const base = this.ctx.components.baseSchema;
        if (base) {
            preprocessor.addSchema(base.filename, parseXML(base.content, base.filename), base.namespace);
        }
        
        for (const m of this.ctx.components.components.values()) {
            if (!m.schema) continue;
            const url = r.relative(m.schema, m.manifestUrl);
            const xsd = await r.text(url);
            const doc = parseXML(xsd, m.schema);
            preprocessor.addSchema(m.schema, doc, doc.documentElement.getAttribute('targetNamespace'));
            componentSchemas.push(m.schema);
        }

        for (const page of this.pages.values()) {
            const url = r.relative(page.schema, page.manifestUrl);
            const xsd = await r.text(url);
            const doc = parseXML(xsd, page.schema);
            preprocessor.addSchema(page.schema, doc, doc.documentElement.getAttribute('targetNamespace'));
        }

        const processedSchemas = preprocessor.processAll();
        for (const [filename, xsdString] of Object.entries(processedSchemas)) {
            files[filename] = xsdString;
        }

        const virtualSchemaDoc = document.implementation.createDocument(NS.xs, 'xs:schema', null);
        const vSchema = virtualSchemaDoc.documentElement;
        vSchema.setAttribute('targetNamespace', 'urn:coursekit:visual');
        vSchema.setAttribute('elementFormDefault', 'qualified');
        
        for (const schemaPath of componentSchemas) {
            const inc = virtualSchemaDoc.createElementNS(NS.xs, 'xs:include');
            const parts = schemaPath.split('/');
            inc.setAttribute('schemaLocation', parts[parts.length - 1]);
            vSchema.appendChild(inc);
        }
        files['virtual_components.xsd'] = serialize(virtualSchemaDoc);

        for (const page of this.pages.values()) {
            const schema = await r.text(r.relative(page.schema, page.manifestUrl));
            // ---> INJECTE LE DIAGNOSTIC ICI <---
            diagnoseXSD(page.schema, files);
            page.validator = await compileXSD(page.schema, files);
            page.transformDoc = parseXML(await r.text(r.relative(page.transform, page.manifestUrl)), page.transform);
            for (const url of page.overlays || []) {
                const overlay = parseXML(await r.text(url), url);
                for (const a of [...overlay.documentElement.attributes])
                    if (a.name.startsWith('xmlns:') && !page.transformDoc.documentElement.hasAttribute(a.name))
                        page.transformDoc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', a.name, a.value);
                for (const rule of [...overlay.documentElement.children]) {
                    if (!['template', 'param', 'variable', 'key'].includes(rule.localName))
                        throw Error('Unsupported XSLT overlay rule ' + rule.localName);
                    const key = rule.getAttribute('name') || [rule.getAttribute('match'), rule.getAttribute('mode')].join('|');
                    for (const old of [...page.transformDoc.documentElement.children]) {
                        if (old.localName === rule.localName && (old.getAttribute('name') || [old.getAttribute('match'), old.getAttribute('mode')].join('|')) === key)
                            old.remove();
                    }
                    page.transformDoc.documentElement.append(page.transformDoc.importNode(rule, true));
                }
            }
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
    async render(content) {
        const page = this.pages.get(this.getType(content));
        if (!page)
            throw Error('Unknown page type ' + this.getType(content));
        this.checkParams(content, page);
        const output = transform(content, page.transformDoc);
        if (!output?.documentElement)
            throw Error('Page XSLT produced no XML');
        await page.validator.validate(serialize(output));
        for (const css of page.styles || [])
            await this.ctx.styleLoader.loadUrl(this.ctx.resources.relative(css, page.manifestUrl));
        return output;
    }
}
