// WARNING: Adjust the relative path to renderer.js depending on your folder depth!
import { Renderer } from 'framework/scripts/renderer.js';

export default class CustomComponentRenderer extends Renderer {
    
    async applyAttributes() {
        // ALWAYS call super to handle id, variant, and style-ref automatically
        await super.applyAttributes();
        
        // Example: Map custom XML attributes to HTML DOM elements
        /*
        const myAttr = this.xml.getAttribute('custom-attr');
        if (myAttr) {
            this.element.setAttribute('data-custom', myAttr);
        }
        */
    }
}