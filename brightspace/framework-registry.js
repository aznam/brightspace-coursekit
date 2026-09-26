/*
 * BRIGHTSPACE FRAMEWORK REGISTRY
 * ------------------------------
 * Registers page types and optional modules distributed with the
 * shared framework.
 *
 * Paths are resolved relative to this registry file.
 */
(function () {
  'use strict';

  if (
    !window.BRIGHTSPACE ||
    typeof window.BRIGHTSPACE.registerPageType !== 'function' ||
    typeof window.BRIGHTSPACE.registerModule !== 'function'
  ) {
    throw new Error(
      '[Brightspace framework registry] Bootstrap registration API is unavailable.'
    );
  }

  /* ---------------------------------------------------------
     PAGE TYPES
     --------------------------------------------------------- */

  window.BRIGHTSPACE.registerPageType('course-page', {
    css: [
      'styles/framework.css'
    ],
    js: [
      'scripts/framework.js'
    ]
  });

  window.BRIGHTSPACE.registerPageType('assignment-page', {
    css: [
      'styles/framework.css',
      'styles/assignment.css'
    ],
    js: [
      'scripts/framework.js',
      'scripts/assignment.js'
    ]
  });

  window.BRIGHTSPACE.registerPageType('printable-document', {
    css: [
      'styles/document.css'
    ],
    js: [
      'scripts/document.js'
    ]
  });

  window.BRIGHTSPACE.registerPageType('printable-assignment', {
    css: [
      'styles/document.css',
      'styles/written-assignment.css'
    ],
    js: [
      'scripts/written-assignment.js',
      'scripts/document.js'
    ]
  });

  /* ---------------------------------------------------------
     OPTIONAL MODULES PROVIDED BY THE FRAMEWORK
     --------------------------------------------------------- */


  window.BRIGHTSPACE.registerModule('sprites', {
    css: [
      'styles/sprites.css'
    ],
    js: [
      'scripts/sprites.js'
    ],
    allowedPageTypes: null,
    dependsOn: []
  });

  window.BRIGHTSPACE.registerModule('tabler-icons', {
    css: [
      'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css'
    ],
    js: [],
    allowedPageTypes: null,
    dependsOn: []
  });

})();
