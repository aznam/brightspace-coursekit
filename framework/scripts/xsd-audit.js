/**
 * CourseKit — optional XSD compilation audit.
 *
 * Enable for a page load with ?ck-xsd-audit=1 (or true), or set
 * window.CourseKitXsdAuditEnabled = true before CourseKit starts.
 *
 * Auditing is read-only: it never changes the VFS files passed to Xerces.
 * Captured data and full XSD sources may contain private course content;
 * do not enable in production unless needed for troubleshooting.
 */

const XSD_NS = 'http://www.w3.org/2001/XMLSchema';
const VFS_BASE = 'https://coursekit.invalid/';
const REFERENCE_ELEMENTS = new Set(['include', 'import', 'redefine', 'override']);

export function isXsdAuditEnabled() {
    if (typeof window === 'undefined') {
        return false;
    }

    if (window.CourseKitXsdAuditEnabled === true) {
        return true;
    }

    const value = new URLSearchParams(window.location.search).get('ck-xsd-audit');
    return value === '1' || value === 'true';
}

function originalPathMap(files, prepared) {
    const originals = Object.keys(files).sort();
    const paths = Object.keys(prepared.files);
    const result = new Map();

    if (paths.some(path => path.startsWith('__ck_xerces_vfs__/'))) {
        originals.forEach((path, index) => {
            const generated = `__ck_xerces_vfs__/schema_${String(index + 1).padStart(5, '0')}.xsd`;
            result.set(generated, path);
        });
    } else {
        originals.forEach(path => result.set(path, path));
    }

    return result;
}

export function auditPreparedXsd({ entry, files, prepared }) {
    const originalByPrepared = originalPathMap(files, prepared);
    const parser = new DOMParser();
    const parsed = new Map();
    const audit = {
        timestamp: new Date().toISOString(),
        requestedEntry: entry,
        actualEntry: prepared.entry,
        files: [],
        references: [],
        errors: []
    };

    for (const [path, source] of Object.entries(prepared.files)) {
        const xml = parser.parseFromString(source, 'application/xml');
        const root = xml.documentElement;

        if (!root || root.localName === 'parsererror' ||
            xml.getElementsByTagName('parsererror').length > 0) {
            audit.errors.push({
                file: path,
                error: root?.textContent ?? 'Invalid XML document'
            });
            continue;
        }

        const namespace = root.getAttribute('targetNamespace') || '';
        parsed.set(path, { root, namespace });
        audit.files.push({
            path,
            originalFile: originalByPrepared.get(path) ?? 'UNKNOWN',
            namespace,
            isEntry: path === prepared.entry,
            size: source.length
        });
    }

    for (const [path, { root }] of parsed) {
        for (const element of root.getElementsByTagNameNS(XSD_NS, '*')) {
            if (!REFERENCE_ELEMENTS.has(element.localName)) {
                continue;
            }

            const location = element.getAttribute('schemaLocation');
            const declaredNamespace = element.getAttribute('namespace');
            if (!location) {
                audit.references.push({
                    from: path,
                    operation: element.localName,
                    declaredNamespace,
                    location: null,
                    resolved: null,
                    exists: null,
                    targetNamespace: null
                });
                continue;
            }

            let resolved;
            try {
                const url = new URL(location, new URL(path, VFS_BASE));
                resolved = url.origin === new URL(VFS_BASE).origin
                    ? decodeURI(url.pathname.slice(1))
                    : null;
            } catch (error) {
                audit.errors.push({ file: path, error: `Invalid schemaLocation: ${location}` });
            }

            const exists = resolved === null || resolved === undefined
                ? false
                : Object.hasOwn(prepared.files, resolved);

            audit.references.push({
                from: path,
                operation: element.localName,
                declaredNamespace,
                location,
                resolved: resolved ?? null,
                exists,
                targetNamespace: exists ? (parsed.get(resolved)?.namespace ?? null) : null
            });

            if (!exists) {
                audit.errors.push({ file: path, error: `Unresolved ${element.localName}: ${location}` });
            }
        }
    }

    console.groupCollapsed('[CourseKit] XSD validation audit');
    console.log('Requested entry:', audit.requestedEntry);
    console.log('Actual entry:', audit.actualEntry);
    console.table(audit.files);
    console.table(audit.references);

    if (audit.errors.length) {
        console.error('Audit errors:', audit.errors);
    }

    console.log('Complete audit:', audit);
    console.groupCollapsed('XSD files — complete contents');

    for (const [path, source] of Object.entries(prepared.files)) {
        const originalFile = originalByPrepared.get(path) ?? path;
        const prefix = path === prepared.entry ? '[ENTRY] ' : '';
        console.groupCollapsed(`${prefix}${originalFile} → ${path}`);
        console.log(source);
        console.groupEnd();
    }

    console.groupEnd();
    console.groupEnd();

    window.__coursekitXsdAudit = audit;
    window.__coursekitPreparedXsd = prepared;
    return audit;
}
