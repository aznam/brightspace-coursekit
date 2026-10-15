export const NS = { content: 'urn:coursekit:content', semantic: 'urn:coursekit:semantic', page: 'urn:coursekit:page', xs: 'http://www.w3.org/2001/XMLSchema' };
export function parseXML(text, label = 'XML') {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    const error = doc.querySelector('parsererror');
    if (error)
        throw Error(`${label}: ${error.textContent}`);
    return doc;
}
export function serialize(xml) {
    return new XMLSerializer().serializeToString(xml);
}
export function transform(xml, xslt) {
    const processor = new XSLTProcessor();
    processor.importStylesheet(xslt);
    return processor.transformToDocument(xml);
}
export function asHTML(fragment) {
    const output = document.createDocumentFragment();
    for (const child of [...fragment.childNodes])
        output.append(document.importNode(child, true));
    return output;
}
export function qname(node) {
    return `{${node.namespaceURI || ''}}${node.localName}`;
}
