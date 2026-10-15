export async function set_behaviour(element) {
    const box = element;
    const trigger = box.querySelector('.ck-hoverbox__trigger');
    const panel = box.querySelector('.ck-hoverbox__panel');
    
    if (!trigger || !panel) return;
    
    let timer;
    const PANEL_PADDING = 20;

    // Fonction blindée pour injecter du CSS (HTML ou XML)
    const setStyle = (el, prop, val) => {
        if (el.style) {
            el.style[prop] = val;
        } else {
            let cssText = el.getAttribute('style') || '';
            const regex = new RegExp(`${prop}\\s*:[^;]+;?`, 'g');
            cssText = cssText.replace(regex, '').trim();
            el.setAttribute('style', `${cssText} ${prop}: ${val};`);
        }
    };

    const show = (e) => {
        clearTimeout(timer);
        
        // Fermer les autres boîtes
        document.querySelectorAll('.ck-hoverbox.is-active').forEach(other => {
            if (other !== box) other.classList.remove('is-active');
        });
        
        box.classList.add('is-active');
        
        const rect = panel.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        
        let startX = 0, startY = 0, cursorY = 0;

        // Support exact du framework.js d'origine (Souris vs Tactile vs Fallback)
        if (e && e.clientX !== undefined) {
            startX = e.clientX;
            startY = e.clientY + 15;
            cursorY = e.clientY;
        } else if (e && e.touches && e.touches.length > 0) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY + 15;
            cursorY = e.touches[0].clientY;
        } else {
            const tr = trigger.getBoundingClientRect();
            startX = tr.left;
            startY = tr.bottom + 5;
            cursorY = tr.bottom;
        }

        let finalX = startX;
        let finalY = startY;

        // 1. Clamping X (Dépassement à droite ou à gauche)
        if (finalX + rect.width > vw - PANEL_PADDING) {
            finalX = vw - rect.width - PANEL_PADDING;
        }
        if (finalX < PANEL_PADDING) {
            finalX = PANEL_PADDING;
        }

        // 2. Clamping Y (Dépassement en bas de l'écran)
        if (finalY + rect.height > vh - PANEL_PADDING) {
            finalY = cursorY - rect.height - 15; 
        }

        // 3. Sécurité Navbar (On récupère la vraie hauteur ou on force)
        const navbar = document.querySelector('.ck-navbar');
        const minNavbarHeight = navbar ? Math.ceil(navbar.getBoundingClientRect().height) : 75;
        if (finalY < minNavbarHeight) {
            finalY = minNavbarHeight + 10;
        }

        // SUPPRESSION DU CALCUL FAUX (cr.left / cr.top) car on est en position: fixed !
        
        setStyle(panel, 'left', finalX + 'px');
        setStyle(panel, 'top', finalY + 'px');
    };

    const hide = (e) => {
        if (e && e.relatedTarget && box.contains(e.relatedTarget)) return;
        timer = setTimeout(() => box.classList.remove('is-active'), 200); // 200ms comme à l'origine
    };

    if (window.matchMedia('(hover: none)').matches) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            box.classList.contains('is-active') ? hide() : show(e);
        });
    } else {
        trigger.addEventListener('mouseenter', show);
        trigger.addEventListener('mouseleave', hide);
        panel.addEventListener('mouseenter', () => clearTimeout(timer));
        panel.addEventListener('mouseleave', hide);
    }

    const clickOutside = () => box.classList.remove('is-active');
    document.addEventListener('click', clickOutside);

    return () => {
        clearTimeout(timer);
        document.removeEventListener('click', clickOutside);
    };
}