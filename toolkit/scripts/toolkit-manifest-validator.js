/** Toolkit-owned manifest contracts; CourseKit contracts remain with the framework. */
export class ToolkitManifestValidator {
    constructor(resources, frameworkValidator, Ajv2020, toolkitRoot) {
        this.resources = resources;
        this.frameworkValidator = frameworkValidator;
        this.toolkitRoot = new URL(toolkitRoot);
        this.ajv = new Ajv2020({ allErrors: true, strict: false });
        this.validators = new Map();
    }

    async validate(type, data, sourceUrl) {
        const contracts = {
            toolkit: 'toolkit.schema.json',
            'tool-catalog': 'tool-catalog.schema.json',
            'course-catalog': 'course-catalog.schema.json',
            tool: 'tool.schema.json'
        };
        if (!Object.hasOwn(contracts, type)) {
            return this.frameworkValidator.validate(type, data, sourceUrl);
        }
        if (!this.validators.has(type)) {
            const schemaUrl = new URL(`schemas/${contracts[type]}`, this.toolkitRoot).href;
            const schema = await this.resources.json(schemaUrl);
            this.validators.set(type, this.ajv.compile(schema));
        }
        const validate = this.validators.get(type);
        if (!validate(data)) {
            const detail = validate.errors.map(e => `${e.instancePath || '/'} ${e.message}`).join('; ');
            throw new Error(`[Toolkit JSON Schema] ${type} at ${sourceUrl}: ${detail}`);
        }
        return data;
    }
}
