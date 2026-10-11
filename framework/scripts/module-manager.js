(function () {
  'use strict';
  var CK = window.BRIGHTSPACE;
  function requireStrings(value, description) {
    if (!Array.isArray(value) || !value.every(function (x) { return typeof x === 'string' && !!x.trim(); })) {
      throw new Error('[CourseKit modules] Expected nonempty string array: ' + description);
    }
    return value;
  }
  async function json(url) {
    var r = await fetch(url, {credentials:'same-origin',cache:'no-store'});
    if (!r.ok) throw new Error('[CourseKit modules] Cannot load ' + url + ' (' + r.status + ')');
    return r.json();
  }
  CK.moduleManager = {
    load: async function (entries, loadCss, loadScript) {
      requireStrings(entries, 'course.json.modules');
      var componentPaths = Object.create(null), componentIds = [], moduleIds = Object.create(null);
      var styles = [], scripts = [];
      for (var i = 0; i < entries.length; i++) {
        // The module location is declared by the course, independent of the host HTML.
        var manifestUrl = new URL(entries[i], CK.config.courseRoot()).href;
        var manifest = await json(manifestUrl);
        if (!manifest || typeof manifest.id !== 'string' || !manifest.id || !manifest.name || !manifest.version || !manifest.namespace) {
          throw new Error('[CourseKit modules] Invalid module manifest: ' + manifestUrl);
        }
        if (moduleIds[manifest.id]) throw new Error('[CourseKit modules] Duplicate module id: ' + manifest.id);
        moduleIds[manifest.id] = true;
        if ((manifest.dependsOn || []).length || (manifest.pages || []).length) {
          throw new Error('[CourseKit modules] Module dependencies and custom page types are not supported: ' + manifest.id);
        }
        var base = new URL('.', manifestUrl).href;
        var components = manifest.components || [];
        if (!Array.isArray(components)) throw new Error('[CourseKit modules] Invalid components in ' + manifest.id);
        for (var j = 0; j < components.length; j++) {
          var item = components[j];
          var id = typeof item === 'string' ? item : item && item.id;
          var file = typeof item === 'string' ? 'components/' + item + '/component.json' : item && item.manifest;
          if (!id || typeof id !== 'string' || !file || typeof file !== 'string') throw new Error('[CourseKit modules] Invalid component entry in ' + manifest.id);
          if (componentPaths[id]) throw new Error('[CourseKit modules] Duplicate component id: ' + id);
          componentPaths[id] = new URL(file, base).href;
          componentIds.push(id);
        }
        requireStrings(manifest.styles || [], manifest.id + '.styles').forEach(function (file) { styles.push(new URL(file, base).href); });
        requireStrings(manifest.scripts || [], manifest.id + '.scripts').forEach(function (file) { scripts.push(new URL(file, base).href); });
      }
      // Never silently replace the native page component definitions.
      var nativeIds = (CK.moduleManager.nativeComponents || []);
      componentIds.forEach(function (id) {
        if (nativeIds.indexOf(id) !== -1) throw new Error('[CourseKit modules] Cannot override native component: ' + id);
      });
      CK.componentManager.registerSources(componentPaths);
      for (var k = 0; k < styles.length; k++) await loadCss(styles[k]);
      for (var l = 0; l < scripts.length; l++) await loadScript(scripts[l]);
      return componentIds;
    }
  };
})();
