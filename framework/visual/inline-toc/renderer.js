import { Renderer } from '../../scripts/renderer.js';

export default class InlineTocRenderer extends Renderer {
    
    async rendered() {

        const links = Array.from(this.element.querySelectorAll('a'));
        
        for (let i = 1; i < links.length; i++) {
            const sep = document.createElement('span');
            sep.className = 'ck-inline-toc__separator';
            sep.textContent = '•';
            this.element.insertBefore(sep, links[i]);
        }
    }
    
}