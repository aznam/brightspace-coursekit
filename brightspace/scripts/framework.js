/**
 * BRIGHTSPACE HTML FRAMEWORK — framework.js
 * ─────────────────────────────────────────────
 * Chargé APRÈS course-config.js dans chaque page HTML.
 *
 * Responsabilités :
 *   1. Appliquer les variables CSS (palette, images, font) depuis COURSE_CONFIG
 *   2. Construire et injecter la barre sticky (#fw-sticky-bar)
 *   3. Construire et injecter le hero (#fw-hero)
 *   4. Initialiser les hoverboxes (desktop hover + mobile clic, clamping viewport)
 *   5. Initialiser le menu déroulant navbar sur mobile (clic)
 *
 * Chaque page déclare window.PAGE_CONFIG avant ce script :
 *   window.PAGE_CONFIG = {
 *     pageShortTitle : 'The Course',
 *     moduleTitle    : 'Getting Started',
 *     heroTitle      : null,          // surcharge COURSE_CONFIG.heroTitle si fourni
 *     heroSubtitle   : null,          // idem
 *     navSections    : [              // sections listées dans le menu déroulant
 *       { id: 'section-learn',     label: "What You'll Learn" },
 *       { id: 'section-pedagogy',  label: 'Pedagogical Approach' },
 *     ],
 *     sidebarMobileOrder: 'before',   // 'before' | 'after' | null (desktop uniquement)
 *   };
 * 
 *    
 */

