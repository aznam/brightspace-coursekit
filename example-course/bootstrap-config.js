/**
 * CourseKit — course bootstrap configuration.
 * Only edit the three paths in USER CONFIGURATION.
 * All paths are relative to THIS file, except courseConfig, which is
 * relative to courseRoot. Absolute URLs are also accepted.
 */

// ============================================================
// USER CONFIGURATION — EDIT THIS BLOCK ONLY
// ============================================================

const frameworkPath = '../framework/';
const courseRoot = './';
const courseConfig = 'course.json';


// ============================================================
// COURSEKIT INITIALIZATION — DO NOT MODIFY
// ============================================================

(function () {
  'use strict';

  const host = document.currentScript;

  if (!host || !host.src) {
    throw new Error(
      '[CourseKit] bootstrap-config.js must be loaded using a script src.'
    );
  }

  const framework = new URL(frameworkPath, host.src);
  const course = new URL(courseRoot, host.src);

  const loader = document.createElement('script');

  loader.src = new URL('bootstrap.js', framework).href;
  loader.dataset.courseRoot = course.href;
  loader.dataset.courseConfig = new URL(courseConfig, course).href;
  loader.dataset.content = host.dataset.content || '';

  loader.async = false;
  loader.onerror = () => {
    console.error('[CourseKit] Cannot load ' + loader.src);
  };

  document.head.appendChild(loader);
})();