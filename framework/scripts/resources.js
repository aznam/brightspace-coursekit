/** Resource resolution shared by the framework, course and modules. */
export class ResourceLoader {
    constructor(frameworkRoot, courseRoot) {
        this.frameworkRoot = new URL(frameworkRoot);
        this.initialCourseRoot = new URL(courseRoot);
        this.courseRoot = new URL(courseRoot);
        this.paths = {};
        this.customPaths = {};
        this.cache = new Map();
    }

    configure(course = {}) {
        const id = course.siteId;
        this.courseRoot = id != null && String(id).trim() !== '' &&
            window.location.pathname.startsWith('/content/enforced/')
            ? new URL(`/content/enforced/${String(id).replace(/^\/+|\/+$/g, '')}/`, window.location.origin)
            : this.initialCourseRoot;

        const mergedPaths = {
            assets: 'assets/',
            attachments: 'attachments/',
            content: 'content/',
            styles: 'styles/',
            scripts: 'scripts/',
            fonts: 'fonts/',
            schemas: 'schemas/',
            ...(course.paths || {}),
            ...(course.customPaths || {})
        };

        this.customPaths = {};
        
        // On boucle pour s'assurer que chaque chemin finit bien par un slash (sauf s'il est vide)
        for (const [key, value] of Object.entries(mergedPaths)) {
            if (value && typeof value === 'string' && !value.endsWith('/')) {
                this.customPaths[key] = value + '/';
            } else {
                this.customPaths[key] = value || '';
            }
        }
    }

    framework(path) {
        return new URL(path, this.frameworkRoot).href;
    }

    course(path) {
        return new URL(path, this.courseRoot).href;
    }

    relative(path, manifestUrl) {
        return new URL(path, manifestUrl).href;
    }

    async text(url) {
        if (!this.cache.has(url)) {
            this.cache.set(url, fetch(url, { credentials: 'same-origin' }).then(async response => {
                if (!response.ok) {
                    throw new Error(`Missing resource (${response.status}): ${url}`);
                }
                return response.text();
            }));
        }
        return this.cache.get(url);
    }

    async json(url) {
        try {
            return JSON.parse(await this.text(url));
        } catch (error) {
            throw new Error(`Invalid JSON ${url}: ${error.message}`);
        }
    }

    async verify(url) {
        await this.text(url);
        return url;
    }

    static isExplicit(path) {
        return /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(path);
    }

    directory(kind) {
        if (kind === 'content') return this.courseRoot.href;
        if (kind === 'schemas') return new URL('schemas/', this.courseRoot).href;
        const standard = ['assets', 'attachments', 'styles', 'scripts', 'fonts'];
        if (!standard.includes(kind)) throw new Error(`Unknown resource type: ${kind}`);
        const folder = ['styles', 'scripts', 'fonts'].includes(kind)
            ? this.customPaths[kind] || `${kind}/`
            : this.paths[kind] || `${kind}/`;
        const resolved = new URL(folder, this.courseRoot);
        if (!resolved.pathname.endsWith('/')) resolved.pathname += '/';
        return resolved.href;
    }

    candidates(path, kind = 'assets', options = {}) {
        if (!path || typeof path !== 'string') throw new Error(`Missing ${kind} resource path`);
        if (ResourceLoader.isExplicit(path)) return [new URL(path, document.baseURI).href];
        const result = [];
        let dir = this.customPaths[kind] || `${kind}/`;
        if (!dir.endsWith('/')) dir += '/';
        const cleanPath = path.replace(/^\/+/, '');
        result.push(new URL(cleanPath, document.baseURI).href);
        result.push(new URL(dir + cleanPath, document.baseURI).href);
        result.push(new URL(cleanPath, this.courseRoot).href);
        result.push(new URL(dir + cleanPath, this.courseRoot).href);
        result.push(new URL(cleanPath, this.frameworkRoot).href);
        result.push(new URL(dir + cleanPath, this.frameworkRoot).href);
        if (options.frameworkPath) {
            result.push(this.framework(options.frameworkPath));
        }
        return [...new Set(result)];
    }

    async exists(url) {
        const check = async method => fetch(url, {
            method,
            credentials: 'same-origin',
            cache: 'no-store'
        });
        let response = await check('HEAD');
        if (response.ok) return true;
        if (response.status === 404) return false;
        if (response.status === 405 || response.status === 501) {
            response = await check('GET');
            if (response.ok) return true;
            if (response.status === 404) return false;
        }
        throw new Error(`Unable to check resource ${url} (HTTP ${response.status})`);
    }

    async resolve(path, kind = 'assets', options = {}) {
        const candidates = this.candidates(path, kind, options);
        if (/^(?:data:|blob:)/i.test(path)) return candidates[0];
        if (/^(?:https?:)/i.test(path) &&
            new URL(path, document.baseURI).origin !== new URL(document.baseURI).origin) {
            return candidates[0];
        }
        for (const url of candidates) {
            if (await this.exists(url)) return url;
        }
        throw new Error(`Cannot find ${kind}: ${path} (checked ${candidates.join(', ')})`);
    }

    /** Explicit framework/module sources have one authoritative location. */
    async asset(path, kind = 'assets', location = 'course') {
        if (!path) return '';
        if (ResourceLoader.isExplicit(path) || path.startsWith('#')) return path;
        if (location === 'framework') {
            const url = this.framework(path.includes('/') ? path : `${kind}/${path}`);
            await this.verify(url);
            return url;
        }
        return this.resolve(path, kind);
    }
}
