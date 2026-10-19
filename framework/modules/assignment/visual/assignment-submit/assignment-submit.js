/* CourseKit — Assignment Submit behavior. */

export function set_behaviour(element, xml) {
    const button = element.querySelector('.ck-assignment-submit__button');
    if (!button) return;

    const parseDate = value => {
        if (!value) return null;
        const date = Date.parse(value);
        return Number.isFinite(date) ? date : null;
    };

    const original = parseDate(xml.getAttribute('deadline-at'));
    const extension = parseDate(xml.getAttribute('deadline-extension-at'));
    const due = extension != null && (original == null || extension >= original)
        ? extension
        : original;
    const hard = xml.getAttribute('deadline-type') === 'hard';
    const url = button.dataset.submissionUrl || '';

    const refresh = () => {
        const pastDue = due != null && Date.now() >= due;
        const blocked = !url || due == null || (pastDue && hard);

        button.textContent = blocked
            ? 'Submission Closed'
            : pastDue
                ? 'Submit Late →'
                : 'Submit Assignment →';

        if (blocked) {
            button.removeAttribute('href');
            button.setAttribute('aria-disabled', 'true');
            button.tabIndex = -1;
        } else {
            button.href = url;
            button.removeAttribute('aria-disabled');
            button.removeAttribute('tabindex');
        }
    };

    refresh();
    const timer = window.setInterval(refresh, 1000);
    document.addEventListener('visibilitychange', refresh);

    return () => {
        window.clearInterval(timer);
        document.removeEventListener('visibilitychange', refresh);
    };
}
