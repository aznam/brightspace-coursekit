/** CourseKit Toolkit — Page List Generator workspace. */
const form = document.getElementById('catalog-form');
const tableInput = document.getElementById('table-path');
const courseLabel = document.getElementById('course-label');
const status = document.getElementById('catalog-status');
const pageCount = document.getElementById('page-count');
const selectedCount = document.getElementById('selected-count');
const pageResults = document.getElementById('page-results');
const selectAllButton = document.getElementById('select-all');
const selectNoneButton = document.getElementById('select-none');
const editorActions = document.getElementById('editor-actions');
const mappingDialog = document.getElementById('mapping-dialog');
const mappingButton = document.getElementById('mapping-button');
const mappingCancel = document.getElementById('mapping-cancel');
const mappingSummary = document.getElementById('mapping-summary');
const refreshButton = document.getElementById('refresh-pages');
const codeDialog = document.getElementById('code-dialog');
const viewCodeButton = document.getElementById('view-code');
const codeClose = document.getElementById('code-close');
const selectCodeButton = document.getElementById('select-code');
const previewSection = document.getElementById('preview-section');
const previewHost = document.getElementById('preview-host');
const previewStatus = document.getElementById('preview-status');
const exportSection = document.getElementById('export-section');
const quickCopyButton = document.getElementById('quick-copy');
const copyButton = document.getElementById('dialog-copy');
const downloadButton = document.getElementById('download-snippet');
const snippetOutput = document.getElementById('snippet-output');
const exportStatus = document.getElementById('export-status');
let exporterClass = null;
let catalogClass = null;
let revision = 0;
let pages = [];
let lastCatalog = null;

function currentCourse() {
    try { return window.parent.CourseKitToolkitWorkspace?.selectedCourse || null; }
    catch { return null; }
}

function textElement(tag, className, content) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = content;
    return element;
}

function resetPages(message = 'Load a mapping table to display its pages.') {
    pages = [];
    invalidateExport();
    pageCount.textContent = '0';
    selectedCount.textContent = '0 selected';
    editorActions.hidden = true;
    pageResults.replaceChildren(textElement('p', 'placeholder', message));
    previewSection.hidden = true;
    lastCatalog = null;
    refreshButton.disabled = true;
    mappingSummary.textContent = 'No mapping loaded';
    previewHost.replaceChildren();
    previewStatus.textContent = '';
}

function updateCounts() {
    invalidateExport();
    pageCount.textContent = String(pages.length);
    selectedCount.textContent = `${pages.filter(page => page.included).length} selected`;
    editorActions.hidden = pages.length === 0;
    renderPreview();
}

/** An in-course Lessons URL. Intentionally relative to the Brightspace origin. */
function lessonPath(siteId, topicId) {
    const id = String(siteId ?? '').trim();
    const topic = String(topicId ?? '').trim();
    if (!/^[0-9]+$/.test(topic)) return null;
    if (!id) return `/d2l/le/lessons/topics/${encodeURIComponent(topic)}`;
    if (!/^[0-9]+$/.test(id)) return null;
    return `/d2l/le/lessons/${encodeURIComponent(id)}/topics/${encodeURIComponent(topic)}`;
}

/** Theme definitions belong to the course, never to this tool's own CSS. */
function coursePalette(course) {
    const theme = course?.settings?.data?.theme || {};
    const base = theme.palette || {};
    const light = theme.palettes?.light || {};
    const palette = { ...base, ...light };
    const required = ['accent', 'structure', 'border', 'text-main', 'text-dark', 'surface'];
    const missing = required.filter(key => typeof palette[key] !== 'string' || !palette[key].trim());
    if (missing.length) throw new Error(`Missing course palette colors: ${missing.join(', ')}`);
    return palette;
}

