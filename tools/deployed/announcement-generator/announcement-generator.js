/** CourseKit Toolkit — Tiptap-powered Announcement Generator.
 * Tiptap owns editing and selections. Only literal inline CSS is exported.
 * Pinned ESM dependencies; hosting must provide access to esm.sh (or vendor URLs).
 */
import { Editor, Node as TiptapNode } from 'https://esm.sh/@tiptap/core@2.11.5';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2.11.5';
import Underline from 'https://esm.sh/@tiptap/extension-underline@2.11.5';
import TextStyle from 'https://esm.sh/@tiptap/extension-text-style@2.11.5';
import Color from 'https://esm.sh/@tiptap/extension-color@2.11.5';

const el = Object.fromEntries([
    'course-label', 'announcement-date', 'announcement-topic', 'announcement-important',
    'announcement-message', 'text-color', 'theme-colors', 'color-indicator', 'callout-type',
    'editor-selection-state', 'editor-word-count', 'exit-section', 'cta-label', 'cta-url',
    'preview', 'preview-state', 'quick-copy', 'view-code', 'download-html',
    'code-dialog', 'close-code', 'snippet-code', 'select-code', 'copy-code', 'action-status'
].map(id => [id, document.getElementById(id)]));

const FALLBACK = Object.freeze({
    accent: '#c2410c', 'accent-light': '#ffedd5', structure: '#1e293b',
    'text-main': '#334155', 'text-dark': '#0f172a', border: '#e2e8f0', surface: '#ffffff'
});
let course = null;
let renderedHTML = '';
let editor = null;

function selectedCourse() {
    try { return window.parent.CourseKitToolkitWorkspace?.selectedCourse || null; }
    catch { return null; }
}

function palette() {
    const theme = course?.settings?.data?.theme || {};
    return { ...FALLBACK, ...(theme.palette || {}), ...(theme.palettes?.light || {}) };
}

/** Read a CSS color through the browser and return a function-free hex literal. */
function colorLiteral(value, fallback) {
    const test = document.createElement('span');
    test.style.color = '';
    test.style.color = String(value || fallback);
    if (!test.style.color) throw Error(`Invalid theme color: ${value}`);
    document.body.append(test);
    const computed = getComputedStyle(test).color;
    test.remove();
    const match = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?\s*\)$/i.exec(computed);
    if (!match) {
        if (/^#[a-f0-9]{3,8}$/i.test(value)) return value;
        throw Error(`Cannot convert course color to a literal: ${computed}`);
    }
    const hex = channel => Math.round(Number(channel)).toString(16).padStart(2, '0');
    return '#' + [match[1], match[2], match[3]].map(hex).join('') +
        (match[4] === undefined ? '' : hex(Number(match[4]) * 255));
}

function themeColors() {
    const c = palette();
    const out = {};
    for (const key of ['accent', 'accent-light', 'structure', 'text-main', 'text-dark', 'border', 'surface']) {
        out[key] = colorLiteral(c[key], FALLBACK[key]);
    }
    out.muted = colorLiteral(c['text-muted'] || c['text-secondary'] || '#64748b', '#64748b');
    out.danger = colorLiteral(c.danger || '#b91c1c', '#b91c1c');
    out.warning = colorLiteral(c.warning || '#b45309', '#b45309');
    return out;
}

const style = (node, value) => { node.setAttribute('style', value); return node; };
function element(tag, css, value = null) {
    const node = document.createElement(tag);
    if (css) style(node, css);
    if (value !== null) node.textContent = String(value);
    return node;
}

function inlineColors(colors) {
    return {
        accent: colors.accent, structure: colors.structure,
        muted: colors.muted, danger: colors.danger,
        default: colors['text-main']
    };
}

/** Convert Tiptap HTML to the restricted Brightspace HTML subset.
 * Ignore editor-only attributes and reconstruct styles from an allowlist.
 */
