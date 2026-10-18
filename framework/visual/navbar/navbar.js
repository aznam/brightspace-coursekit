/*
 * CourseKit — Navigation Bar Component Behavior
 *
 * Normative reference: CONVENTIONS.md
 * Sections 4.4, 7.1.1, 7.1.2, and WCAG 2.2 (1.4.13 Dismissable, 2.1.1 Keyboard, 4.1.2 ARIA).
 *
 * Responsibility:
 * Dynamically synchronizes --ck-navbar-offset for anchor scrolling, manages accessible
 * dropdown navigation (ARIA states, keyboard Enter/Space/Escape, outside click),
 * and performs comprehensive memory teardown.
 */

export async function set_behaviour(element) {
    const navbar = element;

    // 1. Maintain accurate --ck-navbar-offset for section scroll-margin alignment (§4.4)
    const updateOffset = () => {
        const height = Math.ceil(navbar.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--ck-navbar-offset', `${height}px`);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);

    let resizeObserver;
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(updateOffset);
        resizeObserver.observe(navbar);
    }

    const cleanups = [];

    // 2. Setup accessible dropdowns
    for (const nav of navbar.querySelectorAll('.ck-navbar__nav')) {
        const trigger = nav.querySelector('.ck-navbar__trigger');
        const dropdown = nav.querySelector('.ck-navbar__dropdown');

        if (!trigger || !dropdown) continue;

        // Ensure WCAG 4.1.2 compliant accessibility attributes
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');

        const setOpen = (isOpen) => {
            nav.classList.toggle('is-open', isOpen);
            trigger.setAttribute('aria-expanded', String(isOpen));
            dropdown.setAttribute('aria-hidden', String(!isOpen));
        };

        const toggle = (e) => {
            e.stopPropagation();
            const currentlyOpen = nav.classList.contains('is-open');
            setOpen(!currentlyOpen);
        };

        // Click / Tap activation on both touch and pointer devices
        trigger.addEventListener('click', toggle);

        // Keyboard activation on Trigger (Enter or Space) (WCAG 2.1.1)
        const onTriggerKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(e);
            } else if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                e.preventDefault();
                setOpen(false);
                trigger.focus();
            }
        };
        trigger.addEventListener('keydown', onTriggerKeyDown);

        // Escape dismissal anywhere inside the open dropdown (WCAG 1.4.13)
        const onDropdownKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
                trigger.focus();
            }
        };
        dropdown.addEventListener('keydown', onDropdownKeyDown);

        // Close when clicking any navigation link
        const onLinkClick = () => setOpen(false);
        const links = dropdown.querySelectorAll('a');
        links.forEach(link => link.addEventListener('click', onLinkClick));

        // Close on outside click
        const onDocumentClick = (e) => {
            if (!nav.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', onDocumentClick);

        // Close when focus leaves the navigation group (WCAG 2.1.2)
        const onFocusOut = (e) => {
            if (!nav.contains(e.relatedTarget)) {
                setOpen(false);
            }
        };
        nav.addEventListener('focusout', onFocusOut);

        // Register teardowns
        cleanups.push(() => {
            trigger.removeEventListener('click', toggle);
            trigger.removeEventListener('keydown', onTriggerKeyDown);
            dropdown.removeEventListener('keydown', onDropdownKeyDown);
            links.forEach(link => link.removeEventListener('click', onLinkClick));
            document.removeEventListener('click', onDocumentClick);
            nav.removeEventListener('focusout', onFocusOut);
        });
    }

    // Complete cleanup function
    return () => {
        window.removeEventListener('resize', updateOffset);
        resizeObserver?.disconnect();
        cleanups.forEach(cleanup => cleanup());
    };
}