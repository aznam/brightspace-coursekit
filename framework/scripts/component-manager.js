(function () {
  'use strict';
  var CK = window.BRIGHTSPACE;
  var definitions = Object.create(null);
  function unique(items) { return items.filter(function (x, i) { return items.indexOf(x) === i; }); }
  async function loadJson(url) { var r = await fetch(url, {credentials:'same-origin',cache:'no-store'}); if (!r.ok) throw new Error('[CourseKit components] Cannot read ' + url); return r.json(); }
  async function definition(id) {
    if (definitions[id]) return definitions[id];
    var url = new URL('components/' + id + '/component.json', CK.config.frameworkRoot()).href;
    var own = await loadJson(url), ownBase = new URL('.', url).href;
    var stylePaths = (own.styles || []).slice(), scriptPaths = (own.scripts || []).slice();
    var inheritedStyles = [], inheritedScripts = [];
    if (own.extends) {
      var parent = await definition(own.extends);
      inheritedStyles = (parent.__styleUrls || []).slice(); inheritedScripts = (parent.__scriptUrls || []).slice();
      own = CK.components.mergeDefinition(parent, own);
    }
    own.__base = ownBase;
    own.__styleUrls = unique(inheritedStyles.concat(stylePaths.map(function (x) { return new URL(x, ownBase).href; })));
    own.__scriptUrls = unique(inheritedScripts.concat(scriptPaths.map(function (x) { return new URL(x, ownBase).href; })));
    definitions[id] = own;
    return own;
  }
  CK.componentManager = {load: async function (ids, loadCss, loadScript) {
    for (var i = 0; i < ids.length; i++) await definition(ids[i]);
    CK.components.setDefinitions(definitions);
    var styles = [], scripts = [];
    Object.keys(definitions).forEach(function (id) { styles.push.apply(styles, definitions[id].__styleUrls || []); scripts.push.apply(scripts, definitions[id].__scriptUrls || []); });
    for (var j = 0; j < unique(styles).length; j++) await loadCss(unique(styles)[j]);
    for (var k = 0; k < unique(scripts).length; k++) await loadScript(unique(scripts)[k]);
  }};
})();
