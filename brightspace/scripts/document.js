/**
 * BRIGHTSPACE HTML FRAMEWORK — document.js
 * Base de rendu pour documents US Letter imprimables.
 *
 * Ordre recommandé :
 * course-config.js → DOCUMENT_CONFIG → modules spécialisés éventuels
 * → document.js
 */
(function () {
  'use strict';

  var CC = window.COURSE_CONFIG || {};
  var DC = window.DOCUMENT_CONFIG || {};
  var registry = window.DOCUMENT_MODULES = window.DOCUMENT_MODULES || {
    renderers: {},
    defaultCoverType: 'cover'
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveAsset(filename) {
    if (!filename) return '';
    if (/^(?:https?:|data:|\/)/i.test(filename)) return filename;
    return CC.paths && CC.paths.assets ? CC.paths.assets.replace(/\/$/, '') + '/' + filename : filename;
  }

  function applyCourseTheme() {
    var root = document.documentElement;
    var palette = CC.palette || {};
    Object.keys(palette).forEach(function (key) {
      if (palette[key]) root.style.setProperty('--' + key, palette[key]);
    });

    if (CC.fontGoogleUrl) {
      var glink = document.createElement('link');
      glink.rel = 'stylesheet';
      glink.href = CC.fontGoogleUrl;
      document.head.appendChild(glink);
    }

    if (CC.fontFile && CC.fontFamily) {
      var style = document.createElement('style');
      style.textContent = '@font-face {'
        + 'font-family:"' + String(CC.fontFamily).replace(/"/g, '\\"') + '";'
        + 'src:url("' + String(CC.fontFile).replace(/"/g, '\\"') + '") format("' + (CC.fontFormat || 'woff2') + '");'
        + 'font-display:swap;}';
      document.head.appendChild(style);
    }

    if (CC.fontFamily) {
      root.style.setProperty('--font-body', '"' + CC.fontFamily + '", -apple-system, sans-serif');
    }
  }

  function institution() {
    return CC.institution || {};
  }

  function instructorText() {
    if (!CC.instructor) return '';
    if (typeof CC.instructor === 'string') return CC.instructor;
    return [CC.instructor.name, CC.instructor.title].filter(Boolean).join(' · ');
  }

  function courseSessionText() {
    var bits = [];
    if (CC.section) bits.push('Section ' + CC.section.split('-')[1]);
    if (CC.term) bits.push(CC.term);
    if (CC.year) bits.push(String(CC.year));
    return bits.join(' · ');
  }

  function formatDate(value) {
    if (!value) return '';
    var d = new Date(value.length <= 10 ? value + 'T12:00:00' : value);
    if (isNaN(d.getTime())) return String(value);
    return new Intl.DateTimeFormat(DC.locale || 'en-CA', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(d);
  }

  function logoHtml(className) {
    var inst = institution();
    var src = resolveAsset(inst.logo);
    if (!src) return '';
    return '<img class="' + className + '" src="' + esc(src) + '" alt="' + esc(inst.name || 'Institution logo') + '">';
  }

  function buildHeader(pageNumber) {
    var sectionText = CC.section != null && CC.section !== '' ? 'Section ' + CC.section : '';
    var courseIdentity = [CC.courseCode, CC.courseTitle].filter(Boolean).join(' · ');

    return '<header class="document-header">'
      + '<div class="document-header-brand">'
      + logoHtml('document-header-logo')
      + (courseIdentity ? '<div class="document-header-course"><strong>' + esc(courseIdentity) + '</strong></div>' : '')
      + '</div>'
      + (sectionText ? '<div class="document-header-meta">' + esc(sectionText) + '</div>' : '')
      + '</header>';
  }

  function buildFooter(pageNumber, totalPages) {
    var session = [];
    if (CC.term) session.push(CC.term);
    if (CC.year) session.push(String(CC.year));

    var left = '';
    if (CC.programName || DC.footerText) {
      left = '<div class="document-footer-left">'
        + (CC.programName ? '<div class="document-footer-program">' + esc(CC.programName) + '</div>' : '')
        + (DC.footerText ? '<div class="document-footer-custom">' + esc(DC.footerText) + '</div>' : '')
        + '</div>';
    }

    return '<footer class="document-footer">'
      + left
      + '<div class="document-footer-center">' + esc(session.join(' · ')) + '</div>'
      + '<div class="document-footer-page">Page ' + pageNumber + ' of ' + totalPages + '</div>'
      + '</footer>';
  }

  function coverMetaRows() {
    var rows = [];
    var instText = instructorText();
    var session = courseSessionText();
    if (session) rows.push(['Course offering', session]);
    if (instText) rows.push(['Instructor', instText]);
    if (DC.date) rows.push(['Date', formatDate(DC.date)]);
    if (DC.version) rows.push(['Version', DC.version]);
    return rows.map(function (r) {
      return '<div class="document-cover-meta-item">'
        + '<span class="document-cover-meta-label">' + esc(r[0]) + '</span>'
        + '<span class="document-cover-meta-value">' + esc(r[1]) + '</span>'
        + '</div>';
    }).join('');
  }

  function renderGenericCover() {
    var inst = institution();
    return '<div class="document-cover-content">'
      + logoHtml('document-cover-logo')
      + '<div class="document-cover-institution">'
      + (inst.name ? '<strong>' + esc(inst.name) + '</strong>' : '')
      + (inst.faculty ? '<div>' + esc(inst.faculty) + '</div>' : '')
      + (inst.department ? '<div>' + esc(inst.department) + '</div>' : '')
      + '</div>'
      + '<hr class="document-cover-rule">'
      + '<div class="document-cover-course">'
      + esc(CC.courseCode || '')
      + (CC.courseTitle ? '<div class="document-cover-course-title">' + esc(CC.courseTitle) + '</div>' : '')
      + (CC.programName ? '<div class="document-cover-program">' + esc(CC.programName) + '</div>' : '')
      + '</div>'
      + '<div class="document-cover-title-block">'
      + (DC.kicker ? '<div class="document-cover-kicker">' + esc(DC.kicker) + '</div>' : '')
      + '<h1 class="document-cover-title">' + esc(DC.title || 'Untitled Document') + '</h1>'
      + (DC.subtitle ? '<div class="document-cover-subtitle">' + esc(DC.subtitle) + '</div>' : '')
      + '</div>'
      + '<div class="document-cover-meta">' + coverMetaRows() + '</div>'
      + '</div>';
  }

  function getSourceHtml(id) {
    if (!id) return '';
    var source = document.querySelector('template[data-document-source="' + CSS.escape(id) + '"]');
    if (!source) {
      console.warn('[document.js] Missing template source:', id);
      return '<div class="document-note"><strong>Missing document source:</strong> ' + esc(id) + '</div>';
    }
    return source.innerHTML;
  }

  function genericRenderer(page) {
    return getSourceHtml(page.id);
  }

  registry.renderers['document-blank'] = function () {
    return '';
  };

  registry.renderers['document-end'] = function () {
    return '<div class="document-end-message">END OF DOCUMENT</div>';
  };

  function normalizePages() {
    var pages = Array.isArray(DC.pages) ? DC.pages.slice() : [];
    var hasCover = pages.some(function (p) {
      return p && (p.type === 'cover' || /cover$/i.test(p.type || ''));
    });

    if (!hasCover) {
      pages.unshift({ type: registry.defaultCoverType || 'cover' });
    } else {
      var coverIndex = pages.findIndex(function (p) {
        return p && (p.type === 'cover' || /cover$/i.test(p.type || ''));
      });
      if (coverIndex > 0) {
        var cover = pages.splice(coverIndex, 1)[0];
        pages.unshift(cover);
      }
    }

    // Les pages structurelles sont gérées par le moteur :
    // 1) une page blanche immédiatement après la couverture ;
    // 2) une page de fin en dernière position.
    pages = pages.filter(function (p) {
      return p && p.type !== 'document-blank' && p.type !== 'document-end';
    });
    pages.splice(1, 0, { type: 'document-blank' });
    pages.push({ type: 'document-end' });

    return pages;
  }

  function makeSheet(page, pageNumber, totalPages) {
    var sheet = document.createElement('section');
    sheet.className = 'document-sheet';
    sheet.dataset.pageNumber = String(pageNumber);
    sheet.dataset.pageType = page.type || 'content';

    var isCover = page.type === 'cover' || /cover$/i.test(page.type || '');
    var isBlank = page.type === 'document-blank';
    var isEnd   = page.type === 'document-end';
    if (isCover) sheet.classList.add('document-cover');
    if (isBlank) sheet.classList.add('document-blank');
    if (isEnd) sheet.classList.add('document-end-page');

    if (page.className) {
      String(page.className).split(/\s+/).filter(Boolean).forEach(function (c) { sheet.classList.add(c); });
    }

    var renderer = registry.renderers[page.type] || (page.type === 'cover' ? renderGenericCover : genericRenderer);
    var bodyHtml = renderer(page, {
      course: CC,
      document: DC,
      pageNumber: pageNumber,
      totalPages: totalPages,
      esc: esc,
      resolveAsset: resolveAsset,
      formatDate: formatDate,
      getSourceHtml: getSourceHtml,
      genericCover: renderGenericCover,
      courseSessionText: courseSessionText,
      instructorText: instructorText,
      institution: institution
    }) || '';

    if (isCover) {
      sheet.innerHTML = '<div class="document-page-frame">' + bodyHtml + '</div>';
    } else if (isBlank) {
      sheet.innerHTML = '<div class="document-page-frame"></div>';
    } else {
      sheet.innerHTML = '<div class="document-page-frame">'
        + buildHeader(pageNumber)
        + '<main class="document-page-body">' + bodyHtml + '</main>'
        + buildFooter(pageNumber, totalPages)
        + '</div>';
    }

    return sheet;
  }

  function buildToolbar() {
    if (DC.showPrintToolbar === false) return;
    var toolbar = document.createElement('div');
    toolbar.className = 'document-screen-toolbar';
    toolbar.innerHTML = '<span class="document-screen-note">For clean printing, disable browser <strong>Headers and footers</strong>.</span>'
      + '<button type="button">Print document</button>';
    toolbar.querySelector('button').addEventListener('click', function () { window.print(); });
    document.body.insertBefore(toolbar, document.body.firstChild);
  }

  function resolveInlineAssets(root) {
    if (!CC.paths || !CC.paths.assets) return;
    root.querySelectorAll('img[data-asset]').forEach(function (img) {
      img.src = resolveAsset(img.getAttribute('data-asset'));
    });
  }

  function init() {
    applyCourseTheme();
    buildToolbar();

    var mount = document.getElementById('document-root');
    if (!mount) {
      console.error('[document.js] Missing #document-root mount element.');
      return;
    }

    var pages = normalizePages();
    var total = pages.length;
    pages.forEach(function (page, index) {
      mount.appendChild(makeSheet(page || {}, index + 1, total));
    });
    resolveInlineAssets(mount);

    document.documentElement.classList.add('document-ready');
    document.dispatchEvent(new CustomEvent('document:ready', { detail: { pages: pages } }));
  }

  window.DocumentFramework = {
    esc: esc,
    resolveAsset: resolveAsset,
    formatDate: formatDate
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
