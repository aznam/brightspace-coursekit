(function () {
  'use strict';
  var host = document.currentScript;
  if (!host || !host.src) throw new Error('[CourseKit bootstrap] Missing bootstrap URL.');
  var frameworkBase = new URL('.', host.src).href;
  var script = document.createElement('script');
  script.src = new URL('scripts/runtime.js', frameworkBase).href;
  script.async = false;
  script.dataset.frameworkBase = frameworkBase;
  script.dataset.courseRoot = host.dataset.courseRoot || '.';
  script.dataset.courseConfig = host.dataset.courseConfig || 'course.json';
  script.dataset.content = host.dataset.content || '';
  script.onerror = function () { console.error('[CourseKit] Cannot load runtime: ' + script.src); };
  document.head.appendChild(script);
})();
