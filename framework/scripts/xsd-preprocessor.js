import { serialize, NS } from './xml.js';

export const XSP_NS = 'urn:coursekit:preprocessor';

export class XSDPreprocessor {
    constructor(resources) {
        this.resources = resources;
        this.vfs = resources.createVirtualFS();
        this.documents = new Map();
        this.expandedIncludes = new Set();
    }

    addSchema(filename, doc, namespace, sourceURL = null) {
        if (this.documents.has(filename)) throw Error(`Duplicate schema key: ${filename}`);
        this.documents.set(filename, { doc, namespace, sourceURL });
    }

    processAll() {
        // A derived schema is expanded in its own document. Registered base
        // schemas remain independent and are never altered by extensions.
        for (const [key, entry] of this.documents) {
            if (entry.doc.getElementsByTagNameNS(XSP_NS, 'extend').length) {
                this._expandIncludes(key, entry);
            }
        }
        for (const [key, entry] of this.documents) {
            this._applyExtensions(key, entry.doc);
            this._unwrapSlots(entry.doc);
            this._resolveInheritance(entry.doc);
            this._flattenImports(key, entry);
        }

        const result = {};
        for (const [filename, { doc }] of this.documents.entries()) {
            result[filename] = serialize(doc);
            this.vfs.put(filename, result[filename]);
        }
        return result;
    }

    // Expand xs:include only for schemas using xsp:extend. This makes the
    // included declarations locally editable without redefining a shared XSD.
    _expandIncludes(key, entry) {
        this.expandedIncludes.add(key);
        const doc = entry.doc;
        const root = doc.documentElement;
        const seen = new Set([key]);
        const imports = new Map();
        const declarations = new Map();
        const self = this;

        function locate(loc, parentKey, parentEntry) {
            if (loc === 'virtual_components.xsd') return '__generated__/virtual_components.xsd';
            if (loc.startsWith('__generated__/')) return loc;
            return parentEntry.sourceURL
                ? self.resources.virtualKey(loc, parentEntry.sourceURL)
                : new URL(loc, new URL(parentKey, 'https://vfs.coursekit.invalid/')).pathname.slice(1);
        }

        function scan(parentKey, parentEntry) {
            const sourceRoot = parentEntry.doc.documentElement;
            if (sourceRoot.getAttribute('targetNamespace') !== root.getAttribute('targetNamespace')) {
                throw Error(`XSD include namespace mismatch: ${parentKey}`);
            }
            for (const child of [...sourceRoot.children]) {
                if (child.namespaceURI !== NS.xs) continue;
                if (child.localName === 'include') {
                    const target = locate(child.getAttribute('schemaLocation'), parentKey, parentEntry);
                    if (seen.has(target)) continue;
                    const next = self.documents.get(target);
                    if (!next) throw Error(`Unregistered XSD include: ${target}`);
                    seen.add(target);
                    scan(target, next);
                } else if (child.localName === 'import') {
                    const loc = child.getAttribute('schemaLocation');
                    const target = loc ? locate(loc, parentKey, parentEntry) : '';
                    const unique = `${child.getAttribute('namespace')}|${target}`;
                    if (!imports.has(unique)) {
                        const clone = doc.importNode(child, true);
                        if (loc) clone.setAttribute('schemaLocation', self.resources.virtualRelative(key, target));
                        imports.set(unique, clone);
                    }
                } else if (child.localName !== 'annotation' && child.localName !== 'redefine' && child.localName !== 'override') {
                    const name = child.getAttribute('name');
                    const unique = `${child.localName}:${name}`;
                    if (name && declarations.has(unique)) {
                        throw Error(`Duplicate XSD declaration in ${key}: ${unique}`);
                    }
                    if (name) declarations.set(unique, doc.importNode(child, true));
                }
            }
        }

        // Start from included schemas, then retain local declarations and
        // xsp:extend instructions in their original order.
        const local = [...root.children];
        for (const child of local) {
            if (child.namespaceURI === NS.xs && child.localName === 'include') {
                const target = locate(child.getAttribute('schemaLocation'), key, entry);
                const included = this.documents.get(target);
                if (!included) throw Error(`Unregistered XSD include: ${target}`);
                if (!seen.has(target)) { seen.add(target); scan(target, included); }
                child.remove();
            } else if (child.namespaceURI === NS.xs && child.localName === 'import') {
                const loc = child.getAttribute('schemaLocation');
                const target = loc ? locate(loc, key, entry) : '';
                const unique = `${child.getAttribute('namespace')}|${target}`;
                if (!imports.has(unique)) {
                    const clone = doc.importNode(child, true);
                    if (loc) clone.setAttribute('schemaLocation', this.resources.virtualRelative(key, target));
                    imports.set(unique, clone);
                }
                child.remove();
            } else if (child.namespaceURI === NS.xs && child.hasAttribute('name')) {
                const unique = `${child.localName}:${child.getAttribute('name')}`;
                if (declarations.has(unique)) throw Error(`Duplicate XSD declaration in ${key}: ${unique}`);
                declarations.set(unique, child);
                child.remove();
            }
        }
        // XSD 1.0 requires xs:import before declarations.
        const anchor = root.firstChild;
        for (const imported of imports.values()) root.insertBefore(imported, anchor);
        for (const declaration of declarations.values()) root.appendChild(declaration);
    }

