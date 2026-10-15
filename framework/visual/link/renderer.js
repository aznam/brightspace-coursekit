import { Renderer } from '../../scripts/renderer.js';

export default class LinkRenderer extends Renderer {
    
    async applyAttributes() {
        await super.applyAttributes();
        
        const el = this.element;
        el.href = this.xml.getAttribute('href') || '#';
        
        this.links.apply(el, this.xml.getAttribute('target'));
    }
    
}