function renderPreview() {
    invalidateExport();
    previewHost.replaceChildren();
    previewStatus.textContent = '';
    previewSection.hidden = !pages.length;
    if (!pages.length) return;
    exportSection.hidden = false;

    const selected = pages.filter(page => page.included);
    if (!selected.length) {
        previewHost.append(textElement('p', 'placeholder', 'No pages selected.'));
        return;
    }
    const course = currentCourse();
    try {
        const c = coursePalette(course);
        const siteId = course?.settings?.get('siteId', null);
        const secondaryText = c['text-muted'] || c['text-secondary'] || '#64748b';
        const root = document.createElement('div');
        const declaredFont = (course?.settings?.data?.resources?.fonts || [])
            .find(font => font.cssVariable === '--ck-font-body');
        const family = declaredFont?.family
            ? `"${String(declaredFont.family).replace(/["\\]/g, '')}", ${declaredFont.fallback || 'sans-serif'}`
            : 'Arial, Helvetica, sans-serif';
        root.style.cssText = `display:block;width:100%;box-sizing:border-box;margin:0;padding:0;font-family:${family};color:${c['text-main']};`;
        const unlinked = [];
        selected.forEach((page, index) => {
            const href = lessonPath(siteId, page.topicId);
            const card = document.createElement(href ? 'a' : 'div');
            if (href) {
                card.href = href;
                card.target = '_top';
                card.rel = 'noopener';
                card.addEventListener('click', event => event.preventDefault());
                card.title = href;
            } else {
                unlinked.push(page.topicId);
                card.title = 'No valid Brightspace URL: check topicId and, if supplied, siteId.';
            }
            const accent = index % 2 === 0 ? c.accent : c.structure;
            card.style.cssText = `display:block;width:100%;box-sizing:border-box;text-decoration:none;background:${c.surface};border:1px solid ${c.border};border-left:5px solid ${accent};border-radius:6px;padding:16px 18px;margin:0 0 10px 0;color:${c['text-main']};`;
            const layout = document.createElement('div');
            layout.style.cssText = 'display:flex;width:100%;box-sizing:border-box;justify-content:space-between;align-items:center;gap:20px;';
            const info = document.createElement('div');
            info.style.cssText = 'min-width:0;flex:1 1 auto;';
            const ordinal = String(index + 1).padStart(2, '0');
            const hook = page.hookTitle?.trim();
            const eyebrow = textElement('div', '', `${ordinal}${hook ? ' · ' + hook : ''}`);
            eyebrow.style.cssText = `font-size:11px;line-height:1.3;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${secondaryText};margin:0 0 5px 0;`;
            info.append(eyebrow);
            const title = textElement('div', '', page.title || 'Untitled page');
            title.style.cssText = `font-size:16px;line-height:1.35;font-weight:750;color:${c['text-dark']};margin:0 0 4px 0;`;
            info.append(title);
            if (page.description) {
                const description = textElement('div', '', page.description);
                description.style.cssText = `font-size:13px;line-height:1.5;color:${secondaryText};margin:0;`;
                info.append(description);
            }
            const callToAction = textElement('div', '', href ? 'Open →' : 'Unavailable');
            callToAction.style.cssText = `flex:0 0 auto;padding-left:10px;font-size:12px;line-height:1.2;font-weight:800;color:${accent};white-space:nowrap;`;
            layout.append(info, callToAction);
            card.append(layout);
            root.append(card);
        });
        previewHost.append(root);
        previewStatus.textContent = unlinked.length
            ? `${unlinked.length} page(s) have no valid URL. A numeric topicId and, if supplied, a numeric siteId are required. Preview links are disabled.`
            : 'Preview only. Links are disabled here; destinations use Brightspace-relative Lessons URLs.';
    } catch (error) {
        previewStatus.textContent = `Preview unavailable: ${error.message}`;
    }
}

function updateCourse() {
    revision++;
    const course = currentCourse();
    const name = course?.settings?.data?.course;
    courseLabel.textContent = course
        ? `Course: ${[name?.code, name?.title].filter(Boolean).join(' — ') || course.resources.courseRoot.href}`
        : 'No course selected.';
    resetPages();
    tableInput.value = course?.settings?.get('contentTable', '') || '';
    status.textContent = '';
    mappingButton.hidden = false;
    if (course && tableInput.value.trim()) void loadCatalog();
    else if (course) openMapping();
}

function movePage(index, shift) {
    const destination = index + shift;
    if (destination < 0 || destination >= pages.length) return;
    [pages[index], pages[destination]] = [pages[destination], pages[index]];
    renderPages(pages[destination].topicId);
}

