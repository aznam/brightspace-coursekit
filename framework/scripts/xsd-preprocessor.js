import { serialize, NS } from './xml.js';

export const XSP_NS = 'urn:coursekit:preprocessor';

export class XSDPreprocessor {
    constructor() {
        this.documents = new Map();
    }

    addSchema(filename, doc, namespace) {
        this.documents.set(filename, { doc, namespace });
    }

    processAll() {
        for (const { doc } of this.documents.values()) {
            this._flattenImports(doc);
        }

        for (const { doc } of this.documents.values()) {
            this._resolveInheritance(doc);
        }

        const result = {};
        for (const [filename, { doc }] of this.documents.entries()) {
            result[filename] = serialize(doc);
        }
        return result;
    }

    _flattenImports(doc) {
        const imports = [
            ...doc.getElementsByTagNameNS(NS.xs, 'include'),
            ...doc.getElementsByTagNameNS(NS.xs, 'import')
        ];
        for (const el of imports) {
            const loc = el.getAttribute('schemaLocation');
            if (loc) {
                const parts = loc.split('/');
                el.setAttribute('schemaLocation', parts[parts.length - 1]);
            }
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