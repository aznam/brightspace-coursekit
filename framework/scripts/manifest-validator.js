/** JSON Schema 2020-12 validation using bundled Ajv. No build step or network needed. */
import { Ajv2020 } from '../vendor/ajv/ajv2020.js';

const SCHEMAS = Object.freeze({
    course: 'schemas/course.schema.json',
    semantic: 'schemas/semantic.schema.json',
    page: 'schemas/page.schema.json',
    component: 'schemas/component.schema.json',
    module: 'schemas/module.schema.json'
});

export class ManifestValidator {
    constructor(resources) {
        this.resources = resources;
        this.ajv = new Ajv2020({ allErrors: true, strict: false });
        this.validators = new Map();
    }

    async validate(type, value, url) {
        if (!Object.hasOwn(SCHEMAS, type)) {
            throw new Error(`Unknown JSON manifest contract: ${type}`);
        }
        if (!this.validators.has(type)) {
            const schemaUrl = this.resources.framework(SCHEMAS[type]);
            const definition = await this.resources.json(schemaUrl);
            this.validators.set(type, this.ajv.compile(definition));
        }
        const validator = this.validators.get(type);
        if (!validator(value)) {
            const errors = validator.errors.map(error =>
                `${error.instancePath || '/'} ${error.message}`
            ).join('; ');
            throw new Error(`[CourseKit JSON Schema] ${type} at ${url}: ${errors}`);
        }
        return value;
    }
}