function renderPages(focusTopicId = null) {
    updateCounts();
    pageResults.replaceChildren();
    const selected = pages.filter(page => page.included);
    for (const [index, page] of pages.entries()) {
        const article = document.createElement('article');
        article.className = 'page-editor';
        article.dataset.topicId = page.topicId;
        article.classList.toggle('page-excluded', !page.included);

        const toolbar = document.createElement('div');
        toolbar.className = 'page-toolbar';
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'page-toggle';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = page.included;
        checkbox.setAttribute('aria-label', `Include page ${page.topicId}`);
        checkbox.addEventListener('change', () => {
            page.included = checkbox.checked;
            renderPages(page.topicId);
        });
        checkboxLabel.append(checkbox, document.createTextNode('Include'));
        toolbar.append(checkboxLabel);
        toolbar.append(textElement('span', 'page-topic', `Topic ${page.topicId}`));
        const controls = document.createElement('div');
        controls.className = 'page-reorder';
        for (const [label, shift] of [['↑', -1], ['↓', 1]]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label;
            button.title = shift < 0 ? 'Move up' : 'Move down';
            button.setAttribute('aria-label', `${button.title}: ${page.title || page.topicId}`);
            button.disabled = index + shift < 0 || index + shift >= pages.length;
            button.addEventListener('click', () => movePage(index, shift));
            controls.append(button);
        }
        toolbar.append(controls);
        article.append(toolbar);

        // Clone the exact card used for export, not a second approximation.
        if (page.included) {
            const selectedIndex = selected.indexOf(page);
            const original = previewHost.firstElementChild?.children[selectedIndex];
            if (original && original.tagName !== 'P') {
                const visual = original.cloneNode(true);
                visual.addEventListener('click', event => event.preventDefault());
                visual.removeAttribute('title');
                visual.classList.add('page-inline-preview');
                article.append(visual);
            }
        } else {
            const placeholder = textElement('div', 'excluded-caption',
                `${page.title || 'Untitled page'} · excluded from snippet`);
            article.append(placeholder);
        }
        pageResults.append(article);
    }
    if (!pages.length) {
        pageResults.append(textElement('p', 'placeholder', 'The mapping table contains no pages.'));
    }
    if (focusTopicId != null) {
        const card = [...pageResults.children].find(item => item.dataset.topicId === focusTopicId);
        card?.querySelector('.page-toggle input')?.focus({ preventScroll: true });
    }
}

function setAll(included) {
    for (const page of pages) page.included = included;
    renderPages();
}

async function loadCatalog(event) {
    event?.preventDefault();
    const course = currentCourse();
    if (!course) { status.textContent = 'Select a course in the Toolkit header.'; return; }
    const request = ++revision;
    status.textContent = 'Reading content mapping…';
    try {
        if (!catalogClass) {
            const toolkit = window.parent.CourseKitToolkitWorkspace.toolkit;
            const url = new URL('scripts/content-catalog.js', toolkit.toolkitRoot).href;
            const module = await import(url);
            catalogClass = module.ContentCatalog;
        }
        const result = await new catalogClass(course.resources, course.settings).listTable(tableInput.value.trim());
        if (request !== revision) return;
        pages = result.pages.map(page => ({
            topicId: page.topicId,
            contentPath: page.contentPath,
            contentUrl: page.contentUrl,
            included: true,
            title: page.metadata.pageShortTitle || page.metadata.title || '',
            hookTitle: page.metadata.hookTitle || '',
            description: page.metadata.desc || page.metadata.subtitle || ''
        }));
        lastCatalog = result;
        refreshButton.disabled = false;
        mappingSummary.textContent = `Mapping: ${tableInput.value.trim()}`;
        mappingDialog.close();
        renderPages();
        status.textContent = `${pages.length} page(s) loaded from ${result.tableUrl}`;
    } catch (error) {
        if (request !== revision) return;
        resetPages();
        status.textContent = `Could not load pages: ${error.message}`;
        mappingButton.hidden = false;
        openMapping();
        console.error('[Page List Generator]', error);
    }
}