(function () {
  'use strict';

  /* ── 0. Configs ───────────────────────────────────────── */
  var CC = window.COURSE_CONFIG || {};
  var PC = window.PAGE_CONFIG   || {};

  /* ── 1. Variables CSS ─────────────────────────────────── */
  var root = document.documentElement;

  // Palette
  var palette = CC.palette || {};
  Object.keys(palette).forEach(function (key) {
    if (palette[key]) root.style.setProperty('--' + key, palette[key]);
  });

  // Images de fond
  if (CC.backgroundImage) {
    root.style.setProperty('--bg-image', 'url("' + CC.backgroundImage + '")');
  }
  if (CC.heroImage) {
    root.style.setProperty('--hero-image', 'url("' + CC.heroImage + '")');
  }

  // A) Google Fonts
  if (CC.fontGoogleUrl) {
    var glink = document.createElement('link');
    glink.rel  = 'stylesheet';
    glink.href = CC.fontGoogleUrl;
    document.head.appendChild(glink);
  }

  // B) Police locale (brightspace/fonts/)
  if (CC.fontFile && CC.fontFamily) {
    var style = document.createElement('style');
    style.textContent =
      '@font-face {'
      + ' font-family: "' + CC.fontFamily + '";'
      + ' src: url("' + CC.fontFile + '") format("' + (CC.fontFormat || 'woff2') + '");'
      + ' font-display: swap;'
      + '}';
    document.head.appendChild(style);
  }

  // C) Appliquer la famille (tous les cas)
  if (CC.fontFamily) {
    root.style.setProperty('--font-body', '"' + CC.fontFamily + '", -apple-system, sans-serif');
  }

  /* ── Normalisation ASSIGNMENT_CONFIG ──────────────────── */
  function normalizeAC(raw) {
    var dl  = raw.deadline || {};
    var ext = dl.extension || null;
    return {
      assignmentNumber : raw.assignmentNumber  != null ? raw.assignmentNumber  : null,
      assignmentLabel  : raw.assignmentLabel   || 'Assignment',

      openDate  : raw.openDate || null,
      deadline  : {
        date      : dl.date  || null,
        type      : dl.type  || 'hard',
        extension : ext ? { date: ext.date || null, reason: ext.reason || '' } : null,
      },

      submissionType : raw.submissionType || 'individual',
      groupSize      : raw.groupSize      || null,
      submissionUrl  : raw.submissionUrl  || '#',

      aiPolicy : raw.aiPolicy || 'default',

      learningOutcomes : Array.isArray(raw.learningOutcomes)
        ? raw.learningOutcomes.map(function (lo) {
            if (typeof lo === 'string') {
              return { code: lo, label: '' };
            }
            return {
              code  : lo.code  || null,
              label : lo.label || '',
            };
          })
        : [],
      estimatedTime    : raw.estimatedTime || null,
      difficulty       : raw.difficulty    || null,
      weight           : raw.weight        != null ? raw.weight : null,
      points           : raw.points        != null ? raw.points : null,
      rubricsProvided  : !!raw.rubricsProvided,

      resources : Array.isArray(raw.resources) ? raw.resources : [],
    };
  }

  /* ── 2. Browser document title ────────────────────────── */
  function buildDocumentTitle() {
    var courseCode = CC.courseCode || '';
    var pageTitle  = PC.pageShortTitle || PC.heroTitle || CC.heroTitle || '';

    var parts = [];
    if (courseCode) parts.push(courseCode);
    if (pageTitle) parts.push(pageTitle);

    document.title = parts.join(' - ');
  }

  /* ── 3. Sticky bar ────────────────────────────────────── */
  function buildNavbar() {
    var bar = document.getElementById('fw-sticky-bar');
    if (!bar) return;

    var courseCode   = CC.courseCode        || '';
    var pageTitle    = PC.pageShortTitle    || '';
    var moduleTitle  = PC.moduleTitle       || '';
    var sections     = PC.navSections       || [];

    var linksHtml = sections.map(function (s) {
      return '<a href="#' + s.id + '">' + window.escHtml(s.label) + '</a>';
    }).join('');

    var navHtml = sections.length > 0
      ? '<div class="sticky-nav">'
        + '<span class="nav-trigger">Navigate ▾</span>'
        + '<div class="nav-dropdown">' + linksHtml + '</div>'
        + '</div>'
      : '';

    bar.className = 'edtech-sticky-bar';
    bar.innerHTML =
      '<div class="sticky-info">'
      + (courseCode ? '<div class="sticky-chapter">' + window.escHtml(courseCode) + '</div>' : '')
      + (pageTitle  ? '<div class="sticky-title">'   + window.escHtml(pageTitle)  + '</div>' : '')
      + navHtml
      + '</div>'
      + (moduleTitle ? '<div class="sticky-module">' + window.escHtml(moduleTitle) + '</div>' : '');
  }

  /* ── 3. Hero ──────────────────────────────────────────── */
  function buildHero() {
    var hero = document.getElementById('fw-hero');
    if (!hero) return;

    var title    = PC.heroTitle    || CC.heroTitle    || '';
    var subtitle = PC.heroSubtitle || CC.heroSubtitle || '';
    hero.className = 'edtech-hero';
    hero.innerHTML =
      (title    ? '<h1>' + window.escHtml(title)    + '</h1>' : '')
      + (subtitle ? '<p>'  + window.escHtml(subtitle) + '</p>'  : '');
  }

  /* ── Inline table of contents ───────────────────────────── */
  function buildInlineToc() {
    var toc = document.querySelector('.inline-toc');
    if (!toc) return;

    var sections = PC.navSections || [];

    if (!sections.length) {
      toc.remove();
      return;
    }

    var html = '<strong>On this page:</strong>';

    sections.forEach(function (section, index) {
      if (index > 0) {
        html += '<span class="toc-separator">•</span>';
      }

      html +=
        '<a href="#' + section.id + '">' +
        window.escHtml(section.label) +
        '</a>';
    });

    toc.className = 'inline-toc';
    toc.innerHTML = html;
  }

  /* ── 4. Hoverboxes (Position Curseurs Gelée & Viewport) ── */
  window.initHoverboxes = function () {
    var PANEL_PADDING = 20; 
    var NAVBAR_HEIGHT = 75; // L'espace protégé en haut pour la Navbar
    var isTouchDevice = window.matchMedia('(hover: none)').matches;

    document.querySelectorAll('.hover-trigger').forEach(function (trigger) {
      var panel = trigger.querySelector('.hover-panel');
      if (!panel) return;
      var hideTimer;

      function showPanel(e) {
        clearTimeout(hideTimer);
        if (trigger.classList.contains('active')) return;

        // Fermer les autres boîtes
        document.querySelectorAll('.hover-trigger.active').forEach(function (t) {
          if (t !== trigger) t.classList.remove('active');
        });

        panel.style.left = '0px';
        panel.style.top = '0px';
        trigger.classList.add('active');

        var rect = panel.getBoundingClientRect();
        var vw = document.documentElement.clientWidth; 
        var vh = document.documentElement.clientHeight;

        var startX = 0, startY = 0, cursorY = 0;

        if (e && e.clientX !== undefined) {
          startX = e.clientX;
          startY = e.clientY + 15; 
          cursorY = e.clientY;
        } else if (e && e.touches && e.touches.length > 0) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY + 15;
          cursorY = e.touches[0].clientY;
        } else {
          var rectTrigger = trigger.getBoundingClientRect();
          startX = rectTrigger.left;
          startY = rectTrigger.bottom + 5;
          cursorY = rectTrigger.bottom;
        }

        var finalX = startX;
        var finalY = startY;

        // Clamping X (Dépassement à droite ou à gauche)
        if (finalX + rect.width > vw - PANEL_PADDING) {
          finalX = vw - rect.width - PANEL_PADDING;
        }
        if (finalX < PANEL_PADDING) {
          finalX = PANEL_PADDING;
        }

        // Clamping Y (Dépassement en bas)
        if (finalY + rect.height > vh - PANEL_PADDING) {
          finalY = cursorY - rect.height - 15; 
        }

        // SÉCURITÉ ABSOLUE : On interdit de chevaucher la Navbar en haut
        if (finalY < NAVBAR_HEIGHT) {
          finalY = NAVBAR_HEIGHT + 10;
        }

        panel.style.left = finalX + 'px';
        panel.style.top = finalY + 'px';
      }

      function hidePanel(e) {
        if (e && e.relatedTarget && trigger.contains(e.relatedTarget)) {
          return;
        }
        hideTimer = setTimeout(function() {
          trigger.classList.remove('active');
        }, 200); 
      }

      if (isTouchDevice) {
        trigger.addEventListener('click', function (e) {
          e.stopPropagation();
          if (trigger.classList.contains('active')) {
            trigger.classList.remove('active');
          } else {
            showPanel(e);
          }
        });
      } else {
        trigger.addEventListener('mouseenter', showPanel);
        trigger.addEventListener('mouseleave', hidePanel);
        panel.addEventListener('mouseleave', hidePanel);
        panel.addEventListener('mouseenter', function() { clearTimeout(hideTimer); });
      }
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.hover-trigger.active').forEach(function (t) {
        t.classList.remove('active');
      });
    });
  }

  /* ── 5. Menu déroulant navbar (clic mobile) ────────────── */
  function initNavClick() {
    document.addEventListener('click', function (e) {
      var nav = e.target.closest('.sticky-nav');
      if (nav) {
        // Sur desktop, CSS :hover gère déjà → seulement utile en touch
        if (window.matchMedia('(hover: none)').matches) {
          e.stopPropagation();
          nav.classList.toggle('open');
        }
      } else {
        document.querySelectorAll('.sticky-nav.open').forEach(function (n) {
          n.classList.remove('open');
        });
      }
    });
  }
  
  /* ── Auto-Numérotation ─────────────────────────────────── */
  function applyAutoNumbering() {
    if (!PC.autoNumberSections) return;
    
    var sections = PC.navSections || [];
    sections.forEach(function(sec, index) {
      var prefix = (index + 1) + '. ';
      
      // 1. Met à jour le label pour le menu déroulant
      sec.label = prefix + sec.label;
      
      // 2. Met à jour le titre <h2> dans la page
      var h2 = document.getElementById(sec.id);
      if (h2) {
        h2.insertBefore(document.createTextNode(prefix), h2.firstChild);
      }
      
      // 3. Met à jour le lien dans la table des matières (.inline-toc)
      var tocLink = document.querySelector('.inline-toc a[href="#' + sec.id + '"]');
      if (tocLink) {
        tocLink.insertBefore(document.createTextNode(prefix), tocLink.firstChild);
      }
    });
  }

  /* ── Utilitaire ────────────────────────────────────────── */
  window.escHtml = function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Emoji markers ─────────────────────────────────────── */
