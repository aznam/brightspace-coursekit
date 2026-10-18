
/*
 * CourseKit — Hoverbox Component Behavior
 *
 * Normative reference: CONVENTIONS.md
 * Sections 7.1.1, 7.1.2, 7.1.3, and WCAG 2.2
 * (2.1.1 Keyboard, 1.4.13 Content on Hover or Focus).
 *
 * Responsibility:
 * Manages accessibility states (focus, hover, tap),
 * dynamic screen-edge clamping, Escape key dismissal,
 * scroll-safety, and clean teardown.
 */

export async function set_behaviour(element) {
    const box = element;
    const trigger = box.querySelector('.ck-hoverbox__trigger');
    const panel = box.querySelector('.ck-hoverbox__panel');

    if (!trigger || !panel) return;

    let hideTimer;

    // Resolve the CSS-owned viewport clearance using the browser
    // layout engine. No independent JS design constant is used.
    // Supports rem, px, calc(), and site-level overrides.
    const getViewportInset = () => {
        const probe = document.createElement('span');

        probe.style.cssText =
            'position:absolute;visibility:hidden;pointer-events:none;' +
            'display:block;block-size:0;' +
            'inline-size:var(--ck-hoverbox-internal-effective-viewport-inset)';

        panel.appendChild(probe);

        const inset = probe.getBoundingClientRect().width;

        probe.remove();

        return Number.isFinite(inset)
            ? Math.max(0, inset)
            : 0;
    };

    // Ensure accessible ARIA attributes
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');

    const show = (e) => {
        clearTimeout(hideTimer);

        // Close any other open hoverboxes on the page
        document.querySelectorAll('.ck-hoverbox.is-active')
            .forEach(other => {
                if (other !== box) {
                    other.classList.remove('is-active');

                    other.querySelector('.ck-hoverbox__trigger')
                        ?.setAttribute('aria-expanded', 'false');

                    other.querySelector('.ck-hoverbox__panel')
                        ?.setAttribute('aria-hidden', 'true');
                }
            });

        box.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');

        // Measure geometry
        const rect = panel.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const panelInset = getViewportInset();

        let startX = 0;
        let startY = 0;
        let cursorY = 0;

        if (e && e.clientX !== undefined) {
            startX = e.clientX;
            startY = e.clientY + 15;
            cursorY = e.clientY;

        } else if (e && e.touches && e.touches.length > 0) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY + 15;
            cursorY = e.touches[0].clientY;

        } else {
            // Keyboard focus or fallback position relative to trigger
            const tr = trigger.getBoundingClientRect();

            startX = tr.left;
            startY = tr.bottom + 8;
            cursorY = tr.bottom;
        }

        let finalX = startX;
        let finalY = startY;

        // 1. Horizontal clamping
        const minX = panelInset;
        const maxX = Math.max(
            minX,
            vw - rect.width - panelInset
        );

        finalX = Math.min(
            Math.max(finalX, minX),
            maxX
        );

        // 2. Vertical clamping
        // Flip upwards if overflowing the bottom edge
        if (finalY + rect.height > vh - panelInset) {
            finalY = cursorY - rect.height - 15;
        }

        // 3. Navbar safe zone protection
        const navbar = document.querySelector('.ck-navbar');

        const minNavbarHeight = navbar
            ? Math.ceil(navbar.getBoundingClientRect().height)
            : 60;

        if (finalY < minNavbarHeight + 8) {
            finalY = minNavbarHeight + 8;
        }

        // Apply final viewport coordinates
        panel.style.left = `${Math.round(finalX)}px`;
        panel.style.top = `${Math.round(finalY)}px`;
    };

    const hide = (e) => {
        if (
            e &&
            e.relatedTarget &&
            box.contains(e.relatedTarget)
        ) {
            return;
        }

        hideTimer = setTimeout(() => {
            box.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
        }, 150);
    };

    // Keyboard dismissal with Escape
    const onKeyDown = (e) => {
        if (
            e.key === 'Escape' &&
            box.classList.contains('is-active')
        ) {
            e.stopPropagation();

            box.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');

            trigger.focus();
        }
    };

    // Outside click dismissal
    const onClickOutside = (e) => {
        if (!box.contains(e.target)) {
            box.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
        }
    };

    // Close on scroll to avoid disconnected floating panels
    const onScroll = () => {
        if (box.classList.contains('is-active')) {
            box.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
        }
    };

    // Touch, pointer, and keyboard listeners
    if (window.matchMedia('(hover: none)').matches) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            box.classList.contains('is-active')
                ? hide()
                : show(e);
        });

    } else {
        trigger.addEventListener('mouseenter', show);
        trigger.addEventListener('mouseleave', hide);

        panel.addEventListener(
            'mouseenter',
            () => clearTimeout(hideTimer)
        );

        panel.addEventListener('mouseleave', hide);

        // Keyboard focus accessibility
        trigger.addEventListener('focus', () => show());
        trigger.addEventListener('blur', (e) => hide(e));
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onClickOutside);

    window.addEventListener('scroll', onScroll, {
        passive: true
    });

    // Teardown / cleanup
    return () => {
        clearTimeout(hideTimer);

        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('click', onClickOutside);
        window.removeEventListener('scroll', onScroll);
    };
}
