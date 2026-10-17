/** CourseKit named media queries. Global references are min-width thresholds.
 * Component-local @custom-media declarations can use any valid media condition.
 * This is a targeted resolver, not a general-purpose CSS preprocessor.
 */
const NAME = /^--ck-bp-[a-z][a-z0-9-]*$/;
const LENGTH = /^(?:\d+(?:\.\d+)?|\.\d+)(?:rem|em|px)$/;
const DECLARATION = /@custom-media\s+(--ck-bp-[a-z][a-z0-9-]*)\s+([^;{}]+);/g;
const REFERENCE = /\(\s*(--ck-bp-[a-z][a-z0-9-]*)\s*\)/g;

export class BreakpointResolver {
    constructor(breakpoints) {
        if (!breakpoints || typeof breakpoints !== 'object' || Array.isArray(breakpoints)) {
            throw new Error('Invalid CourseKit breakpoint registry');
        }
        this.global = new Map();
        for (const [key, width] of Object.entries(breakpoints)) {
            const name = `--ck-bp-${key}`;
            if (!NAME.test(name) || typeof width !== 'string' || !LENGTH.test(width)) {
                throw new Error(`Invalid CourseKit breakpoint: ${key}`);
            }
            this.global.set(name, `(min-width: ${width})`);
        }
    }

    transform(source, url) {
        const definitions = new Map(this.global);
        // Declarations are stylesheet-local, never shared between components.
        let css = source.replace(DECLARATION, (_all, name, query) => {
            if (definitions.has(name)) throw new Error(`Duplicate breakpoint ${name} in ${url}`);
            definitions.set(name, query.trim());
            return '';
        });
        const expand = (name, stack = []) => {
            if (!definitions.has(name)) throw new Error(`Unknown named breakpoint ${name} in ${url}`);
            if (stack.includes(name)) throw new Error(`Circular named breakpoint ${[...stack, name].join(' -> ')} in ${url}`);
            return definitions.get(name).replace(REFERENCE, (_match, nested) => expand(nested, [...stack, name]));
        };
        // Only @media conditions are transformed; normal declarations and strings are left alone.
        css = css.replace(/@media\s+([^{};]+)\{/g, (full, condition) => {
            const resolved = condition.replace(REFERENCE, (_match, name) => expand(name));
            return `@media ${resolved}{`;
        });
        // Catch unsupported or misspelled definitions instead of silently ignoring them.
        if (/@custom-media\b/.test(css)) {
            throw new Error(`Unsupported @custom-media declaration in ${url}`);
        }
        return css;
    }
}
