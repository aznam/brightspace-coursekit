import { JSONPreprocessor } from './json-preprocessor.js';

/** Owns site-level configuration, inherited framework resources and course resources. */
export class ConfigManager {
    constructor(resources) {
        this.resources = resources;
        this.data = null;
        this.registered = new Map();
    }

    async init(path) {
        const url = this.resources.course(path);
        this.data = await this.resources.json(url);
        await this.resources.manifestValidator.validate('course', this.data, url);
        if (!Array.isArray(this.data.modules || [])) {
            throw new Error('course.modules must be an ordered array');
        }
        this.resources.configure(this.data);
        this.data = new JSONPreprocessor(this.resources).process(this.data, url);
        this.registered.clear();
    }

    /** Register a runtime variable without modifying course.json. */
    register(path, value) {
        if (typeof path !== 'string' || !path.trim() ||
            path.split('.').some(part => !part.trim())) {
            throw new Error('Variable path must be a non-empty dot-separated string');
        }
        const key = path.trim();
        if (this.registered.has(key)) {
            throw new Error(`Variable already registered: ${key}`);
        }
        // Existing configuration remains authoritative: no ambiguous shadowing.
        const parts = key.split('.');
        if (parts.some(part => ['__proto__', 'prototype', 'constructor'].includes(part))) {
            throw new Error(`Unsafe variable path: ${key}`);
        }
        const existing = this._getConfig(key);
        if (existing !== undefined) {
            throw new Error(`Variable conflicts with course configuration: ${key}`);
        }
        for (const registered of this.registered.keys()) {
            if (registered.startsWith(`${key}.`) || key.startsWith(`${registered}.`)) {
                throw new Error(`Variable namespace conflict: ${key} and ${registered}`);
            }
        }
        this.registered.set(key, value);
    }

    /** Register a JSON object as one namespace (e.g. assignment.*). */
    registerNamespace(namespace, data) {
        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('Registered namespace data must be a JSON object');
        }
        this.register(namespace, data);
    }

    _getConfig(path) {
        let value = { ...this.data, course: this.data?.course || {} };
        for (const part of path.split('.')) value = value?.[part];
        return value;
    }

    get(path, fallback = '') {
        if (typeof path !== 'string' || !path) return fallback;
        // Resolve the longest registered prefix, supporting nested JSON properties.
        let value;
        let matchLength = -1;
        for (const [key, root] of this.registered) {
            if (path === key || path.startsWith(`${key}.`)) {
                if (key.length > matchLength) {
                    value = root;
                    const remainder = path === key ? [] : path.slice(key.length + 1).split('.');
                    for (const part of remainder) {
                        if (['__proto__', 'prototype', 'constructor'].includes(part)) return fallback;
                        value = value?.[part];
                    }
                    matchLength = key.length;
                }
            }
        }
        if (matchLength >= 0) return value ?? fallback;
        return this._getConfig(path) ?? fallback;
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
