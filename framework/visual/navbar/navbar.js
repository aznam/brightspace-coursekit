/*
 * CourseKit — Navigation Bar Component Behavior
 *
 * Keeps the anchor offset synchronized, manages dropdown access and
 * clamps the open dropdown to the viewport without detaching it from NAVIGATE.
 */

export async function set_behaviour(element) {
    const navbar = element;
    const cleanups = [];
    const root = document.documentElement;

    const updateOffset = () => {
        const height = Math.ceil(navbar.getBoundingClientRect().height);
        root.style.setProperty('--ck-navbar-offset', `${height}px`);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateOffset);
        resizeObserver.observe(navbar);
    }

    const measureInset = (dropdown) => {
        // Resolve the component-owned CSS length using the layout engine.
        const probe = document.createElement('span');
        probe.style.cssText =
            'position:absolute;visibility:hidden;pointer-events:none;' +
            'block-size:0;inline-size:var(--ck-navbar-internal-viewport-inset)';
        dropdown.appendChild(probe);
        const value = probe.getBoundingClientRect().width;
        probe.remove();
        return Number.isFinite(value) ? value : 0;
    };

    for (const nav of navbar.querySelectorAll('.ck-navbar__nav')) {
        const trigger = nav.querySelector('.ck-navbar__trigger');
        const dropdown = nav.querySelector('.ck-navbar__dropdown');
        if (!trigger || !dropdown) continue;

        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');

        const positionDropdown = () => {
            // Reset any offset left from a previous viewport size.
            nav.style.removeProperty('--ck-navbar-internal-dropdown-offset');

            const rect = dropdown.getBoundingClientRect();
            const viewportWidth = root.clientWidth;
            const inset = measureInset(dropdown);
            const leftBoundary = inset;
            const rightBoundary = viewportWidth - inset;

            let shift = 0;
            if (rect.right > rightBoundary) {
                shift -= rect.right - rightBoundary;
            }
            if (rect.left + shift < leftBoundary) {
                shift += leftBoundary - (rect.left + shift);
            }

            nav.style.setProperty(
                '--ck-navbar-internal-dropdown-offset',
                `${shift}px`
            );
        };

        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            trigger.setAttribute('aria-expanded', String(open));
            dropdown.setAttribute('aria-hidden', String(!open));
            if (open) positionDropdown();
        };

        const onTriggerClick = (event) => {
            event.stopPropagation();
            setOpen(!nav.classList.contains('is-open'));
        };

        const onTriggerKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                // A native button fires click for these keys; avoid double toggle.
                if (trigger.tagName.toLowerCase() !== 'button') {
                    setOpen(!nav.classList.contains('is-open'));
                }
            } else if (event.key === 'Escape') {
                if (nav.classList.contains('is-open')) {
                    event.preventDefault();
                    setOpen(false);
                    trigger.focus();
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setOpen(true);
                dropdown.querySelector('a')?.focus();
            }
        };

        const onDropdownKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setOpen(false);
                trigger.focus();
            }
        };

        const onDocumentClick = (event) => {
            if (!nav.contains(event.target)) setOpen(false);
        };

        const onFocusOut = (event) => {
            if (!nav.contains(event.relatedTarget)) setOpen(false);
        };

        // Pointer hover and keyboard focus use the same explicit state.
        const onPointerEnter = (event) => {
            if (event.pointerType === 'mouse') setOpen(true);
        };
        const onPointerLeave = (event) => {
            if (event.pointerType === 'mouse' && !nav.contains(document.activeElement)) {
                setOpen(false);
            }
        };
        const onWindowResize = () => {
            if (nav.classList.contains('is-open')) positionDropdown();
        };
        const onLinkClick = () => setOpen(false);
        const links = [...dropdown.querySelectorAll('a')];

        trigger.addEventListener('click', onTriggerClick);
        trigger.addEventListener('keydown', onTriggerKeyDown);
        dropdown.addEventListener('keydown', onDropdownKeyDown);
        document.addEventListener('click', onDocumentClick);
        nav.addEventListener('focusout', onFocusOut);
        nav.addEventListener('pointerenter', onPointerEnter);
        nav.addEventListener('pointerleave', onPointerLeave);
        window.addEventListener('resize', onWindowResize);
        links.forEach(link => link.addEventListener('click', onLinkClick));

        cleanups.push(() => {
            trigger.removeEventListener('click', onTriggerClick);
            trigger.removeEventListener('keydown', onTriggerKeyDown);
            dropdown.removeEventListener('keydown', onDropdownKeyDown);
            document.removeEventListener('click', onDocumentClick);
            nav.removeEventListener('focusout', onFocusOut);
            nav.removeEventListener('pointerenter', onPointerEnter);
            nav.removeEventListener('pointerleave', onPointerLeave);
            window.removeEventListener('resize', onWindowResize);
            links.forEach(link => link.removeEventListener('click', onLinkClick));
            nav.style.removeProperty('--ck-navbar-internal-dropdown-offset');
        });
    }

    return () => {
        window.removeEventListener('resize', updateOffset);
        resizeObserver?.disconnect();
        cleanups.forEach(cleanup => cleanup());
    };
}
