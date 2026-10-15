import { serialize, NS } from './xml.js';

export const XSP_NS = 'urn:coursekit:preprocessor';

export class XSDPreprocessor {
    constructor(resources) {
        this.resources = resources;
        this.vfs = resources.createVirtualFS();
        this.documents = new Map();
    }

    addSchema(filename, doc, namespace, sourceURL = null) {
        if (this.documents.has(filename)) throw Error(`Duplicate schema key: ${filename}`);
        this.documents.set(filename, { doc, namespace, sourceURL });
    }

    processAll() {
        for (const [key, entry] of this.documents) {
            this._flattenImports(key, entry);
        }

        for (const { doc } of this.documents.values()) {
            this._resolveInheritance(doc);
        }

        const result = {};
        for (const [filename, { doc }] of this.documents.entries()) {
            result[filename] = serialize(doc);
            this.vfs.put(filename, result[filename]);
        }
        return result;
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
            } else {
                if (!sourceURL) {
                    const virtualURL = new URL(loc, new URL(key, 'https://vfs.coursekit.invalid/'));
                    target = virtualURL.pathname.slice(1);
                } else {
                    target = this.resources.virtualKey(loc, sourceURL);
                }
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
