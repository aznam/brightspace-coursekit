import { Renderer } from '../../../../scripts/renderer.js';

export default class AssistantCardRenderer extends Renderer {
    async build() {
        await super.build();
        const detail = [...this.xml.children].find(node => node.localName === 'person-description');
        const container = this.element.querySelector('.ck-assistant-card__drawer-body');
        if (detail && container) {
            for (const child of [...detail.childNodes]) {
                container.append(await this.renderChild(child));
            }
        }
    }

    async applyAttributes() {
        await super.applyAttributes();
        const photo = this.xml.getAttribute('photo');
        const img = this.element.querySelector('.ck-assistant-card__photo img');
        if (photo && img) img.src = await this.resources.asset(photo);
        const detail = [...this.xml.children].find(node => node.localName === 'person-description');
        const bg = detail?.getAttribute('background');
        const drawer = this.element.querySelector('.ck-assistant-card__drawer');
        if (bg && drawer) {
            const url = await this.resources.asset(bg);
            drawer.style.setProperty('--ck-assistant-drawer-image', `url(${JSON.stringify(url)})`);
        }
    }

}
