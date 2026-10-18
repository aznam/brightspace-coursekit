/* CourseKit theme switch — delegates state to the StyleLoader. */
export async function set_behaviour(element) {
    const update = (event) => {
        const resolved = event?.detail?.resolvedMode || document.documentElement.dataset.ckTheme;
        const dark = resolved === 'dark';
        element.setAttribute('aria-checked', String(dark));
        element.title = dark ? 'Switch to day mode' : 'Switch to night mode';
    };
    const toggle = () => {
        const dark = element.getAttribute('aria-checked') === 'true';
        document.dispatchEvent(new CustomEvent('ck:theme-request', {
            detail: { mode: dark ? 'light' : 'dark' }
        }));
    };
    element.addEventListener('click', toggle);
    document.addEventListener('ck:theme-change', update);
    update();
    document.dispatchEvent(new Event('ck:theme-controls-change'));
    return () => {
        element.removeEventListener('click', toggle);
        document.removeEventListener('ck:theme-change', update);
        // Called before this element is detached; defer to next mount event.
        queueMicrotask(() => document.dispatchEvent(new Event('ck:theme-controls-change')));
    };
}
