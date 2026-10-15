import { Renderer } from '../../scripts/renderer.js';

export default class InfoboxRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();
        
        const iconName = this.xml.getAttribute('icon') || this.xml.getAttribute('variant') || 'info';
        const customIcon = this.settings.get('icons.' + iconName);
        const icon = this.element.querySelector('.ck-infobox__icon');
        
        if (icon && customIcon?.type === 'text') {
            icon.textContent = customIcon.value || '';
        }
    }
}