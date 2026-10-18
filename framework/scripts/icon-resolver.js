/**
 * CourseKit — Central icon resolver.
 * Resolves logical icon identifiers to site-configured representations.
 * Does not load vendor assets or own component-specific geometry.
 */
export class IconResolver {
    constructor(settings) {
        this.settings = settings;
    }

    resolve(name, component = '') {
        if (!name || name === 'none') return null;
        const icons = this.settings.get('icons', {});
        const scoped = component ? icons[`${component}.${name}`] : undefined;
        const definition = scoped ?? icons[name];
        if (definition == null) return null;
        if (!definition || typeof definition !== 'object') return null;
        return definition;
    }

    /** Replaces an icon's presentation; returns false if no site override exists. */
    apply(element, name, component = '') {
        if (!element) return false;
        const definition = this.resolve(name, component);
        if (!definition) return false;

        let content;
        if (definition.type === 'text') {
            content = document.createTextNode(definition.value);
        } else if (definition.type === 'font') {
            const glyph = document.createElement('span');
            // Classes are site configuration, not untrusted HTML markup.
            glyph.className = definition.classes.join(' ');
            glyph.setAttribute('aria-hidden', 'true');
            content = glyph;
        } else {
            return false;
        }

        element.replaceChildren(content);
        return true;
    }
}