function appendRich(source, target, c, depth = 0) {
    if (depth > 60) throw Error('Message is too deeply nested.');
    for (const child of source.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            target.append(document.createTextNode(child.textContent));
            continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) continue;
        const tag = child.tagName;
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG'].includes(tag)) continue;
        if (child.hasAttribute('data-announcement-section')) {
            target.append(renderSection(child, c));
            continue;
        }
        if (tag === 'BR') {
            target.append(element('br', 'display:inline;'));
            continue;
        }
        let node;
        if (['STRONG', 'B'].includes(tag)) node = element('strong', 'font-weight:700;');
        else if (['EM', 'I'].includes(tag)) node = element('em', 'font-style:italic;');
        else if (tag === 'U') node = element('span', 'text-decoration:underline;');
        else if (tag === 'CODE') node = element('code', `font-family:monospace;background:#f1f5f9;color:${c.structure};padding:0.08rem 0.25rem;border-radius:0.2rem;`);
        else if (tag === 'SPAN' && child.style.color) {
            const literal = colorLiteral(child.style.color, c['text-main']);
            node = element('span', `color:${literal};`);
        } else if (tag === 'A') {
            const href = child.getAttribute('href') || '';
            if (!/^https?:\/\/[^\s]+$/i.test(href)) {
                appendRich(child, target, c, depth + 1);
                continue;
            }
            node = element('a', `color:${c.accent};text-decoration:underline;`);
            node.href = href;
            node.target = '_top';
            node.rel = 'noopener';
        } else if (['P', 'DIV'].includes(tag)) {
            node = element('p', `margin:0 0 0.75rem 0;font-size:14px;line-height:1.65;color:${c['text-main']};`);
        } else {
            // Unsupported wrapper: keep text and supported descendants.
            appendRich(child, target, c, depth + 1);
            continue;
        }
        appendRich(child, node, c, depth + 1);
        target.append(node);
    }
}

function renderSection(section, c) {
    const type = section.getAttribute('data-announcement-section');
    const config = {
        info: { title: 'Info', color: c.structure, bg: '#f1f5f9' },
        warning: { title: 'Warning', color: c.warning, bg: '#fffbeb' },
        important: { title: 'Important', color: c.danger, bg: '#fff1f2' }
    }[type];
    if (!config) throw Error('Unrecognized announcement section.');
    const box = element('div', `margin:0.75rem 0;padding:0.625rem;border:1px solid ${c.border};border-left:5px solid ${config.color};background:${config.bg};border-radius:5px;`);
    box.append(element('div', `font-size:12px;font-weight:800;color:${config.color};margin:0 0 0.25rem 0;`, config.title));
    const body = element('div', `font-size:14px;line-height:1.65;color:${c['text-main']};`);
    appendRich(section, body, c);
    for (const p of body.querySelectorAll('p')) {
        const declarations = (p.getAttribute('style') || '').split(';').filter(x => x.trim() && !/^\s*margin\s*:/i.test(x));
        p.setAttribute('style', `margin:0;${declarations.join(';')};`);
    }
    box.append(body);
    return box;
}

function bodyContent(c) {
    const body = element('div', `font-size:14px;line-height:1.65;color:${c['text-main']};`);
    const source = new DOMParser().parseFromString(editor?.getHTML() || '<p></p>', 'text/html');
    appendRich(source.body, body, c);
    if (body.lastElementChild?.tagName === 'P') {
        const last = body.lastElementChild;
        last.setAttribute('style', (last.getAttribute('style') || '').replace('margin:0 0 0.75rem 0', 'margin:0'));
    }
    return body;
}

function formattedDate(raw) {
    if (!raw) return 'Announcement';
    const [year, month, day] = raw.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12);
    return Number.isNaN(date.getTime()) ? 'Announcement' : date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function render() {
    const c = themeColors();
    const important = el['announcement-important'].checked;
    const title = el['announcement-topic'].value.trim();
    const label = el['cta-label'].value.trim();
    const href = el['cta-url'].value.trim();
    const root = element('div', `display:block;width:100%;box-sizing:border-box;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:${c['text-main']};`);
    const card = element('div', `width:100%;box-sizing:border-box;background:${c.surface};border:1px solid ${c.border};border-left:5px solid ${important ? c.accent : c.structure};border-radius:5px;overflow:hidden;`);
    const head = element('div', `padding:16px 20px 14px 20px;background:${important ? c['accent-light'] : c.surface};border-bottom:1px solid ${c.border};`);
    const dateLine = element('div', `font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${c.muted};`, formattedDate(el['announcement-date'].value));
    if (important) dateLine.append(element('span', `display:inline-block;margin-left:0.75rem;font-size:10px;font-weight:800;color:${c.accent};`, 'IMPORTANT'));
    const titleRow = element('div', 'display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-top:0.375rem;');
    titleRow.append(element('div', `flex:1 1 auto;min-width:0;font-size:20px;line-height:1.3;font-weight:800;color:${c['text-dark']};`, title || 'Announcement topic'));
    if (label || href) {
        if (!label || !/^https?:\/\/[^\s]+$/i.test(href)) {
            throw Error('Action link requires both a label and a valid http(s) URL.');
        }
        const anchor = element('a', `display:inline-block;flex:0 0 auto;text-decoration:none;background:${c.accent};color:#ffffff;font-size:13px;font-weight:700;padding:9px 14px;border-radius:4px;`, label + ' →');
        anchor.href = href;
        anchor.target = '_top';
        anchor.rel = 'noopener';
        titleRow.append(anchor);
    }
    head.append(dateLine, titleRow);
    const content = element('div', 'padding:20px;');
    content.append(bodyContent(c));
    card.append(head, content);
    root.append(card);
    return root;
}

