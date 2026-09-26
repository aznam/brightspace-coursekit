/**
 * ─────────────────────────────────────────────
 * BRIGHTSPACE COURSE CONFIG — course-config.js
 * ─────────────────────────────────────────────
 */

(function () {

  /* ══════════════════════════════════════════════════════
     ▶  Brightspace Course Folder Id
     ══════════════════════════════════════════════════════ */
  var siteId = 'courseId'; // Example: 227327-COMP8117-1-R-2026F

  /* ══════════════════════════════════════════════════════
     ▶  Derived paths (do not modify) 
     ══════════════════════════════════════════════════════ */
  var root        = '/content/enforced/' + siteId;
  var brightspace = root        + '/brightspace';
  var attachments = root        + '/attachments';
  var assets      = brightspace + '/assets';
  var fonts       = brightspace + '/fonts';
  var scripts     = brightspace + '/scripts';
  var styles      = brightspace + '/styles';

  /* ══════════════════════════════════════════════════════
     ▶  Customize this section 
     ══════════════════════════════════════════════════════ */
  window.COURSE_CONFIG = {

    /* ── Identity ───────────────────────────────────────── */
    courseCode:   '', // Example: COMP-8117
    courseTitle:  '', // Example: Applied Software Engineering

    /* ── Hero content (default value for all pages in this course) */
    heroTitle:    '', // Example: Applied Software Engineering
    heroSubtitle: '', // Example: Engineering complex software systems...

    /* ── Paths (accessible from pages if needed) ────────── */
    paths: {
      root,
      brightspace,
      assets,
      fonts,
      scripts,
      styles,
      attachments,
    },

    /* ── Images ─────────────────────────────────────────── */
    backgroundImage: assets + '/body.avif',
    heroImage:       assets + '/hero.avif',

    /* ── Color palette ───────────────────────────────────
       Leave {} to keep framework defaults.
       Uncomment and edit only the keys you want to override:
       palette: {
         'accent':        '#c2410c',  // primary color — links, accents, strong borders
         'accent-light':  '#ffedd5',  // light accent background — hover states, badges
         'structure':     '#1e293b',  // navbar, box headers, structural elements
         'text-main':     '#334155',  // body text
         'text-dark':     '#0f172a',  // headings, strong text
         'border':        '#e2e8f0',  // light borders
       },                                                       */
    palette: {},

    /* ── Default Font ────────────────────────────────────────────
       A) Google Fonts  → fontGoogleUrl + fontFamily
       B) Local file    → fontFile (in brightspace/fonts/) + fontFamily
       C) System font   → fontFamily only
       All null         → system font stack (default)           */
    fontGoogleUrl: null,
    fontFile:      null,
    fontFormat:    'woff2',
    fontFamily:    null,

    /* ── Emojis ──────────────────────────────────────────
       Accessible via window.COURSE_CONFIG.emojis.<key>         */
    emojis: {
      tip:       '💡',
      warning:   '⚠️',
      note:      '📝',
      important: '🔑',
      error:     '🚨',
      success:   '✅',
      info:      'ℹ️',
    },

  };

})();