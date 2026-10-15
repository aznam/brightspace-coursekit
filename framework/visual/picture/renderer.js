import { Renderer } from '../../scripts/renderer.js';

export default class PictureRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();
        
        const img = this.element.querySelector('img');
        img.src = await this.resources.asset(this.xml.getAttribute('src'));
        img.alt = this.xml.getAttribute('alt') || '';
        img.loading = this.xml.getAttribute('loading') || 'lazy';
        
        const width = this.xml.getAttribute('width') || 'full';
        this.element.dataset.width = width;
        
        const hasLegend = this.xml.hasAttribute('legend');
        this.element.dataset.kind = hasLegend ? 'with-legend' : 'without-legend';
    }
}