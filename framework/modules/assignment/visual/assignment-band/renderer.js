import { Renderer } from '../../../../scripts/renderer.js';

export default class AssignmentBandRenderer extends Renderer {
    async applyAttributes() {
        await super.applyAttributes();

        for (const slot of this.element.querySelectorAll('.aband-icon[data-icon]')) {
            const name = slot.getAttribute('data-icon');
            if (this.icons.apply(slot, name, 'assignment-band')) {
                slot.hidden = false;
            }
        }
    }

    #parseDate(value, field) {
        if (!value) return null;

        const date = Date.parse(value);
        if (!Number.isFinite(date)) {
            throw new Error(`Invalid ${field}: ${value}`);
        }

        return date;
    }

    #formatDate(value, time = false) {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(time ? { hour: 'numeric', minute: '2-digit' } : {})
        }).format(new Date(value));
    }

    async rendered() {
        const attr = name => this.xml.getAttribute(name) || '';
        const originalDue = this.#parseDate(attr('deadline-at'), 'deadline-at');
        const extendedDue = this.#parseDate(attr('deadline-extension-at'), 'deadline-extension-at');

        const invalidExtension = extendedDue != null && originalDue != null && extendedDue < originalDue;

        for (const node of this.element.querySelectorAll('[data-date]')) {
            const field = node.getAttribute('data-date');
            const value = this.#parseDate(attr(field), field);
            if (field === 'deadline-extension-at' && invalidExtension) {
                node.textContent = 'Invalid extension date';
            } else {
                node.textContent = value == null ? 'null' : this.#formatDate(value, field !== 'open');
            }
        }

        if (invalidExtension) {
            this.element.querySelector('[data-date="deadline-at"]')?.classList.remove('aband-struck');
        }
    }
}
