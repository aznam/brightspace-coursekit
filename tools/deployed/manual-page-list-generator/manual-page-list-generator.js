/** CourseKit Toolkit — manual page list with round-trip HTML import. */
const $ = id => document.getElementById(id);
const elements = {
    course: $('course-label'), count: $('page-count'), rows: $('page-results'),
    editorStatus: $('editor-status'), preview: $('preview-host'), previewStatus: $('preview-status'),
    exportStatus: $('export-status'), importDialog: $('import-dialog'),
    importSource: $('import-source'), importError: $('import-error'),
    codeDialog: $('code-dialog'), htmlOutput: $('html-output')
};
let pages = [];
let nextKey = 1;
let exporterClass = null;
let brightspaceModules = [];
let brightspaceContextClass = null;

async function discoverBrightspaceModules() {
    const status = $('discovery-status');
    const select = $('brightspace-module');
    const apply = $('populate-module');
    select.disabled = true;
    apply.disabled = true;
    status.textContent = 'Reading Brightspace navigation…';
    try {
        const workspace = window.parent.CourseKitToolkitWorkspace;
        const frameworkRoot = workspace?.toolkit?.frameworkRoot;
        if (!frameworkRoot) throw new Error('CourseKit framework path is unavailable.');
        if (!brightspaceContextClass) {
            const url = new URL('scripts/brightspace-context.js', frameworkRoot).href;
            brightspaceContextClass = (await import(url)).BrightspaceContext;
        }
        brightspaceModules = brightspaceContextClass.contentModules();
        select.replaceChildren(new Option('Select a module', ''));
        brightspaceModules.forEach((module, index) => {
            select.add(new Option(`${module.title} (${module.pages.length} pages)`, String(index)));
        });
        select.disabled = !brightspaceModules.length;
        status.textContent = brightspaceModules.length
            ? `${brightspaceModules.length} module(s) containing child topics discovered.`
            : 'No module hierarchy found in the accessible Brightspace navigation. Open the tool inside Lessons with the menu expanded.';
    } catch (error) {
        status.textContent = `Unable to discover Brightspace modules: ${error.message}`;
    }
}

$('discover-modules').addEventListener('click', discoverBrightspaceModules);
$('brightspace-module').addEventListener('change', () => {
    $('populate-module').disabled = $('brightspace-module').value === '';
});
$('populate-module').addEventListener('click', () => {
    const selection = $('brightspace-module').value;
    if (!/^\d+$/.test(selection)) return;
    const module = brightspaceModules[Number(selection)];
    if (!module) return;
    if (pages.length && !window.confirm('Replace the current page list with the selected module children?')) return;
    pages = module.pages.map(page => createPage(page.title, page.contentId));
    drawRows();
    elements.editorStatus.textContent = `${pages.length} pages imported from “${module.title}”. You can edit every row.`;
});


function currentCourse() {
    try { return window.parent.CourseKitToolkitWorkspace?.selectedCourse || null; }
    catch { return null; }
}

function paletteFor(course) {
    const theme = course?.settings?.data?.theme || {};
    const palette = { ...(theme.palette || {}), ...(theme.palettes?.light || {}) };
    const needed = ['accent', 'structure', 'border', 'text-main', 'text-dark', 'surface'];
    const missing = needed.filter(name => !palette[name] || typeof palette[name] !== 'string');
    if (missing.length) throw new Error(`Course palette missing: ${missing.join(', ')}.`);
    return palette;
}

function lessonPath(siteId, contentId) {
    if (!/^[0-9]+$/.test(contentId)) return null;
    const site = String(siteId ?? '').trim();
    if (site && !/^[0-9]+$/.test(site)) return null;
    return `/d2l/le/lessons/${site ? `${site}/` : ''}topics/${contentId}`;
}

function element(tag, text, style) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (style) node.setAttribute('style', style);
    return node;
}

function createPage(title = '', contentId = '') {
    return { key: nextKey++, title, contentId };
}

