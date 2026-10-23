import XercesModule from '../vendor/xerces/xerces_validator.js';
import { normalizeXercesVfs } from './xsd-xerces-workaround.js';
import { isXsdAuditEnabled, auditPreparedXsd } from './xsd-audit.js';

let wasm;

async function engine() {
    if (!wasm) {
        wasm = XercesModule({
            locateFile: file => new URL('../vendor/xerces/' + file, import.meta.url).href
        });
    }

    return wasm;
}

export async function compileXSD(entry, files) {
    const mod = await engine();
    const instance = new mod.ProjectValidator();

    // TEMPORARY: remove this line and the import after upstream WASM is fixed.
    const prepared = normalizeXercesVfs({ entry, files });
    if (isXsdAuditEnabled()) {
        try {
            auditPreparedXsd({ entry, files, prepared });
        } catch (error) {
            console.warn('[CourseKit] XSD audit failed without interrupting compilation:', error);
        }
    }

    let ok = false;

    try {
        ok = instance.init(prepared.entry, prepared.files, null);
    } catch (error) {
        instance.delete();
        throw error;
    }

    if (!ok) {
        instance.delete();
        throw Error('Unable to compile XSD: ' + entry);
    }

    return {
        async validate(xml) {
            const result = instance.validate(xml);

            if (!result.valid) {
                const errors = [
                    ...(result.parseErrors || []),
                    ...(result.schemaErrors || [])
                ];

                throw Error(
                    'XSD validation failed: ' +
                    errors.map(error => `${error.line}:${error.column} ${error.message}`).join('; ')
                );
            }

            return result;
        },

        destroy() {
            instance.delete();
        }
    };
}
