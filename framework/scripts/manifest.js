import { JSONPreprocessor } from './json-preprocessor.js';
/** Manifest resource checking and deterministic declaration order. */
export async function loadManifest(resources, url, type, keys = []) {
    if (!resources.manifestValidator) {
        throw new Error("ManifestValidator has not been initialized");
    }
    const raw = await resources.json(url);
    await resources.manifestValidator.validate(type, raw, url);
    const data = new JSONPreprocessor(resources).process(raw, url);
    if (!data.id || typeof data.id !== 'string')
        throw Error('Missing manifest id: ' + url);
    for (const key of keys)
        if (!data[key])
            throw Error(`Missing ${key} in ${url}`);
    const files = [data.schema, data.transform, data.template, data.renderer, ...(data.styles || []), ...(data.scripts || [])].filter(Boolean);
    await Promise.all(files.map(file => resources.verify(resources.relative(file, url))));
    return { ...data, manifestUrl: url };
}
export function mergeDefinition(target, patch, operation) {
    if (operation === 'add' && target)
        throw Error('Duplicate definition ' + patch.id);
    if (operation !== 'add' && !target)
        throw Error('Unknown definition ' + patch.id);
    if (operation === 'override')
        return patch;
    if (operation === 'extend')
        return { ...target, ...patch, parameters: { ...(target.parameters || {}), ...(patch.parameters || {}) }, styles: [...(target.styles || []), ...(patch.styles || [])], scripts: [...(target.scripts || []), ...(patch.scripts || [])] };
    return patch;
}