function drawRows(focusKey = null) {
    elements.count.textContent = String(pages.length);
    elements.rows.replaceChildren();
    for (const [index, page] of pages.entries()) {
        const row = element('div');
        row.className = 'page-row';
        const titleField = element('div');
        titleField.className = 'field';
        const titleLabel = element('label', 'Page title');
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = page.title;
        titleInput.placeholder = 'Page title';
        titleInput.id = `page-title-${page.key}`;
        titleLabel.htmlFor = titleInput.id;
        titleInput.addEventListener('input', () => { page.title = titleInput.value; drawPreview(); });
        titleField.append(titleLabel, titleInput);
        const idField = element('div');
        idField.className = 'field';
        const idLabel = element('label', 'Content ID');
        const idInput = document.createElement('input');
        idInput.type = 'text';
        idInput.inputMode = 'numeric';
        idInput.value = page.contentId;
        idInput.placeholder = 'Numeric Brightspace topic ID';
        idInput.id = `page-id-${page.key}`;
        idLabel.htmlFor = idInput.id;
        idInput.addEventListener('input', () => {
            page.contentId = idInput.value.trim();
            idInput.setAttribute('aria-invalid', String(Boolean(page.contentId && !/^[0-9]+$/.test(page.contentId))));
            drawPreview();
        });
        idField.append(idLabel, idInput);
        const actions = element('div');
        actions.className = 'row-actions';
        for (const [name, label, amount] of [['up', 'Move up', -1], ['down', 'Move down', 1]]) {
            const button = element('button', name === 'up' ? '↑' : '↓');
            button.type = 'button';
            button.title = label;
            button.setAttribute('aria-label', `${label}: row ${index + 1}`);
            button.disabled = index + amount < 0 || index + amount >= pages.length;
            button.addEventListener('click', () => {
                const destination = index + amount;
                [pages[index], pages[destination]] = [pages[destination], pages[index]];
                drawRows(page.key);
            });
            actions.append(button);
        }
        const remove = element('button', 'Remove');
        remove.type = 'button';
        remove.setAttribute('aria-label', `Remove row ${index + 1}`);
        remove.addEventListener('click', () => {
            pages.splice(index, 1);
            drawRows();
        });
        actions.append(remove);
        row.append(titleField, idField, actions);
        elements.rows.append(row);
    }
    if (!pages.length) {
        const empty = element('p', 'No pages added. Select “Add page” or import an existing HTML block.');
        empty.className = 'muted';
        elements.rows.append(empty);
    }
    drawPreview();
    if (focusKey != null) $(`page-title-${focusKey}`)?.focus({ preventScroll: true });
}

/** Preserve the *same* structural layout and inline card styling as Page List Generator. */
function buildSnippet() {
    if (!pages.length) throw new Error('Add at least one page.');
    const invalid = pages.filter(page => !page.title.trim() || !/^[0-9]+$/.test(page.contentId));
    if (invalid.length) throw new Error('Every row needs a title and a numeric contentId.');
    const course = currentCourse();
    const c = paletteFor(course);
    const siteId = course?.settings?.get('siteId', null);
    const secondaryText = c['text-muted'] || c['text-secondary'] || '#64748b';
    const root = element('div', null, `display:block;width:100%;box-sizing:border-box;margin:0;padding:0;font-family:Arial, Helvetica, sans-serif;color:${c['text-main']};`);
    pages.forEach((page, index) => {
        const href = lessonPath(siteId, page.contentId);
        if (!href) throw new Error(`Invalid course siteId or page contentId: ${page.contentId}`);
        const accent = index % 2 === 0 ? c.accent : c.structure;
        const card = element('a', null, `display:block;width:100%;box-sizing:border-box;text-decoration:none;background:${c.surface};border:1px solid ${c.border};border-left:5px solid ${accent};border-radius:6px;padding:16px 18px;margin:0 0 10px 0;color:${c['text-main']};`);
        card.setAttribute('href', href);
        card.setAttribute('target', '_top');
        card.setAttribute('rel', 'noopener');
        const layout = element('div', null, 'display:flex;width:100%;box-sizing:border-box;justify-content:space-between;align-items:center;gap:20px;');
        const info = element('div', null, 'min-width:0;flex:1 1 auto;');
        const ordinal = String(index + 1).padStart(2, '0');
        info.append(element('div', ordinal, `font-size:11px;line-height:1.3;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${secondaryText};margin:0 0 5px 0;`));
        info.append(element('div', page.title.trim(), `font-size:16px;line-height:1.35;font-weight:750;color:${c['text-dark']};margin:0 0 4px 0;`));
        layout.append(info, element('div', 'Open →', `flex:0 0 auto;padding-left:10px;font-size:12px;line-height:1.2;font-weight:800;color:${accent};white-space:nowrap;`));
        card.append(layout);
        root.append(card);
    });
    return root;
}

function drawPreview() {
    elements.preview.replaceChildren();
    elements.exportStatus.textContent = '';
    elements.previewStatus.textContent = '';
    if (!pages.length) return;
    try {
        const preview = buildSnippet();
        for (const link of preview.querySelectorAll('a')) {
            link.addEventListener('click', event => event.preventDefault());
        }
        elements.preview.append(preview);
        elements.previewStatus.textContent = `${pages.length} page(s). Preview links are disabled.`;
    } catch (error) {
        elements.previewStatus.textContent = error.message;
    }
}

async function exportHtml() {
    const root = buildSnippet();
    if (!exporterClass) {
        const workspace = window.parent.CourseKitToolkitWorkspace;
        if (!workspace?.toolkit?.toolkitRoot) throw new Error('CourseKit Toolkit SnippetExporter is not available.');
        const url = new URL('scripts/snippet-exporter.js', workspace.toolkit.toolkitRoot).href;
        exporterClass = (await import(url)).SnippetExporter;
    }
    return new exporterClass().export(root);
}

