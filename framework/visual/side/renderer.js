import { Renderer } from '../../scripts/renderer.js';

export default class SideRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();
        
        // Appliquer le positionnement data-position (before ou after) pour le CSS Grid
        const pos = this.xml.getAttribute('position') || 'before';
        this.element.dataset.position = pos;
    }
}