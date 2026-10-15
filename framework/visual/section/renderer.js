import { Renderer } from '../../scripts/renderer.js';

export default class SectionRenderer extends Renderer {
    
    async applyAttributes() {
        await super.applyAttributes();
        
        let depth = 1;
        let parent = this.xml.parentNode;
        while (parent && parent.nodeType === 1 /* Element */) {
            if (parent.localName === 'section') {
                depth++;
            }
            parent = parent.parentNode;
        }
        
        this.element.dataset.level = depth;
        
        const titleEl = this.element.querySelector('.ck-section__title');
        if (titleEl) {
            const headingLevel = Math.min(6, depth + 1);
            if (headingLevel !== 2) {
                const newTitle = document.createElement(`h${headingLevel}`);
                newTitle.className = titleEl.className;
                newTitle.innerHTML = titleEl.innerHTML;
                titleEl.replaceWith(newTitle);
            }
        }
    }
    
}