    _applyExtensions(key, doc) {
        for (const extend of [...doc.getElementsByTagNameNS(XSP_NS, 'extend')]) {
            const target = extend.getAttribute('target');
            const slotName = extend.getAttribute('slot');
            if (!target || !slotName) throw Error('XSD xsp:extend requires target and slot.');
            const [prefix, name] = target.includes(':') ? target.split(':') : ['', target];
            const ns = prefix ? extend.lookupNamespaceURI(prefix) : doc.documentElement.getAttribute('targetNamespace');
            if (ns !== doc.documentElement.getAttribute('targetNamespace')) {
                throw Error(`XSD xsp:extend target must belong to page namespace: ${target}`);
            }
            const definitions = [...doc.documentElement.children].filter(n =>
                n.namespaceURI === NS.xs && n.localName === 'element' && n.getAttribute('name') === name
            );
            if (definitions.length !== 1) throw Error(`XSD xsp:extend target not uniquely found: ${target} (${key})`);
            const slots = [...definitions[0].getElementsByTagNameNS(XSP_NS, 'slot')].filter(n => n.getAttribute('name') === slotName);
            if (slots.length !== 1) throw Error(`XSD xsp:slot '${slotName}' not uniquely found in ${target} (${key})`);
            const slot = slots[0];
            if (!slot.parentNode || slot.parentNode.namespaceURI !== NS.xs || !['choice', 'sequence', 'all'].includes(slot.parentNode.localName)) {
                throw Error(`XSD xsp:slot '${slotName}' must be inside xs:choice, xs:sequence or xs:all`);
            }
            for (const child of [...extend.children]) {
                if (child.namespaceURI !== NS.xs) throw Error('XSD xsp:extend accepts only XSD particles.');
                slot.appendChild(doc.importNode(child, true));
            }
            extend.remove();
        }
    }

    _unwrapSlots(doc) {
        for (const slot of [...doc.getElementsByTagNameNS(XSP_NS, 'slot')]) {
            while (slot.firstChild) slot.parentNode.insertBefore(slot.firstChild, slot);
            slot.remove();
        }
    }

    _flattenImports(key, { doc, sourceURL }) {
        const imports = [
            ...doc.getElementsByTagNameNS(NS.xs, 'include'),
            ...doc.getElementsByTagNameNS(NS.xs, 'import')
        ];
        for (const el of imports) {
            const loc = el.getAttribute('schemaLocation');
            if (!loc) continue;
            // A generated schema is addressed by its exact VFS key.
            let target;
            if (loc === 'virtual_components.xsd') {
                target = '__generated__/virtual_components.xsd';
            } else if (loc.startsWith('__generated__/')) {
                target = loc;
            } else if (this.expandedIncludes.has(key) || !sourceURL) {
                // xs:include expansion rewrites imported schemaLocation values
                // relative to the derived VFS key, not the original HTTP URL.
                // Resolve those references within the VFS to avoid interpreting
                // ../../__generated__/... as a URL outside framework/course roots.
                const virtualURL = new URL(loc, new URL(key, 'https://vfs.coursekit.invalid/'));
                target = virtualURL.pathname.slice(1);
            } else {
                target = this.resources.virtualKey(loc, sourceURL);
            }
            if (!this.documents.has(target)) {
                throw Error(`Unregistered XSD reference ${loc} (${key} -> ${target})`);
            }
            el.setAttribute('schemaLocation', this.resources.virtualRelative(key, target));
        }
    }

