/** Assignment band interactions and countdown; loaded by component.json. */
export async function set_behaviour(band, xml) {
    const countdown = (remaining) => {
        if (remaining <= 0) return 'Closed';
        const seconds = Math.ceil(remaining / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    const button = band.querySelector('.aband-strip');
    const panel = band.querySelector('.aband-panel');
    if (!button || !panel) return () => {};

    const parseTime = (value) => value ? Date.parse(value) : null;
    const openAt = parseTime(xml.getAttribute('open'));
    const originalDue = parseTime(xml.getAttribute('deadline-at'));
    const extendedDue = parseTime(xml.getAttribute('deadline-extension-at'));
    const invalidExtension = extendedDue != null && originalDue != null && extendedDue < originalDue;
    const due = invalidExtension ? originalDue : extendedDue ?? originalDue;
    const progressFill = band.querySelector('.aband-progress-fill');
    const remainingLabel = band.querySelector('.aband-progress-label');

    const refresh = () => {
        if (!progressFill || !remainingLabel) return;
        if (due == null) {
            progressFill.style.width = '0%';
            remainingLabel.textContent = 'null';
            remainingLabel.title = 'Deadline not specified';
            return;
        }
        const now = Date.now();
        const remaining = due - now;
        const notOpen = openAt != null && now < openAt;
        const duration = openAt != null && due > openAt ? due - openAt : null;
        const fraction = notOpen ? 1 : remaining <= 0 ? 0 : duration
            ? Math.max(0, Math.min(1, remaining / duration)) : 1;

        progressFill.style.width = `${(fraction * 100).toFixed(2)}%`;
        progressFill.classList.remove('aband-fill-ok', 'aband-fill-warn', 'aband-fill-danger');
        progressFill.classList.add(
            fraction <= 0.10 ? 'aband-fill-danger'
                : fraction <= 0.35 ? 'aband-fill-warn' : 'aband-fill-ok'
        );
        remainingLabel.textContent = notOpen ? 'Not open yet' : countdown(remaining);
        remainingLabel.title = countdown(remaining);
    };

    const touchMode = window.matchMedia('(hover: none)').matches;
    let hideTimer = null;

    const clearHide = () => {
        if (hideTimer !== null) {
            window.clearTimeout(hideTimer);
            hideTimer = null;
        }
    };
    const setOpen = (open) => {
        clearHide();
        band.classList.toggle('aband-open', open);
        button.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
        band.dataset.open = String(open);
    };
    const toggle = () => setOpen(!band.classList.contains('aband-open'));
    const mouseEnter = () => { if (!touchMode) setOpen(true); };
    const mouseLeave = () => {
        if (touchMode) return;
        clearHide();
        hideTimer = window.setTimeout(() => setOpen(false), 150);
    };
    const click = (event) => {
        if (touchMode && !event.target.closest('.ck-hoverbox')) toggle();
    };
    const outsideClick = (event) => {
        if (touchMode && !band.contains(event.target)) setOpen(false);
    };
    const keydown = (event) => {
        if (event.key === 'Escape' && band.classList.contains('aband-open')) {
            event.preventDefault();
            setOpen(false);
            button.focus();
        } else if (event.target === button && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggle();
        }
    };
    const measure = () => {
        const navbar = band.ownerDocument.querySelector('.ck-navbar');
        band.style.setProperty(
            '--ck-assignment-band-sticky-top',
            `${navbar?.getBoundingClientRect().height ?? 0}px`
        );
    };
    const navbar = band.ownerDocument.querySelector('.ck-navbar');
    const observer = typeof ResizeObserver !== 'undefined' && navbar
        ? new ResizeObserver(measure) : null;
    observer?.observe(navbar);
    window.addEventListener('resize', measure, { passive: true });
    band.addEventListener('mouseenter', mouseEnter);
    band.addEventListener('mouseleave', mouseLeave);
    band.addEventListener('click', click);
    band.addEventListener('keydown', keydown);
    document.addEventListener('click', outsideClick);
    refresh();
    measure();

    const timer = window.setInterval(refresh, 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
        clearHide();
        window.clearInterval(timer);
        observer?.disconnect();
        window.removeEventListener('resize', measure);
        document.removeEventListener('visibilitychange', refresh);
        band.removeEventListener('mouseenter', mouseEnter);
        band.removeEventListener('mouseleave', mouseLeave);
        band.removeEventListener('click', click);
        band.removeEventListener('keydown', keydown);
        document.removeEventListener('click', outsideClick);
    };
}
