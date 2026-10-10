(function(){
  'use strict';
  window.BRIGHTSPACE.components.registerBehavior('navbar',function(root){
    var navbar = root.querySelector('.ck-navbar');

    function updateNavbarOffset(){
      if (!navbar) return;
      var height = Math.ceil(navbar.getBoundingClientRect().height);
      root.style.setProperty('--ck-navbar-offset', height + 'px');
    }

    updateNavbarOffset();
    window.addEventListener('resize', updateNavbarOffset);
    if (window.ResizeObserver && navbar) {
      new ResizeObserver(updateNavbarOffset).observe(navbar);
    }

    root.querySelectorAll('.ck-navbar__nav').forEach(function(nav){
      var trigger=nav.querySelector('.ck-navbar__trigger');
      if(!trigger)return;
      trigger.addEventListener('click',function(e){
        if(window.matchMedia('(hover: none)').matches){
          e.stopPropagation();
          nav.classList.toggle('is-open');
        }
      });

      nav.querySelectorAll('.ck-navbar__dropdown a[href^="#"]').forEach(function(link){
        link.addEventListener('click', function(){
          nav.classList.remove('is-open');
        });
      });
    });

    document.addEventListener('click',function(){
      root.querySelectorAll('.ck-navbar__nav.is-open').forEach(function(n){n.classList.remove('is-open');});
    });
  });
})();