function invalidateExport() {
    if (!snippetOutput) return;
    snippetOutput.value = '';
    exportStatus.textContent = '';
    copyButton.disabled = true;
    quickCopyButton.disabled = !pages.some(page => page.included);
    viewCodeButton.disabled = !pages.some(page => page.included);
    downloadButton.disabled = !pages.some(page => page.included);
    exportSection.hidden = !pages.length;
}

async function generateSnippet() {
    try {
        if (!pages.some(page => page.included)) throw new Error('Select at least one page.');
        const invalid = pages.filter(page => page.included && !lessonPath(
            currentCourse()?.settings?.get('siteId', null), page.topicId));
        if (invalid.length) throw new Error(`Missing valid Brightspace link for topic(s): ${invalid.map(page => page.topicId).join(', ')}`);
        const root = previewHost.firstElementChild;
        if (!root || root.tagName !== 'DIV') throw new Error('Generate a card preview first.');
        if (!exporterClass) {
            const workspace = window.parent.CourseKitToolkitWorkspace;
            const url = new URL('scripts/snippet-exporter.js', workspace.toolkit.toolkitRoot).href;
            exporterClass = (await import(url)).SnippetExporter;
        }
        snippetOutput.value = new exporterClass().export(root);
        copyButton.disabled = false;
        downloadButton.disabled = false;
        exportStatus.textContent = `${pages.filter(page => page.included).length} card(s) exported with inline CSS.`;
        return snippetOutput.value;
    } catch (error) {
        invalidateExport();
        exportSection.hidden = false;
        exportStatus.textContent = `Cannot export: ${error.message}`;
        return '';
    }
}

async function copySnippet() {
    if (!snippetOutput.value && !await generateSnippet()) return;
    try {
        await navigator.clipboard.writeText(snippetOutput.value);
        exportStatus.textContent = 'HTML copied to clipboard.';
    } catch (error) {
        if (!codeDialog.open) codeDialog.showModal();
        snippetOutput.focus();
        snippetOutput.select();
        exportStatus.textContent = `Clipboard unavailable; HTML selected for manual copy. ${error.message}`;
    }
}

async function downloadSnippet() {
    if (!snippetOutput.value && !await generateSnippet()) return;
    const blob = new Blob([snippetOutput.value], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brightspace-page-list.html';
        document.body.append(link);
        link.click();
        link.remove();
    } finally {
        URL.revokeObjectURL(url);
    }
}

function openMapping() {
    if (!mappingDialog.open) mappingDialog.showModal();
    tableInput.focus();
}

async function refreshCatalog() {
    if (!currentCourse() || !tableInput.value.trim()) {
        openMapping();
        return;
    }
    const resources = currentCourse().resources;
    // CourseKit ResourceLoader caches response bodies. Invalidate only this
    // mapping and the XML sources previously discovered from it.
    if (lastCatalog) {
        resources.cache.delete(lastCatalog.tableUrl);
        for (const page of lastCatalog.pages) resources.cache.delete(page.contentUrl);
    } else {
        // Resolution can succeed before reading the table; resolve its URL.
        try {
            const url = await resources.resolve(tableInput.value.trim(), 'content');
            resources.cache.delete(url);
        } catch { /* loadCatalog will report the meaningful error */ }
    }
    await loadCatalog();
}

async function openCode() {
    if (!await generateSnippet()) return;
    codeDialog.showModal();
}

function selectCode() {
    snippetOutput.focus();
    snippetOutput.select();
}

mappingButton.addEventListener('click', openMapping);
mappingCancel.addEventListener('click', () => mappingDialog.close());
refreshButton.addEventListener('click', refreshCatalog);
quickCopyButton.addEventListener('click', copySnippet);
viewCodeButton.addEventListener('click', openCode);
codeClose.addEventListener('click', () => codeDialog.close());
selectCodeButton.addEventListener('click', selectCode);
form.addEventListener('submit', loadCatalog);
copyButton.addEventListener('click', copySnippet);
downloadButton.addEventListener('click', downloadSnippet);
selectAllButton.addEventListener('click', () => setAll(true));
selectNoneButton.addEventListener('click', () => setAll(false));
window.addEventListener('coursekit:course-changed', updateCourse);
updateCourse();