function resolveEmojis() {
  var emojis = CC.emojis || {};

  document.querySelectorAll('[data-emoji]').forEach(function (el) {
    var key = el.getAttribute('data-emoji');
    if (!key) return;

    if (!Object.prototype.hasOwnProperty.call(emojis, key)) {
      console.warn(
        '[Brightspace framework] Unknown emoji key: "' + key + '"'
      );
      return;
    }

    el.textContent = emojis[key];
  });
}
  
  /* ── Injection automatique des images (data-asset & data-bg-asset) ──────── */
  function resolveAssets() {
    if (!CC.paths || !CC.paths.assets) return;
    
    // 1. Pour les balises <img> classiques
    document.querySelectorAll('img[data-asset]').forEach(function(img) {
      var filename = img.getAttribute('data-asset');
      img.src = CC.paths.assets + '/' + filename;
    });

    // 2. Pour les images de fond CSS (background-image)
    document.querySelectorAll('[data-bg-asset]').forEach(function(el) {
      var filename = el.getAttribute('data-bg-asset');
      // On crée une variable CSS spécifique à cet élément
      el.style.setProperty('--asset-url', 'url("' + CC.paths.assets + '/' + filename + '")');
    });
  }
/* ── Init ──────────────────────────────────────────────── */
  function init() {
    buildDocumentTitle();
    applyAutoNumbering();
    resolveEmojis();
    resolveAssets();
    buildNavbar();
    buildHero();
    buildInlineToc()
    initHoverboxes();
    initNavClick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
