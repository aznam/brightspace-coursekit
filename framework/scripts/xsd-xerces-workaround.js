/**
 * CourseKit — temporary Xerces-WASM VFS basename-collision workaround.
 *
 * The current ProjectValidator resolver can select the wrong schema when two
 * different VFS paths have the same final filename.
 *
 * Remove this file and the single import/call in xsd.js once the upstream
 * Xerces-WASM resolver distinguishes paths correctly.
 *
 * Only the in-memory copies handed to Xerces are changed. Original schemas,
 * resource identities and CourseKit's XSD preprocessing remain untouched.
 */

const XSD_NS = 'http://www.w3.org/2001/XMLSchema';
const VFS_ORIGIN = 'https://coursekit-vfs.invalid/';

function basename(path) {
    return path.slice(path.lastIndexOf('/') + 1);
}

function hasDuplicateBasenames(paths) {
    const seen = new Set();

    for (const path of paths) {
        const name = basename(path);

        if (seen.has(name)) {
            return true;
        }

        seen.add(name);
    }

    return false;
}

function resolveReference(reference, owner, knownPaths) {
    if (knownPaths.has(reference)) {
        return reference;
    }

    if (reference.includes('?') || reference.includes('#')) {
        throw new Error(`Xerces workaround: unsupported schemaLocation '${reference}' in '${owner}'.`);
    }

    const url = new URL(reference, new URL(owner, VFS_ORIGIN));

    if (url.origin !== new URL(VFS_ORIGIN).origin) {
        throw new Error(`Xerces workaround: external schemaLocation '${reference}' in '${owner}'.`);
    }

    const path = decodeURI(url.pathname.slice(1));

    if (!knownPaths.has(path)) {
        throw new Error(`Xerces workaround: unresolved schemaLocation '${reference}' in '${owner}' (resolved to '${path}').`);
    }

    return path;
}

/**
 * Give each schema a unique virtual basename and update local XSD references.
 * The returned object is new only when a basename collision is present.
 *
 * @param {{entry: string, files: Record<string, string>}} source
 * @returns {{entry: string, files: Record<string, string>}}
 */
export function normalizeXercesVfs(source) {
    const { entry, files } = source;
    const paths = Object.keys(files);

    if (!(entry in files)) {
        throw new Error(`Xerces workaround: entry '${entry}' is missing.`);
    }

    if (!hasDuplicateBasenames(paths)) {
        return source;
    }

    const sorted = [...paths].sort();
    const names = new Map(
        sorted.map((path, index) => [
            path,
            `__ck_xerces_vfs__/schema_${String(index + 1).padStart(5, '0')}.xsd`
        ])
    );
    const knownPaths = new Set(paths);
    const rewritten = {};
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    for (const path of sorted) {
        const xml = parser.parseFromString(files[path], 'application/xml');

        if (xml.getElementsByTagName('parsererror').length > 0) {
            throw new Error(`Xerces workaround: invalid XML schema '${path}'.`);
        }

        for (const element of Array.from(xml.getElementsByTagNameNS(XSD_NS, '*'))) {
            if (!['include', 'import', 'redefine', 'override'].includes(element.localName)) {
                continue;
            }

            const location = element.getAttribute('schemaLocation');

            if (!location) {
                continue;
            }

            const target = resolveReference(location, path, knownPaths);
            element.setAttribute('schemaLocation', basename(names.get(target)));
        }

        rewritten[names.get(path)] = serializer.serializeToString(xml);
    }

    return {
        entry: names.get(entry),
        files: rewritten
    };
}
