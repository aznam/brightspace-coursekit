import { parseXML, serialize, NS } from './xml.js';
import { compileXSD } from './xsd.js';
import { XSDPreprocessor } from './xsd-preprocessor.js';
import { loadManifest } from './manifest.js';
export class ContentManager {
    constructor(context) {
        this.ctx = context;
        this.schemas = [];
        this.validators = new Map();
        this.rootDefinitions = new Map();
        this.validationFiles = null;
        this.behaviors = [];
    }
    async init() {
        const r = this.ctx.resources, registry = await r.json(r.framework('registry.json'));
        this.registry = registry;
        if ((registry.rootScheme === undefined) !== (registry.rootElement === undefined)) {
            throw new Error('Registry must declare rootScheme and rootElement together.');
        }
        if (registry.rootScheme) {
            await this.registerRoot({
                ...registry.rootElement,
                schema: r.framework(registry.rootScheme),
                owner: 'framework'
            });
        }
        for (const item of registry.semantic || [])
            await this.register(r.framework(item));
    }
    async register(url) {
        const r = this.ctx.resources, m = await loadManifest(r, url, 'semantic', ['schema']);
        this.schemas.push(m);
    }
    static rootKey(namespace, localName) {
        return JSON.stringify([namespace, localName]);
    }

    async registerRoot({ namespace, localName, schema, owner }) {
        if (!namespace || !localName || !schema) {
            throw new Error(`Incomplete semantic root declaration from ${owner}.`);
        }
        const key = ContentManager.rootKey(namespace, localName);
        if (this.rootDefinitions.has(key)) {
            throw new Error(`Duplicate semantic root {${namespace}}${localName}.`);
        }
        await this.ctx.resources.verify(schema);
        this.rootDefinitions.set(key, { namespace, localName, schema, owner });
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
        const resources = this.ctx.resources;
        const namespaceMap = new Map();
        const preprocessor = new XSDPreprocessor(resources);

        for (const manifest of this.schemas) {
            const url = manifest.directSchemaURL || resources.relative(manifest.schema, manifest.manifestUrl);
            manifest.schemaKey = resources.virtualKey(url);
            const schemaDocument = parseXML(await resources.text(url), url);
            const namespace = schemaDocument.documentElement.getAttribute('targetNamespace');

            // Module semantic contracts import namespaces, never individual XSDs.
            // The namespace master is selected when building the validation VFS.
            if (manifest.manifestUrl?.includes('/modules/')) {
                for (const imported of [...schemaDocument.documentElement.children]) {
                    if (imported.namespaceURI === NS.xs &&
                        imported.localName === 'import' &&
                        imported.hasAttribute('schemaLocation')) {
                        throw new Error(
                            `Module semantic schema ${url} must import namespace ` +
                            `"${imported.getAttribute('namespace')}" without schemaLocation.`
                        );
                    }
                }
            }

            if (!namespaceMap.has(namespace)) namespaceMap.set(namespace, []);
            namespaceMap.get(namespace).push(manifest);
            preprocessor.addSchema(manifest.schemaKey, schemaDocument, namespace, url);
        }

        // Root entry schemas are contracts too, even when the module does not
        // repeat their path in its semantic contributions.
        for (const definition of this.rootDefinitions.values()) {
            const key = resources.virtualKey(definition.schema);
            if ([...this.schemas].some(manifest => manifest.schemaKey === key)) continue;

            const schemaDocument = parseXML(await resources.text(definition.schema), definition.schema);
            const namespace = schemaDocument.documentElement.getAttribute('targetNamespace');
            if (!namespaceMap.has(namespace)) namespaceMap.set(namespace, []);
            const manifest = { schemaKey: key };
            namespaceMap.get(namespace).push(manifest);
            preprocessor.addSchema(key, schemaDocument, namespace, definition.schema);
        }

        const files = preprocessor.processAll();
        this.validators.clear();
        this.validationFiles = new Map();

        // Each declared root gets an independent entry schema. The component
        // contracts are included around that root, never around a fixed id.
        for (const [rootKey, definition] of this.rootDefinitions) {
            const entry = resources.virtualKey(definition.schema);
            if (!(entry in files)) {
                throw new Error(`Semantic root schema is not registered: ${definition.schema}`);
            }

            const assembledFiles = { ...files };
            const rootDocument = parseXML(assembledFiles[entry]);
            const schema = rootDocument.documentElement;
            const rootNamespace = schema.getAttribute('targetNamespace');
            if (rootNamespace !== definition.namespace) {
                throw new Error(`Root namespace mismatch for {${definition.namespace}}${definition.localName}.`);
            }

            const declaredRoot = [...schema.children].some(child =>
                child.namespaceURI === NS.xs &&
                child.localName === 'element' &&
                child.getAttribute('name') === definition.localName
            );
            if (!declaredRoot) {
                throw new Error(`Root element {${definition.namespace}}${definition.localName} is not declared in ${entry}.`);
            }

            // Build one independent master XSD per namespace, including the
            // namespace of the selected root. Keep the root contract itself
            // separate from the generated aggregation.
            const namespaceEntries = new Map();

            for (const [namespace, manifests] of namespaceMap) {
                const virtualMaster = `__generated__/semantic_${rootKey.replace(/[^a-zA-Z0-9]/g, '_')}_${namespace.replace(/[^a-zA-Z0-9]/g, '_')}.xsd`;
                const masterDocument = document.implementation.createDocument(NS.xs, 'xs:schema', null);
                const master = masterDocument.documentElement;
                master.setAttribute('targetNamespace', namespace);
                master.setAttribute('elementFormDefault', 'qualified');

                const included = new Set();
                for (const manifest of manifests) {
                    // The root includes its namespace master, not itself.
                    // Excluding it avoids a circular xs:include chain.
                    if (manifest.schemaKey === entry || included.has(manifest.schemaKey)) {
                        continue;
                    }
                    included.add(manifest.schemaKey);

                    const include = masterDocument.createElementNS(NS.xs, 'xs:include');
                    include.setAttribute('schemaLocation', resources.virtualRelative(virtualMaster, manifest.schemaKey));
                    master.appendChild(include);
                }

                assembledFiles[virtualMaster] = serialize(masterDocument);
                namespaceEntries.set(namespace, virtualMaster);
            }

            // The root schema keeps its own declaration and includes the
            // master generated for its namespace. Other namespaces retain
            // the current eager-import behavior (selection is out of scope).
            for (const [namespace, virtualMaster] of namespaceEntries) {
                const location = resources.virtualRelative(entry, virtualMaster);
                if (namespace === rootNamespace) {
                    const include = rootDocument.createElementNS(NS.xs, 'xs:include');
                    include.setAttribute('schemaLocation', location);
                    const firstDeclaration = [...schema.children].find(child =>
                        child.namespaceURI === NS.xs &&
                        !['annotation', 'include', 'import', 'redefine', 'override'].includes(child.localName)
                    );
                    schema.insertBefore(include, firstDeclaration || null);
                } else {
                    const imported = rootDocument.createElementNS(NS.xs, 'xs:import');
                    imported.setAttribute('namespace', namespace);
                    imported.setAttribute('schemaLocation', location);
                    const firstNonImport = [...schema.children].find(child =>
                        child.namespaceURI === NS.xs &&
                        child.localName !== 'import' &&
                        child.localName !== 'annotation'
                    );
                    schema.insertBefore(imported, firstNonImport || null);
                }
            }

            assembledFiles[entry] = serialize(rootDocument);

            // Normalize the VFS copies only: a module imports a namespace, not
            // a particular component file. Resolve that namespace to its master.
            // Put every include before every import, for all generated schemas,
            // including component schemas and the selected root.
            for (const [schemaKey, source] of Object.entries(assembledFiles)) {
                const xml = parseXML(source);
                const schemaNode = xml.documentElement;
                if (schemaNode.namespaceURI !== NS.xs || schemaNode.localName !== 'schema') {
                    continue;
                }

                for (const imported of [...schemaNode.children]) {
                    if (imported.namespaceURI !== NS.xs || imported.localName !== 'import') {
                        continue;
                    }

                    const namespace = imported.getAttribute('namespace');
                    const target = namespaceEntries.get(namespace);
                    if (target && target !== schemaKey) {
                        imported.setAttribute(
                            'schemaLocation',
                            resources.virtualRelative(schemaKey, target)
                        );
                    } else if (!imported.hasAttribute('schemaLocation')) {
                        throw new Error(
                            `No semantic namespace master for import "${namespace}" in ${schemaKey}.`
                        );
                    }
                }

                const includes = [...schemaNode.children].filter(child =>
                    child.namespaceURI === NS.xs && child.localName === 'include'
                );
                const imports = [...schemaNode.children].filter(child =>
                    child.namespaceURI === NS.xs && child.localName === 'import'
                );
                const directives = [...schemaNode.children].filter(child =>
                    child.namespaceURI === NS.xs &&
                    ['include', 'import', 'redefine', 'override'].includes(child.localName)
                );
                const firstDeclaration = [...schemaNode.children].find(child =>
                    child.namespaceURI === NS.xs &&
                    !['annotation', 'include', 'import', 'redefine', 'override'].includes(child.localName)
                );

                // Reorder include/import only; preserve the declaration order and
                // other schema composition directives.
                for (const node of [...includes, ...imports]) {
                    schemaNode.removeChild(node);
                }
                const anchor = directives.find(node => node.parentNode === schemaNode)
                    || (firstDeclaration?.parentNode === schemaNode ? firstDeclaration : null);
                for (const node of [...includes, ...imports]) {
                    schemaNode.insertBefore(node, anchor);
                }

                assembledFiles[schemaKey] = serialize(xml);
            }

            this.validationFiles.set(rootKey, { entry, files: assembledFiles });
        }
    }

    async validatorFor(xml) {
        const root = xml.documentElement;
        const key = ContentManager.rootKey(root.namespaceURI, root.localName);
        const source = this.validationFiles?.get(key);
        if (!source) {
            throw new Error(`No semantic root registered for {${root.namespaceURI}}${root.localName}.`);
        }
        if (!this.validators.has(key)) {
            this.validators.set(key, await compileXSD(source.entry, source.files));
        }
        return this.validators.get(key);
    }

    async show(path, { pages, components }) {
        const url = await this.ctx.resources.resolve(path, 'content');
        const source = await this.ctx.resources.text(url);
        const xml = parseXML(source, url);
        this.ctx.settings.variables(xml);
        const validator = await this.validatorFor(xml);
        await validator.validate(serialize(xml)); // Content XML's page params are admitted via anyAttribute, validated by PagesManager.
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