/** Loads course and framework font declarations. A font source is not a renderer. */
export class FontLoader {
    constructor(resources, styleLoader) {
        this.resources = resources;
        this.styleLoader = styleLoader;
        this.loaded = new Set();
    }
    async load(fonts = [], origin = null) {
        for (const font of fonts) {
            if (!font || !font.family)
                throw new Error('Font definition requires family');
            if (font.source === 'online') {
                if (!font.url)
                    throw new Error(`Online font ${font.family} requires url`);
                await this.styleLoader.loadUrl(font.url);
            }
            else if (font.source === 'local') {
                const definitions = font.files || (font.src ? [{ file: font.src, weight: font.weight, style: font.style }] : []);
                if (!definitions.length)
                    throw new Error(`Local font ${font.family} requires files`);
                for (const file of definitions) {
                    const url = origin && !font.location
                        ? this.resources.relative(file.file, origin)
                        : await this.resources.asset(file.file, 'fonts', font.location || 'course');
                    const key = [font.family, url, file.weight, file.style].join('|');
                    if (this.loaded.has(key))
                        continue;
                    const face = new FontFace(font.family, `url("${url}")`, {
                        weight: String(file.weight || '400'),
                        style: file.style || 'normal'
                    });
                    await face.load();
                    document.fonts.add(face);
                    this.loaded.add(key);
                }
            }
            else {
                throw new Error(`Unknown font source: ${font.source}`);
            }
            if (font.cssVariable) {
                if (!/^--[A-Za-z0-9_-]+$/.test(font.cssVariable))
                    throw new Error('Invalid font CSS variable');
                document.documentElement.style.setProperty(font.cssVariable, `"${String(font.family).replace(/["\\]/g, '')}", ${font.fallback || 'sans-serif'}`);
            }
        }
    }
}
