/**
 * Paginate XSLT-produced visual components.
 * Page markup is created by component templates, not by this service.
 */
export class DocumentPaginator {
    constructor(root, { cover = true } = {}) {
        this.root = root;
        this.cover = cover;
        this.pages = root.querySelector('.document-pages');
        this.parts = root.querySelector('.document-parts');
        this.flow = this.parts.querySelector('.document-source');
        this.sheet = this.parts.querySelector(
            '.document-sheet:not(.document-cover):not(.document-blank)'
        );
        this.coverSheet = this.parts.querySelector('.document-cover');
        this.blank = this.parts.querySelector('.document-blank');
    }

    async paginate() {
        await document.fonts?.ready;

        await Promise.all(
            [...this.flow.querySelectorAll('img')].map(img => {
                if (img.complete) {
                    return Promise.resolve();
                }

                return new Promise(resolve => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            })
        );

        this.pages.replaceChildren();

        if (this.cover && this.coverSheet) {
            this.pages.append(this.coverSheet.cloneNode(true));

            if (this.blank) {
                this.pages.append(this.blank.cloneNode(true));
            }
        }

        let body = this.addSheet();

        for (const block of [...this.flow.children]) {
            if (block.classList.contains('ck-document-break')) {
                block.remove();

                if (body.children.length) {
                    body = this.addSheet();
                }

                continue;
            }

            body.append(block);

            if (!this.overflows(body)) {
                continue;
            }

            if (body.children.length > 1) {
                body = this.addSheet();
                body.append(block);
            }

            if (this.overflows(body) && block.classList.contains('document-section')) {
                body = this.splitSection(block, body);
            }

            if (this.overflows(body)) {
                body.closest('.document-sheet').classList.add('document-overflow');
                console.warn('[CourseKit document] Block exceeds printable area:', block);
            }
        }

        const end = this.addSheet();
        const endMarker = this.parts.querySelector('.document-end-message');

        if (endMarker) {
            end.append(endMarker.cloneNode(true));
        }

        end.closest('.document-sheet')?.classList.add('document-end-page');
        this.numberPages();
    }

    addSheet() {
        const next = this.sheet.cloneNode(true);
        const target = next.querySelector('.document-page-body');

        target.replaceChildren();
        this.pages.append(next);

        return target;
    }

    overflows(body) {
        return body.scrollHeight > body.clientHeight + 1;
    }

    splitSection(section, body) {
        let current = section;
        let content = current.querySelector(':scope > .document-section-content');

        if (!content) {
            return body;
        }

        const items = [...content.children];
        content.replaceChildren();
        let active = body;

        for (const item of items) {
            content.append(item);

            if (!this.overflows(active)) {
                continue;
            }

            if (content.children.length > 1) {
                content.removeChild(item);
            } else if (active.children.length > 1) {
                current.remove();
            } else {
                current.classList.add('document-oversized');
                continue;
            }

            active = this.addSheet();
            current = section.cloneNode(false);
            current.removeAttribute('id');
            current.classList.add('document-section-continued');
            content = content.cloneNode(false);
            current.append(content);
            active.append(current);
            content.append(item);
        }

        return active;
    }

    numberPages() {
        const sheets = [...this.pages.children];

        sheets.forEach((sheet, index) => {
            sheet.dataset.pageNumber = String(index + 1);
            const label = sheet.querySelector('.document-footer-page');

            if (label) {
                label.textContent = `Page ${index + 1} of ${sheets.length}`;
            }
        });
    }

    dispose() {}
}
