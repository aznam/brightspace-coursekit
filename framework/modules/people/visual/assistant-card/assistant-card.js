/**
 * CourseKit assistant-card behavior.
 * Presentation remains in assistant-card.css; this module only manages interaction.
 * Registered by component.json and invoked by Renderer.setBehavior().
 */
export function set_behaviour(element) {
    const trigger = element.querySelector('.ck-assistant-card__trigger');
    const drawer = element.querySelector('.ck-assistant-card__drawer');
    const profile = element.querySelector('.ck-assistant-card__profile');
    if (!trigger || !drawer || !profile) return () => {};

    const setOpen = (open) => {
        element.classList.toggle('ck-assistant-card--open', open);
        trigger.setAttribute('aria-expanded', String(open));
        drawer.setAttribute('aria-hidden', String(!open));
    };

    const onPointerEnter = () => setOpen(true);
    // The actions pane is outside the profile: entering it must close the drawer.
    // Closing on the entire card would leave it open above the action buttons.
    const onPointerLeave = () => setOpen(false);
    const onClick = () => setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
            trigger.focus();
        }
    };
    const onFocusOut = (event) => {
        if (!element.contains(event.relatedTarget)) setOpen(false);
    };
    // When reached with the keyboard, the button opens the drawer as well.
    const onFocus = () => setOpen(true);

    setOpen(false);
    trigger.addEventListener('mouseenter', onPointerEnter);
    trigger.addEventListener('focus', onFocus);
    trigger.addEventListener('click', onClick);
    profile.addEventListener('mouseleave', onPointerLeave);
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('focusout', onFocusOut);

    return () => {
        trigger.removeEventListener('mouseenter', onPointerEnter);
        trigger.removeEventListener('focus', onFocus);
        trigger.removeEventListener('click', onClick);
        profile.removeEventListener('mouseleave', onPointerLeave);
        element.removeEventListener('keydown', onKeyDown);
        element.removeEventListener('focusout', onFocusOut);
        setOpen(false);
    };
}
