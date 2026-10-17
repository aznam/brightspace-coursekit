import { resolvePalettes, auditPalettes } from './theme-palette.js';
import { BreakpointResolver } from './breakpoint-resolver.js';
export class StyleLoader {
    constructor(resources) {
        this.resources = resources;
        this.loaded = new Set();
        this.media = null;
        this.mode = 'auto';
        this.currentMode = null;
        this.control = null;
        this.paletteKeys = new Set();
        this.breakpoints = null;
    }
    async initBreakpoints(url) {
        this.breakpoints = new BreakpointResolver(await this.resources.json(url));
    }
    async load(urls = []) { for (const url of urls) await this.loadUrl(url); }
    async loadUrl(url) {
        if (this.loaded.has(url)) return;
        // Third-party stylesheets (e.g., Google Fonts) remain native links.
        // Only same-origin CourseKit stylesheets are transformed.
        if (new URL(url, document.baseURI).origin !== location.origin) {
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = url;
            document.head.appendChild(link);
            this.loaded.add(url);
            return;
        }
        if (!this.breakpoints) {
            throw new Error('CourseKit breakpoints must be initialized before loading styles');
        }
        const css = await this.resources.text(url);
        const transformed = this.breakpoints.transform(css, url);
        // Inline CSS resolves relative url()/@import against the page, not the original file.
        // Rewrite those URLs relative to their source stylesheet before injection.
        const absolute = path => new URL(path, url).href;
        const rewritten = transformed
            .replace(/url\(\s*(["']?)([^)'"\s]+)\1\s*\)/gi, (match, quote, path) =>
                /^(?:data:|blob:|#)/i.test(path) ? match : `url("${absolute(path)}")`)
            .replace(/@import\s+(["'])([^"']+)\1/gi, (match, quote, path) =>
                `@import ${quote}${absolute(path)}${quote}`);
        const style = document.createElement('style');
        style.dataset.ckStyleSource = url;
        style.textContent = rewritten;
        document.head.appendChild(style);
        this.loaded.add(url);
    }
    applyTheme(theme = {}) {
        this.palettes = resolvePalettes(theme);
        this.checkContrasts();
        if (this.media && this.onSystemChange) {
            this.media.removeEventListener?.('change', this.onSystemChange);
            this.media.removeListener?.(this.onSystemChange);
        }
        this.media = window.matchMedia?.('(prefers-color-scheme: dark)') || null;
        this.onSystemChange = () => { if (this.mode === 'auto') this.render(); };
        if (this.media?.addEventListener) this.media.addEventListener('change', this.onSystemChange);
        else this.media?.addListener?.(this.onSystemChange);
        const siteMode = ['auto', 'light', 'dark'].includes(theme.mode) ? theme.mode : 'auto';
        let saved = null;
        try { saved = localStorage.getItem(STORAGE); } catch { /* Optional persistence. */ }
        this.mode = ['auto', 'light', 'dark'].includes(saved) ? saved : siteMode;
        this.render();
        if (theme.fontFamily) document.documentElement.style.setProperty('--ck-font-body', theme.fontFamily);
        this.createControl();
    }
    resolvedMode() { return this.mode === 'auto' ? (this.media?.matches ? 'dark' : 'light') : this.mode; }
    render() {
        const current = this.resolvedMode();
        this.currentMode = current;
        const element = document.documentElement;
        element.dataset.ckTheme = current;
        element.style.colorScheme = current;
        for (const key of this.paletteKeys) element.style.removeProperty(`--ck-${key}`);
        this.paletteKeys.clear();
        for (const [key, value] of Object.entries(this.palettes[current])) {
            if (!/^[-a-z0-9]+$/.test(key) || typeof value !== 'string') continue;
            element.style.setProperty(`--ck-${key}`, value);
            this.paletteKeys.add(key);
        }
        this.updateControl();
    }
    setMode(mode) {
        if (!['auto', 'light', 'dark'].includes(mode)) return;
        this.mode = mode;
        try { localStorage.setItem(STORAGE, mode); } catch { /* no persistence */ }
        this.render();
    }
    createControl() {
        if (this.control) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ck-theme-control';
        button.addEventListener('click', () => {
            const modes = ['auto', 'light', 'dark'];
            this.setMode(modes[(modes.indexOf(this.mode) + 1) % modes.length]);
        });
        document.body.appendChild(button);
        this.control = button;
        this.updateControl();
    }
    updateControl() {
        if (!this.control) return;
        const labels = { auto: 'Auto', light: 'Day', dark: 'Night' };
        const next = { auto: 'light', light: 'dark', dark: 'auto' }[this.mode];
        this.control.textContent = `◐ ${labels[this.mode]}`;
        this.control.setAttribute('aria-label', `Color theme: ${labels[this.mode]}. Switch to ${labels[next]}.`);
        this.control.title = `Theme: ${labels[this.mode]} (${this.currentMode})`;
    }
    checkContrasts() {
        for (const issue of auditPalettes(this.palettes)) {
            const ratio = issue.ratio === null ? 'unknown' : issue.ratio.toFixed(2) + ':1';
            console.warn(`[CourseKit] ${issue.mode} palette: ${issue.fg}/${issue.bg} contrast ${ratio} (reference ${issue.minimum}:1). Check actual component usage; site overrides are preserved.`);
        }
    }
}