/** Parse only the exact card structure that our two page-list tools export. */
function parsePageList(html) {
    if (!html.trim()) throw new Error('Paste the HTML descriptor first.');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (doc.querySelector('parsererror, script, style, iframe, object, embed, form')) {
        throw new Error('This block contains unsupported elements.');
    }
    const root = doc.body.firstElementChild;
    if (!root || root.tagName !== 'DIV' || doc.body.children.length !== 1) {
        throw new Error('The descriptor must contain exactly one root <div>.');
    }
    const cards = [...root.children];
    if (!cards.length) throw new Error('The page list has no cards.');
    const parsed = cards.map((card, index) => {
        if (card.tagName !== 'A' || card.children.length !== 1) {
            throw new Error(`Card ${index + 1} is not an exported page-list card.`);
        }
        const match = /^\/d2l\/le\/lessons\/(?:([0-9]+)\/)?topics\/([0-9]+)$/.exec(card.getAttribute('href') || '');
        if (!match) throw new Error(`Card ${index + 1} has no valid Brightspace contentId.`);
        const layout = card.firstElementChild;
        const info = layout?.firstElementChild;
        const title = info?.children[1];
        if (layout?.tagName !== 'DIV' || info?.tagName !== 'DIV' || title?.tagName !== 'DIV') {
            throw new Error(`Card ${index + 1} has an unsupported layout.`);
        }
        const value = title.textContent.trim();
        if (!value) throw new Error(`Card ${index + 1} is missing its title.`);
        return { title: value, contentId: match[2], siteId: match[1] || '' };
    });
    const sites = new Set(parsed.map(page => page.siteId));
    if (sites.size > 1) throw new Error('The imported cards use different Brightspace site IDs.');
    return parsed;
}

function openImport() {
    elements.importError.textContent = '';
    elements.importDialog.showModal();
}

function importPages() {
    try {
        const parsed = parsePageList(elements.importSource.value);
        const currentSite = String(currentCourse()?.settings?.get('siteId', '') ?? '').trim();
        const importedSite = parsed[0].siteId;
        if (importedSite && currentSite && importedSite !== currentSite) {
            throw new Error(`Imported siteId ${importedSite} differs from the selected course siteId ${currentSite}.`);
        }
        if (importedSite && !currentSite) {
            throw new Error(`Imported pages require siteId ${importedSite}; select the matching course before editing.`);
        }
        pages = parsed.map(page => createPage(page.title, page.contentId));
        elements.importDialog.close();
        elements.editorStatus.textContent = `${pages.length} page(s) imported. You can continue editing.`;
        drawRows();
    } catch (error) {
        elements.importError.textContent = error.message;
    }
}

async function copyHtml() {
    try {
        const html = await exportHtml();
        await navigator.clipboard.writeText(html);
        elements.exportStatus.textContent = 'HTML copied to clipboard.';
    } catch (error) {
        elements.exportStatus.textContent = `Unable to copy: ${error.message}`;
    }
}

async function viewHtml() {
    try {
        elements.htmlOutput.value = await exportHtml();
        elements.codeDialog.showModal();
    } catch (error) {
        elements.exportStatus.textContent = `Cannot export: ${error.message}`;
    }
}

async function downloadHtml() {
    try {
        const html = await exportHtml();
        const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brightspace-manual-page-list.html';
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        elements.exportStatus.textContent = 'HTML downloaded.';
    } catch (error) {
        elements.exportStatus.textContent = `Cannot export: ${error.message}`;
    }
}

$('add-page').addEventListener('click', () => {
    const page = createPage();
    pages.push(page);
    drawRows(page.key);
});
$('import-open').addEventListener('click', openImport);
$('import-cancel').addEventListener('click', () => elements.importDialog.close());
$('import-confirm').addEventListener('click', importPages);
$('copy-html').addEventListener('click', copyHtml);
$('view-html').addEventListener('click', viewHtml);
$('download-html').addEventListener('click', downloadHtml);
$('close-code').addEventListener('click', () => elements.codeDialog.close());
$('select-html').addEventListener('click', () => { elements.htmlOutput.focus(); elements.htmlOutput.select(); });
window.addEventListener('coursekit:course-changed', () => {
    const course = currentCourse();
    const identity = course?.settings?.data?.course;
    elements.course.textContent = course
        ? `Course: ${[identity?.code, identity?.title].filter(Boolean).join(' — ') || 'Selected course'}`
        : 'No course selected. Select one in the Toolkit header.';
    drawPreview();
});
window.dispatchEvent(new Event('coursekit:course-changed'));
drawRows();
