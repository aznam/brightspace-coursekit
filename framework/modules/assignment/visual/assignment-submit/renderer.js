import { Renderer } from '../../../../scripts/renderer.js';

export default class AssignmentSubmitRenderer extends Renderer {
    async rendered() {
        await super.rendered();

        const button = this.element.querySelector('.ck-assignment-submit__button');
        if (!button) return;

        const url = this.xml.getAttribute('submission-url');
        button.dataset.submissionUrl = url ? this.resources.expand(url) : '';
    }
}
