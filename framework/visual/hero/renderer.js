import { Renderer } from '../../scripts/renderer.js';

export default class HeroRenderer extends Renderer {
    
    async applyStyles() {
        await super.applyStyles(); 
        
        const imageRef = this.xml.getAttribute('image');
        if (imageRef) {
            const resolvedUrl = await this.resources.asset(imageRef);
            this.element.setAttribute('style', `--ck-hero-image: url("${resolvedUrl}")`);
        }
    }
}