/** Enforce Brightspace export contract, independently of the editor DOM. */
function validate(root) {
    const allowed = new Set(['DIV', 'P', 'SPAN', 'STRONG', 'EM', 'CODE', 'BR', 'A']);
    const nodes = [root, ...root.querySelectorAll('*')];
    for (const node of nodes) {
        if (!allowed.has(node.tagName)) throw Error(`Unsupported export element: ${node.tagName}`);
        for (const attr of node.attributes) {
            if (!['style', 'href', 'rel', 'target'].includes(attr.name.toLowerCase())) throw Error(`Unexpected attribute: ${attr.name}`);
        }
        const css = node.getAttribute('style') || '';
        if (/[{}@]|\b[a-z-]+\s*\(/i.test(css) || /--[a-z-]+\s*:/i.test(css)) throw Error(`Unsupported CSS expression in ${node.tagName}`);
        if (!css) throw Error(`Missing inline styles for ${node.tagName}`);
        if (node.tagName === 'A' && !/^https?:\/\/[^\s]+$/i.test(node.getAttribute('href') || '')) throw Error('Invalid action URL.');
    }
    const output = root.outerHTML;
    if (!output.startsWith('<div ') || /<\s*(script|style|link|iframe)\b|\son\w+\s*=/i.test(output)) throw Error('Snippet contains forbidden markup.');
    return output;
}

function update() {
    try {
        const root = render();
        renderedHTML = validate(root);
        el.preview.replaceChildren(root);
        el['preview-state'].textContent = 'Up to date';
        el['action-status'].textContent = '';
        el['action-status'].classList.remove('error');
    } catch (error) {
        renderedHTML = '';
        el['preview-state'].textContent = 'Check input';
        el['action-status'].textContent = error.message;
        el['action-status'].classList.add('error');
    }
}

const Callout = TiptapNode.create({
    name: 'callout',
    group: 'block',
    content: 'paragraph+',
    defining: true,
    addAttributes() {
        return {
            kind: {
                default: 'info',
                parseHTML: el => el.getAttribute('data-announcement-section') || 'info',
                renderHTML: attrs => ({
                    'data-announcement-section': attrs.kind,
                    'data-callout-label': attrs.kind[0].toUpperCase() + attrs.kind.slice(1)
                })
            }
        };
    },
    parseHTML() { return [{ tag: 'div[data-announcement-section]' }]; },
    renderHTML({ HTMLAttributes }) { return ['div', HTMLAttributes, 0]; }
});

editor = new Editor({
    element: el['announcement-message'],
    extensions: [StarterKit, Underline, TextStyle, Color.configure({ types: ['textStyle'] }), Callout],
    content: '<p></p>',
    onUpdate: () => { update(); refreshEditorUI(); },
    onSelectionUpdate: () => refreshEditorUI(),
    onTransaction: () => refreshEditorUI()
});

function applyColor(color) {
    const literal = colorLiteral(color, themeColors()['text-main']);
    el['color-indicator'].style.backgroundColor = literal;
    editor.chain().focus().setColor(literal).run();
    update();
}
function refreshThemeSwatches() {
    const colors = themeColors();
    el['theme-colors'].replaceChildren();
    for (const [name, color] of Object.entries(inlineColors(colors))) {
        const button = document.createElement('button');
        button.type = 'button';
        button.title = name;
        button.setAttribute('aria-label', `Apply ${name} color`);
        button.style.background = color; // UI only, never exported.
        button.addEventListener('mousedown', event => event.preventDefault());
        button.addEventListener('click', () => applyColor(color));
        el['theme-colors'].append(button);
    }
}
function insertSection(kind) {
    // Insert a typed block and an ordinary paragraph after it.
    editor.chain().focus().insertContent([
        { type: 'callout', attrs: { kind }, content: [{ type: 'paragraph' }] },
        { type: 'paragraph' }
    ]).run();
}
function exitSection() {
    const { $from } = editor.state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
        if ($from.node(depth).type.name !== 'callout') continue;
        const after = $from.after(depth);
        editor.chain().focus().insertContentAt(after, { type: 'paragraph' }).setTextSelection(after + 1).run();
        return;
    }
    editor.chain().focus().insertContent({ type: 'paragraph' }).run();
}

