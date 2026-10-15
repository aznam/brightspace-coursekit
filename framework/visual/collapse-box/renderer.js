import { Renderer } from '../../scripts/renderer.js';

export default class CollapseBoxRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();
        
        if (this.xml.getAttribute('open') === 'true') {
            this.element.open = true;
        }

        const summary = this.element.querySelector('summary');
        if (!summary.textContent.trim()) {
            summary.textContent = 'Details';
        }
    }
}