import XercesModule from '../vendor/xerces/xerces_validator.js';
let wasm;
async function engine() {
    if (!wasm)
        wasm = XercesModule({ locateFile: file => new URL('../vendor/xerces/' + file, import.meta.url).href });
    return wasm;
}
export async function compileXSD(entry, files) {
    const mod = await engine();
    const instance = new mod.ProjectValidator();
    let ok = false;
    try {
        ok = instance.init(entry, files, null);
    }
    catch (e) {
        instance.delete();
        throw e;
    }
    if (!ok) {
        instance.delete();
        throw Error('Unable to compile XSD: ' + entry);
    }
    return { async validate(xml) {
            const result = instance.validate(xml);
            if (!result.valid) {
                const errors = [...(result.parseErrors || []), ...(result.schemaErrors || [])];
                throw Error('XSD validation failed: ' + errors.map(e => `${e.line}:${e.column} ${e.message}`).join('; '));
            }
            return result;
        }, destroy() {
            instance.delete();
        } };
}
