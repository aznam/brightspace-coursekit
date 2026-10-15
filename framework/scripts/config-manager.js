/** Owns site-level configuration, inherited framework resources and course resources. */
export class ConfigManager {
    constructor(resources) {
        this.resources = resources;
        this.data = null;
    }
    async init(path) {
        const url = this.resources.course(path);
        this.data = await this.resources.json(url);
        await this.resources.manifestValidator.validate('course', this.data, url);
        if (!Array.isArray(this.data.modules || [])) {
            throw new Error('course.modules must be an ordered array');
        }
        this.resources.configure(this.data);
    }
    get(path, fallback = '') {
        let value = { ...this.data, course: this.data.course || {} };
        for (const part of path.split('.'))
            value = value?.[part];
        return value ?? fallback;
    }
    interpolate(text) {
        return String(text).replace(/\$\{([^{}]+)\}/g, (_, key) => String(this.get(key.trim(), '')));
    }
    variables(xml) {
        const walker = xml.createTreeWalker(xml, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = this.interpolate(node.textContent);
            }
            else {
                for (const attribute of [...node.attributes]) {
                    attribute.value = this.interpolate(attribute.value);
                }
            }
        }
        return xml;
    }
}
