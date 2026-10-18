import { Renderer } from '../../scripts/renderer.js';

export default class LayoutRenderer extends Renderer {
    async applyStyles() {
        await super.applyStyles();

        const bg = this.xml.getAttribute('background');
        const src = bg && bg !== 'theme' ? bg : this.settings.get('theme.backgroundImage');

        if (src && bg !== 'none') {
            this.element.style.backgroundImage = `url("${await this.resources.asset(src)}")`;
        } else {
            this.element.style.backgroundImage = 'none';
        }
    }

    async mounted() {
        if (!this.element.querySelector('.ck-sidebar-before')?.children.length &&
            !this.element.querySelector('.ck-sidebar-after')?.children.length) {
            this.element.classList.add('ck-layout--single');
        }
    }

    /**
     * The layout only reports the physical boundary of its own grid. It never
     * reads, selects, or changes a descendant component's private content.
     */
    async postMounted() {
        this._grid = this.element.querySelector(':scope > .ck-layout__grid');
        if (!this._grid) return;

        this._scheduleLayoutMeasure = () => {
            if (this._layoutFrame != null) return;
            this._layoutFrame = requestAnimationFrame(() => {
                this._layoutFrame = null;
                if (!this.element.isConnected || !this._grid?.isConnected) return;
                const gridTop = this._grid.getBoundingClientRect().top;
                // Descendants interpret this physical boundary for themselves.
                void this.messageChildren('layout:grid-boundary', { top: gridTop });
            });
        };

        this._layoutObserver = new ResizeObserver(this._scheduleLayoutMeasure);
        this._layoutObserver.observe(this._grid);
        this._layoutObserver.observe(this.element);
        this._windowResize = this._scheduleLayoutMeasure;
        window.addEventListener('resize', this._windowResize, { passive: true });
        this._scheduleLayoutMeasure();
        // Fonts may settle after mounted() and alter the grid position.
        void document.fonts?.ready.then(() => this._scheduleLayoutMeasure?.());
    }

    async setBehavior() {
        const dispose = await super.setBehavior();
        return () => {
            this._layoutObserver?.disconnect();
            if (this._layoutFrame != null) cancelAnimationFrame(this._layoutFrame);
            if (this._windowResize) window.removeEventListener('resize', this._windowResize);
            dispose?.();
        };
    }
}