function syncCourse() {
    course = selectedCourse();
    const data = course?.settings?.data?.course || {};
    el['course-label'].textContent = [data.code, data.title].filter(Boolean).join(' — ') || 'No course selected';
    refreshThemeSwatches();
    refreshEditorUI();
    update();
}

async function copyHTML() {
    if (!renderedHTML) { update(); if (!renderedHTML) return; }
    try {
        await navigator.clipboard.writeText(renderedHTML);
        el['action-status'].textContent = 'HTML copied.';
        el['action-status'].classList.remove('error');
    } catch {
        el['snippet-code'].value = renderedHTML;
        el['code-dialog'].showModal();
        el['snippet-code'].select();
        el['action-status'].textContent = 'Automatic copy unavailable. Select and copy the code in the dialog.';
    }
}
function openCode() {
    if (!renderedHTML) return;
    el['snippet-code'].value = renderedHTML;
    el['code-dialog'].showModal();
}
function downloadHTML() {
    if (!renderedHTML) return;
    const url = URL.createObjectURL(new Blob([renderedHTML], { type: 'text/html;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'brightspace-announcement.html';
    anchor.click();
    URL.revokeObjectURL(url);
}

for (const input of [el['announcement-date'], el['announcement-topic'], el['announcement-important'], el['cta-label'], el['cta-url']]) {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
}
function refreshEditorUI() {
    if (!editor) return;
    for (const button of document.querySelectorAll('[data-command]')) {
        const command = button.dataset.command;
        const isFormat = ['bold', 'italic', 'underline', 'code'].includes(command);
        if (isFormat) {
            const active = editor.isActive(command);
            button.setAttribute('aria-pressed', String(active));
            button.classList.toggle('is-active', active);
        }
        if (command === 'undo') button.disabled = !editor.can().undo();
        if (command === 'redo') button.disabled = !editor.can().redo();
    }
    const calloutActive = editor.isActive('callout');
    el['exit-section'].disabled = !calloutActive;
    const label = calloutActive ? 'Callout' : (editor.isActive('paragraph') ? 'Paragraph' : 'Text');
    el['editor-selection-state'].textContent = label;
    const text = editor.getText().trim();
    const count = text ? text.split(/\s+/).length : 0;
    el['editor-word-count'].textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
}
const editorCommands = {
    undo: () => editor.chain().focus().undo().run(),
    redo: () => editor.chain().focus().redo().run(),
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    code: () => editor.chain().focus().toggleCode().run(),
    'unset-color': () => editor.chain().focus().unsetColor().run()
};
for (const button of document.querySelectorAll('[data-command]')) {
    button.addEventListener('mousedown', event => event.preventDefault());
    button.addEventListener('click', () => {
        editorCommands[button.dataset.command]?.();
        refreshEditorUI();
    });
}
el['callout-type'].addEventListener('change', () => {
    const kind = el['callout-type'].value;
    if (kind) insertSection(kind);
    el['callout-type'].value = '';
    refreshEditorUI();
});
el['text-color'].addEventListener('input', () => applyColor(el['text-color'].value));
el['exit-section'].addEventListener('click', () => { exitSection(); refreshEditorUI(); });
el['quick-copy'].addEventListener('click', copyHTML);
el['view-code'].addEventListener('click', openCode);
el['download-html'].addEventListener('click', downloadHTML);
el['close-code'].addEventListener('click', () => el['code-dialog'].close());
el['select-code'].addEventListener('click', () => { el['snippet-code'].focus(); el['snippet-code'].select(); });
el['copy-code'].addEventListener('click', copyHTML);
window.addEventListener('coursekit:course-changed', syncCourse);
el['announcement-date'].value = new Date().toLocaleDateString('en-CA').replace(/\//g, '-');
syncCourse();
refreshEditorUI();
