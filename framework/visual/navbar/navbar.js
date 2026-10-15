export async function set_behaviour(element) {
    const navbar = element;

    const updateOffset = () => {
        const height = Math.ceil(navbar.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--ck-navbar-offset', height + 'px');
    };
    
    updateOffset();
    window.addEventListener('resize', updateOffset);
    
    let resizeObserver;
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(updateOffset);
        resizeObserver.observe(navbar);
    }
    
    const onDocumentClick = [];
    
    for (const nav of navbar.querySelectorAll('.ck-navbar__nav')) {
        const trigger = nav.querySelector('.ck-navbar__trigger');
        
        trigger.addEventListener('click', event => {
            if (window.matchMedia('(hover: none)').matches) {
                event.stopPropagation();
                nav.classList.toggle('is-open');
            }
        });
        
        // Ferme le dropdown quand on clique sur un lien
        for (const link of nav.querySelectorAll('.ck-navbar__dropdown a')) {
            link.addEventListener('click', () => nav.classList.remove('is-open'));
        }
        
        // Ferme le menu si on clique en dehors
        const closeOnOutside = event => {
            if (!nav.contains(event.target)) nav.classList.remove('is-open');
        };
        
        document.addEventListener('click', closeOnOutside);
        onDocumentClick.push(closeOnOutside);
    }
    
    // Fonction de nettoyage (cleanup)
    return () => { 
        window.removeEventListener('resize', updateOffset); 
        resizeObserver?.disconnect(); 
        for (const listener of onDocumentClick) document.removeEventListener('click', listener); 
    };
}