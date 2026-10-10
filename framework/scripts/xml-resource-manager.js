(function () {
  'use strict';
  var CK = window.BRIGHTSPACE;
  function context(doc) {
    var values = Object.create(null), course = CK.config.get('course', {}), courseVars = CK.config.get('variables', {});
    Object.keys(course).forEach(function (key) { if (course[key] != null && typeof course[key] !== 'object') values['course.' + key] = course[key]; });
    Object.keys(courseVars).forEach(function (key) { if (key === 'course' || key.indexOf('course.') === 0) throw new Error('[CourseKit variables] Reserved variable: ' + key); values[key] = courseVars[key]; });
    function interpolate(str) { return String(str).replace(/\$\{([A-Za-z_][A-Za-z0-9_.-]*)\}/g, function (_, key) { if (!Object.prototype.hasOwnProperty.call(values, key)) throw new Error('[CourseKit variables] Unknown variable ${' + key + '}.'); return String(values[key]); }); }
    Array.from(doc.documentElement.children).filter(function (x) { return x.localName === 'variables'; }).forEach(function (block) {
      Array.from(block.children).forEach(function (node) {
        if (node.localName !== 'var') return;
        var name = node.getAttribute('name');
        if (!name || name === 'course' || name.indexOf('course.') === 0) throw new Error('[CourseKit variables] Reserved/invalid variable: ' + name);
        values[name] = interpolate(node.textContent.trim());
      });
    });
    return interpolate;
  }
  CK.xmlResources = {prepare: async function (xml) {
    var doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('[CourseKit XML] Invalid XML content.');
    var interpolate = context(doc);
    var types = {hero:{image:'assets'}, 'picture-with-legend':{src:'assets'}, 'picture-without-legend':{src:'assets'}, a:{href:'attachments'}, link:{href:'attachments'}};
    var nodes = Array.from(doc.getElementsByTagName('*'));
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], rules = types[node.localName] || {};
      for (var attr in rules) {
        if (!node.hasAttribute(attr)) continue;
        var value = interpolate(node.getAttribute(attr));
        if (value.charAt(0) === '#' || /^(?:mailto:|tel:|javascript:)/i.test(value)) continue;
        node.setAttribute(attr, await CK.resources.resolve(rules[attr], value));
      }
    }
    // Background belongs to the page presenter; just resolve the explicit override here.
    var root = doc.documentElement;
    if (root.hasAttribute('background')) {
      var bg = interpolate(root.getAttribute('background'));
      if (bg !== 'none' && bg !== '') root.setAttribute('background', await CK.resources.resolve('assets', bg));
    }
    return new XMLSerializer().serializeToString(doc);
  }};
})();
