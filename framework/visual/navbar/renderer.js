import { Renderer } from '../../scripts/renderer.js';

export default class NavbarRenderer extends Renderer {
    
    async applyAttributes() {
        await super.applyAttributes();

        const course = this.element.querySelector('.ck-navbar__course');
        const page = this.element.querySelector('.ck-navbar__page');
        const module = this.element.querySelector('.ck-navbar__module');

        const code = this.xml.getAttribute('course-code') || this.settings.get('course.code') || '';
        const title = this.xml.getAttribute('page-title') || this.settings.get('course.title') || '';
        const modTitle = this.xml.getAttribute('module-title') || '';

        if (code) course.textContent = code;
        else course.remove();

        if (title) page.textContent = title;
        else page.remove();

        if (modTitle) module.textContent = modTitle;
        else module.remove();
    }
    
}