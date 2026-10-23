import { Renderer } from '../../../../scripts/renderer.js';
import { DocumentPaginator } from '../../scripts/document-paginator.js';

export default class DocumentLayoutRenderer extends Renderer {
    async postMounted() {
        this.paginator = new DocumentPaginator(this.element, {
            cover: this.xml.getAttribute('cover') !== 'false'
        });
        await this.paginator.paginate();
    }

    async setBehavior() {
        const dispose = await super.setBehavior();
        const print = this.element.querySelector('.document-print');
        const onPrint = () => window.print();
        print?.addEventListener('click', onPrint);
        return () => {
            print?.removeEventListener('click', onPrint);
            this.paginator?.dispose();
            dispose?.();
        };
    }
}
