(function () {
  'use strict';
  var host = document.currentScript;
  var base = host.dataset.frameworkBase;
  var courseRoot = new URL(host.dataset.courseRoot || '.', base).href;
  var courseConfigUrl = new URL(host.dataset.courseConfig || 'course.json', courseRoot).href;
  var content = host.dataset.content || new URL(location.href).searchParams.get('content');
  var CK = window.BRIGHTSPACE = window.BRIGHTSPACE || {};
  function loadScript(url) { return new Promise(function (resolve, reject) { var s = document.createElement('script'); s.src = url; s.async = false; s.onload = resolve; s.onerror = function () { reject(new Error('[CourseKit runtime] Cannot load ' + url)); }; document.head.appendChild(s); }); }
  function loadCss(url) { return new Promise(function (resolve, reject) { var el = document.createElement('link'); el.rel = 'stylesheet'; el.href = url; el.onload = resolve; el.onerror = function () { reject(new Error('[CourseKit runtime] Cannot load ' + url)); }; document.head.appendChild(el); }); }
  async function getJson(url) { var res = await fetch(url, {credentials:'same-origin',cache:'no-store'}); if (!res.ok) throw new Error('[CourseKit runtime] Cannot read ' + url); return res.json(); }
  async function start() {
    var services = ['config-manager', 'resource-provider', 'style-manager', 'font-loader', 'link-resolver', 'xml-resource-manager', 'component-manager'];
    for (var i = 0; i < services.length; i++) await loadScript(new URL('scripts/' + services[i] + '.js', base).href);
    var both = await Promise.all([getJson(new URL('registry.json', base).href), getJson(courseConfigUrl)]);
    var registry = both[0];
    CK.config.initialize(both[1], courseRoot, base);
    CK.resources = CK.resourcesFactory.create(CK.config.courseRoot(), {hostBase:document.baseURI, frameworkBase:base, paths:CK.config.paths()});
    var schemas = Object.create(null);
    CK.resolveSchema = async function (name) {
      if (!name || typeof name !== 'string') throw new Error('[CourseKit schema] Invalid schema name.');
      if (schemas[name]) return schemas[name];
      var fw = (registry.schemas || {})[name], local = CK.config.get('schemas.' + name);
      if (!fw && !local) throw new Error('[CourseKit schema] Unknown schema: ' + name);
      var filename = local || new URL(fw, base).pathname.split('/').pop();
      schemas[name] = await CK.resources.resolve('schemas', filename, {frameworkPath:fw || null});
      return schemas[name];
    };
    CK.styles.applyTheme();
    await CK.fonts.load(loadCss);
    if (!content) throw new Error('[CourseKit runtime] No XML content specified.');
    var xml = await CK.resources.readText('content', content);
    var doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length || !doc.documentElement) throw new Error('[CourseKit runtime] Invalid XML content.');
    var ns = doc.documentElement.namespaceURI;
    var pages = registry.pageTypes || {};
    var ids = Object.keys(pages).filter(function (id) { return pages[id].namespace === ns; });
    if (ids.length !== 1) throw new Error('[CourseKit runtime] Cannot resolve page type for ' + ns);
    var id = ids[0], page = pages[id];
    for (var j = 0; j < (page.styles || []).length; j++) await loadCss(new URL(page.styles[j], base).href);
    await loadScript(new URL('scripts/component-engine.js', base).href);
    await CK.componentManager.load(page.components || [], loadCss, loadScript);
    var scripts = (page.scripts || []).filter(function (p) { return p !== 'scripts/component-engine.js'; });
    for (var k = 0; k < scripts.length; k++) await loadScript(new URL(scripts[k], base).href);
    await CK.styles.loadCustom(loadCss);
    xml = await CK.xmlResources.prepare(xml);
    var renderer = CK.pageRenderers && CK.pageRenderers[id];
    if (!renderer) throw new Error('[CourseKit runtime] Missing page renderer for ' + id);
    await renderer(xml, {root:document.getElementById('brightspace-root') || document.body});
    var customScripts = CK.config.get('resources.scripts', []);
    for (var l = 0; l < customScripts.length; l++) await loadScript(await CK.resources.resolve('scripts', customScripts[l]));
    window.dispatchEvent(new CustomEvent('coursekit:ready'));
  }
  start().catch(function (error) {
    console.error(error);
    var root = document.getElementById('brightspace-root') || document.body;
    var pre = document.createElement('pre'); pre.textContent = error.stack || error.message || String(error);
    pre.style.whiteSpace = 'pre-wrap'; pre.style.padding = '1rem'; root.appendChild(pre);
    window.dispatchEvent(new CustomEvent('coursekit:error', {detail:error}));
  });
})();
