import { transform } from './xml.js';

/** 
 * Renderer contract & Template Method. 
 */
export class Renderer {
    constructor(context) {
        Object.assign(this, context);
        this.element = null;
        this.parentRenderer = null;
        this.childRenderers = [];

        this.supportsDefaultAttributes = true;
        this.supportsDefaultStyles = true;
        this.supportsDefaultScripts = true; 
        this.supportsBehaviorOverride = true; 
    }

    async render() {
        await this.build();          
        await this.applyAttributes(); 
        await this.applyStyles();     
        await this.applyScripts();    
        
        return this.element;
    }

    async build() {
        const input = document.implementation.createDocument(
            this.xml.namespaceURI,
            this.xml.nodeName,
            null
        );

        input.replaceChild(
            input.importNode(this.xml, true),
            input.documentElement
        );

        const processor = new XSLTProcessor();
        processor.importStylesheet(this.manifest.templateDoc);

        for (const [name, value] of this.variables || []) {
            processor.setParameter(null, name, value);
        }

        const rendered = processor.transformToDocument(input);
        this.element = document.importNode(rendered.documentElement, true);

        for (const slot of [
            ...this.element.querySelectorAll('ck-children,ck-slot')
        ]) {
            const nodes = document.createDocumentFragment();

            for (const child of [...this.xml.childNodes]) {
                if (
                    slot.localName === 'ck-slot' &&
                    child.localName !== slot.getAttribute('name')
                ) continue;

                if (
                    slot.localName === 'ck-children' &&
                    this.xml.localName === 'layout' &&
                    ['central-content', 'sidebar-before', 'sidebar-after']
                        .includes(child.localName)
                ) continue;

                nodes.append(await this.renderChild(child));
            }

            slot.replaceWith(nodes);
        }
    }

    async applyAttributes() {
        if (this.supportsDefaultAttributes && this.xml.hasAttribute('id')) {
            this.element.id = this.xml.getAttribute('id');
        }
    }

    async applyStyles() {
        if (this.supportsDefaultStyles) {
            if (this.xml.hasAttribute('variant')) {
                this.element.setAttribute('data-variant', this.xml.getAttribute('variant'));
            }
            if (this.xml.hasAttribute('style-ref')) {
                this.element.setAttribute('data-style-ref', this.xml.getAttribute('style-ref'));
            }
        }
    }

    async applyScripts() {
        if (this.supportsDefaultScripts) {
            const initRef = this.xml.getAttribute('init-ref');
            if (initRef) {
                const initFunction = window.CourseKitBehaviors?.[initRef];
                if (typeof initFunction === 'function') await initFunction(this.element, this.xml);
            }
        }
    }

    async rendered() {}

    async mounted() {}

    /**
     * Called once, after every renderer in the visual tree has completed
     * mounted() and setBehavior(). DOM measurements are safe here.
     * Override this to initiate messages after initialization.
     */
    async postMounted() {}

    /**
     * Receive a message from a parent/child branch. Return false to stop
     * propagation beyond this renderer on the current branch.
     * message = { type, payload, source, direction }
     */
    async onMessage(message) {}

    /**
     * Send a message to descendants (depth-first). No renderer class names,
     * DOM selectors or CSS variables are required to address descendants.
     */
    async messageChildren(type, payload) {
        if (typeof type !== 'string' || !type) throw new TypeError('Message type must be a non-empty string');
        const message = { type, payload, source: this, direction: 'down' };
        const visit = async (renderer) => {
            const result = await renderer.onMessage(message);
            if (result === false) return;
            for (const child of renderer.childRenderers) await visit(child);
        };
        for (const child of this.childRenderers) await visit(child);
    }

    /**
     * Send a message to ancestors (nearest first). Return false from an
     * ancestor's onMessage() to stop bubbling.
     */
    async messageParents(type, payload) {
        if (typeof type !== 'string' || !type) throw new TypeError('Message type must be a non-empty string');
        const message = { type, payload, source: this, direction: 'up' };
        for (let parent = this.parentRenderer; parent; parent = parent.parentRenderer) {
            if (await parent.onMessage(message) === false) break;
        }
    }

    async setBehavior() {

        const behaviorRef = this.xml.getAttribute('behavior-ref');
        
        if (this.supportsBehaviorOverride && behaviorRef) {
            const overrideFn = window.CourseKitBehaviors?.[behaviorRef];
            if (typeof overrideFn === 'function') {
                return await overrideFn(this.element, this.xml);
            }
        }
        
        const disposers = [];
        for (const behavior of this.componentBehaviors || []) {
            const dispose = await behavior(this.element, this.xml);
            if (typeof dispose === 'function') disposers.push(dispose);
        }
        return () => disposers.forEach(d => d());
    }
}
