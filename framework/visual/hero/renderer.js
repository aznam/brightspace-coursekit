import { Renderer } from '../../scripts/renderer.js';

export default class HeroRenderer extends Renderer {
    async applyStyles() {
        await super.applyStyles();

        const imageRef = this.xml.getAttribute('image');
        if (imageRef) {
            const resolvedUrl = await this.resources.asset(imageRef);
            this.element.style.setProperty('--ck-hero-image', `url("${resolvedUrl}")`);
        }
    }

    async onMessage({ type, payload }) {
        if (type !== 'layout:grid-boundary' || !Number.isFinite(payload?.top)) return;
        this._gridBoundaryTop = payload.top;
        this._fitContent();
        // A grid boundary intended for this Hero does not concern its descendants.
        return false;
    }

    async postMounted() {
        this._inner = this.element.querySelector('.ck-hero__inner');
        this._title = this.element.querySelector('.ck-hero__title');
        this._subtitle = this.element.querySelector('.ck-hero__subtitle');
        if (!this._inner) return;

        // Layout and text measurements also change with fonts and container width.
        this._heroObserver = new ResizeObserver(() => this._scheduleFit());
        this._heroObserver.observe(this.element);
        this._heroObserver.observe(this._inner);
        this._scheduleFit();
        void document.fonts?.ready.then(() => this._scheduleFit());
    }

    _scheduleFit() {
        if (this._heroFrame != null) return;
        this._heroFrame = requestAnimationFrame(() => {
            this._heroFrame = null;
            if (this.element.isConnected) this._fitContent();
        });
    }

    _fitContent() {
        if (!this._inner) return;
        const hero = this.element;
        const root = document.documentElement;
        const s = hero.style;
        const rect = hero.getBoundingClientRect();
        const overlap = Number.isFinite(this._gridBoundaryTop)
            ? Math.max(0, Math.min(rect.height, rect.bottom - this._gridBoundaryTop))
            : 0;

        // This is an observed geometric inset, NOT a named layout token.
        // Use rem for CSS spacing as prescribed by CONVENTIONS.md.
        const remPx = parseFloat(getComputedStyle(root).fontSize);
        if (!(remPx > 0)) return;
        const overlapRem = `${overlap / remPx}rem`;
        if (s.getPropertyValue('--ck-hero-internal-obstructed-end') !== overlapRem) {
            s.setProperty('--ck-hero-internal-obstructed-end', overlapRem);
        }

        // Measure unscaled component typography. The public font tokens remain
        // authoritative upper bounds; only the private runtime variables shrink.
        s.removeProperty('--ck-hero-internal-runtime-title-size');
        s.removeProperty('--ck-hero-internal-runtime-subtitle-size');
        const titleBase = this._title ? parseFloat(getComputedStyle(this._title).fontSize) : 0;
        const subtitleBase = this._subtitle ? parseFloat(getComputedStyle(this._subtitle).fontSize) : 0;
        const style = getComputedStyle(hero);
        const verticalPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const available = Math.max(0, hero.clientHeight - verticalPadding);
        const minimumTitle = parseFloat(getComputedStyle(root).getPropertyValue('--ck-font-body-size')) * remPx || remPx;
        const minimumSubtitle = parseFloat(getComputedStyle(root).getPropertyValue('--ck-font-footnote')) * remPx || remPx * 0.75;

        const fits = (ratio) => {
            if (this._title) s.setProperty('--ck-hero-internal-runtime-title-size', `${Math.max(Math.min(titleBase, minimumTitle), titleBase * ratio) / remPx}rem`);
            if (this._subtitle) s.setProperty('--ck-hero-internal-runtime-subtitle-size', `${Math.max(Math.min(subtitleBase, minimumSubtitle), subtitleBase * ratio) / remPx}rem`);
            return this._inner.getBoundingClientRect().height <= available + 0.5;
        };

        if (!fits(1)) {
            // Monotonic fit: smallest feasible font sizes preserve readability
            // floors; no arbitrary scaling coefficient or hardcoded viewport size.
            let lo = 0, hi = 1;
            if (fits(lo)) {
                for (let i = 0; i < 16; i++) {
                    const mid = (lo + hi) / 2;
                    if (fits(mid)) lo = mid;
                    else hi = mid;
                }
                fits(lo);
            }
            // If the minimum accessible sizes do not fit, the Hero keeps them;
            // it never shrinks below the component's typography floor.
        } else {
            s.removeProperty('--ck-hero-internal-runtime-title-size');
            s.removeProperty('--ck-hero-internal-runtime-subtitle-size');
        }
    }

    async setBehavior() {
        const dispose = await super.setBehavior();
        return () => {
            this._heroObserver?.disconnect();
            if (this._heroFrame != null) cancelAnimationFrame(this._heroFrame);
            dispose?.();
        };
    }
}
