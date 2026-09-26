/*
 * COURSE / PROJECT MODULE REGISTRY
 * --------------------------------
 * Register only modules that are not distributed with the shared framework.
 */
(function () {
  'use strict';

  if (
    !window.BRIGHTSPACE ||
    typeof window.BRIGHTSPACE.registerModule !== 'function'
  ) {
    throw new Error(
      '[Course modules] Brightspace module registration API is unavailable.'
    );
  }

  /*
  window.BRIGHTSPACE.registerModule('example-module', {
    css: [
      'styles/example-module.css'
    ],
    js: [
      'scripts/example-module.js'
    ],
    allowedPageTypes: [
      'course-page'
    ],
    dependsOn: []
  });
  */

})();
