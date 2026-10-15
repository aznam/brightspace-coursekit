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
}