    _resolveInheritance(doc) {
        const inherits = [...doc.getElementsByTagNameNS(XSP_NS, 'inherit')];

        for (const inheritNode of inherits) {
            const baseQName = inheritNode.getAttribute('base');
            if (!baseQName) throw new Error('<xsp:inherit> requires a "base" attribute.');

            const [prefix, localName] = baseQName.includes(':') ? baseQName.split(':') : ['', baseQName];
            const baseNs = prefix
                ? doc.documentElement.lookupNamespaceURI(prefix)
                : doc.documentElement.getAttribute('targetNamespace');

            const baseInfo = this._collectTypeHierarchy(baseNs, localName);
            if (!baseInfo) {
                throw new Error(`XSD Preprocessor: Base type '${baseQName}' not found.`);
            }

            const parentComplexType = inheritNode.closest('complexType');
            if (parentComplexType && baseInfo.mixed && !parentComplexType.hasAttribute('mixed')) {
                parentComplexType.setAttribute('mixed', 'true');
            }

            const flatContent = doc.createDocumentFragment();

            let targetModel;
            if (baseInfo.contentModel) {
                targetModel = doc.importNode(baseInfo.contentModel, true);
            } else {
                targetModel = doc.createElementNS(NS.xs, 'xs:choice');
                targetModel.setAttribute('minOccurs', '0');
                targetModel.setAttribute('maxOccurs', 'unbounded');
            }

            const newElements = [...inheritNode.children];
            if (newElements.length > 0) {
                for (const child of newElements) {
                    targetModel.appendChild(doc.importNode(child, true));
                }
                flatContent.appendChild(targetModel);
            } else if (baseInfo.contentModel) {
                flatContent.appendChild(targetModel);
            }

            for (const attrNode of baseInfo.attributes) {
                flatContent.appendChild(doc.importNode(attrNode, true));
            }

            inheritNode.replaceWith(flatContent);
        }
    }

    _collectTypeHierarchy(namespace, localName) {
        const found = this._findComplexType(namespace, localName);
        if (!found) return null;

        const { node: typeNode, doc: typeDoc } = found;
        let contentModel = null;
        let mixed = typeNode.getAttribute('mixed') === 'true';
        const attributes = [];

        const complexContent = [...typeNode.children].find(
            n => n.namespaceURI === NS.xs && n.localName === 'complexContent'
        );
        const extension = complexContent
            ? [...complexContent.children].find(n => n.namespaceURI === NS.xs && n.localName === 'extension')
            : null;

        if (extension) {
            if (complexContent.getAttribute('mixed') === 'true') mixed = true;
            const extBase = extension.getAttribute('base');
            if (extBase) {
                const [p, l] = extBase.includes(':') ? extBase.split(':') : ['', extBase];
                const extNs = p
                    ? typeDoc.documentElement.lookupNamespaceURI(p)
                    : typeDoc.documentElement.getAttribute('targetNamespace');
                const parentInfo = this._collectTypeHierarchy(extNs, l);
                if (parentInfo) {
                    if (parentInfo.mixed) mixed = true;
                    if (parentInfo.contentModel) contentModel = parentInfo.contentModel;
                    attributes.push(...parentInfo.attributes);
                }
            }

            const extModel = [...extension.children].find(
                n => n.namespaceURI === NS.xs && ['choice', 'sequence', 'all', 'group'].includes(n.localName)
            );
            if (extModel) contentModel = extModel;

            for (const child of [...extension.children]) {
                if (child.namespaceURI === NS.xs && ['attribute', 'attributeGroup', 'anyAttribute'].includes(child.localName)) {
                    attributes.push(child);
                }
            }
        } else {
            const directModel = [...typeNode.children].find(
                n => n.namespaceURI === NS.xs && ['choice', 'sequence', 'all', 'group'].includes(n.localName)
            );
            if (directModel) contentModel = directModel;

            for (const child of [...typeNode.children]) {
                if (child.namespaceURI === NS.xs && ['attribute', 'attributeGroup', 'anyAttribute'].includes(child.localName)) {
                    attributes.push(child);
                }
            }
        }

        return { contentModel, attributes, mixed };
    }

    _findComplexType(namespace, localName) {
        for (const { doc, namespace: docNs } of this.documents.values()) {
            if (docNs === namespace) {
                const types = [...doc.documentElement.children].filter(
                    n => n.namespaceURI === NS.xs && n.localName === 'complexType'
                );
                const target = types.find(t => t.getAttribute('name') === localName);
                if (target) return { node: target, doc };
            }
        }
        return null;
    }
}
