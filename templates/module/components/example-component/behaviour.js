let initialized = false;

/**
 * Interactive behavior attached to the component.
 * MUST be exported as 'set_behaviour' (or 'mount' depending on your ComponentsManager setup).
 * 
 * @param {HTMLElement} element - The rendered DOM element
 * @param {Element} xml - The original XML node
 */
export async function set_behaviour(element, xml) {
    if (initialized) return;
    initialized = true;

    // Add your event listeners and interactive logic here
    // Example:
    /*
    element.addEventListener('click', (e) => {
        console.log('Component clicked!');
    });
    */
   
    // Optional: return a cleanup function called when the component is destroyed
    /*
    return () => {
        // Remove event listeners, clear intervals, etc.
    };
    */
}