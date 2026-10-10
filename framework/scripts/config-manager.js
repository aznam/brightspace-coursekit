(function () {
  'use strict';
  var CK = window.BRIGHTSPACE = window.BRIGHTSPACE || {};
  var data = null, base = null, framework = null;
  function directory(root, value) { var u = new URL(value || '.', root); if (!u.pathname.endsWith('/')) u.pathname += '/'; return u.href; }
  CK.config = {
    initialize: function (json, courseRoot, frameworkRoot) {
      data = json || {}; framework = frameworkRoot;
      var siteId = data.siteId;
      base = siteId && location.pathname.startsWith('/content/enforced/')
        ? new URL('/content/enforced/' + String(siteId).replace(/^\/+|\/+$/g, '') + '/', location.origin).href
        : courseRoot;
    },
    get: function (path, fallback) {
      if (!data) throw new Error('[CourseKit config] Not initialized.');
      if (!path) return data;
      var keys = path.split('.'), value = data;
      for (var i = 0; i < keys.length; i++) {
        if (value == null || !Object.prototype.hasOwnProperty.call(Object(value), keys[i])) return fallback;
        value = value[keys[i]];
      }
      return value;
    },
    courseRoot: function () { return base; },
    frameworkRoot: function () { return framework; },
    paths: function () {
      var paths = data.paths || {}, custom = data.customPaths || {};
      return {
        root: base, assets: directory(base, paths.assets || 'assets/'),
        attachments: directory(base, paths.attachments || 'attachments/'),
        content: directory(base, paths.content || 'content/'),
        styles: directory(base, custom.styles || 'styles/'),
        scripts: directory(base, custom.scripts || 'scripts/'),
        fonts: directory(base, custom.fonts || 'fonts/'),
        schemas: directory(base, 'schemas/'), framework: framework
      };
    }
  };
})();
