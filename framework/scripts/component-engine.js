(function () {
  'use strict';
  window.BRIGHTSPACE = window.BRIGHTSPACE || {};
  var renderers = Object.create(null);
  var behaviors = Object.create(null);
  var definitions = Object.create(null);
  var variables = Object.create(null);

  function localName(node) { return node.localName || String(node.nodeName || '').split(':').pop(); }
  function elementChildren(node) { return Array.prototype.filter.call(node.childNodes || [], function (n) { return n.nodeType === 1; }); }
  function child(node, name) { return elementChildren(node).find(function (n) { return localName(n) === name; }) || null; }
  function children(node, name) { return elementChildren(node).filter(function (n) { return !name || localName(n) === name; }); }
  function interpolate(value) {
    if (value == null) return value;
    return String(value).replace(/\$\{([A-Za-z_][A-Za-z0-9_.-]*)\}/g, function (_, name) {
      if (!Object.prototype.hasOwnProperty.call(variables, name)) {
        throw new Error('[CourseKit variables] Unknown variable ${' + name + '}.');
      }
      return String(variables[name]);
    });
  }
  function text(node) { return node ? interpolate(String(node.textContent || '').trim()) : ''; }
  function attr(node, name, fallback) { var v = node.getAttribute && node.getAttribute(name); return v == null || v === '' ? fallback : interpolate(v); }
  function boolAttr(node, name, fallback) {
    var v = attr(node, name, null); if (v == null) return !!fallback;
    return !/^(false|0|no)$/i.test(v);
  }
  function styleRef(el, xml) { var s = attr(xml, 'style-ref', null); if (s) el.setAttribute('data-style-ref', s); }

  function resolveAsset(path) {
    if (!path) return '';
    if (/^(?:https?:|data:|blob:|\/)/i.test(path)) return path;
    var base = window.COURSE_CONFIG && window.COURSE_CONFIG.paths && window.COURSE_CONFIG.paths.assets;
    return base ? new URL(path, base.replace(/\/$/, '') + '/').href : path;
  }

  function renderGenericNode(node, parent, ctx) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(interpolate(node.nodeValue))); return; }
    if (node.nodeType !== 1) return;
    var name = localName(node);
    var def = definitions[name] || null;
    if (def || renderers[name]) {
      var rendererName = def && def.renderer ? def.renderer : name;
      var renderer = renderers[rendererName] || renderers[name];
      if (!renderer) {
        throw new Error('[CourseKit components] No renderer registered for <' + name + '> (renderer: ' + rendererName + ').');
      }
      parent.appendChild(renderer(node, ctx));
      return;
    }
    var allowed = {
      p:'p', ul:'ul', ol:'ol', li:'li', strong:'strong', em:'em', u:'u', code:'code', pre:'pre', br:'br',
      a:'a', span:'span', dl:'dl', dt:'dt', dd:'dd', blockquote:'blockquote'
    };
    var tag = allowed[name];
    if (!tag) throw new Error('[CourseKit components] Unsupported XML element <' + name + '>.');
    var el = document.createElement(tag);
    if (name === 'a') {
      var href = attr(node, 'href', '#');
      el.href = href;
      var target = attr(node, 'target', null); if (target) el.target = target;
    }
    if (name === 'span') { var role = attr(node, 'role', null); if (role) el.setAttribute('data-role', role); }
    Array.prototype.forEach.call(node.childNodes, function (n) { renderGenericNode(n, el, ctx); });
    parent.appendChild(el);
  }

  function renderChildren(xml, parent, ctx, filter) {
    Array.prototype.forEach.call(xml.childNodes || [], function (n) {
      if (n.nodeType === 1 && filter && filter.indexOf(localName(n)) !== -1) return;
      renderGenericNode(n, parent, ctx);
    });
  }

  function mergeDefinition(parent, childDef) {
    var out = {};
    Object.keys(parent || {}).forEach(function (k) { out[k] = parent[k]; });
    Object.keys(childDef || {}).forEach(function (k) {
      if (Array.isArray(childDef[k]) && Array.isArray(out[k])) out[k] = out[k].concat(childDef[k]);
      else out[k] = childDef[k];
    });
    return out;
  }

  function setDefinitions(defs) { definitions = defs || Object.create(null); }
  function setVariables(values) {
    variables = Object.create(null);
    Object.keys(values || {}).forEach(function (key) { variables[key] = values[key]; });
  }
  function registerRenderer(name, fn) { renderers[name] = fn; }
  function registerBehavior(name, fn) { behaviors[name] = fn; }
  function runBehaviors(root, ctx) { Object.keys(behaviors).forEach(function (name) { behaviors[name](root, ctx); }); }

  window.BRIGHTSPACE.components = {
    registerRenderer: registerRenderer,
    registerBehavior: registerBehavior,
    setDefinitions: setDefinitions,
    setVariables: setVariables,
    interpolate: interpolate,
    definition: function (name) { return definitions[name] || null; },
    renderElement: function (xml, ctx) {
      var name = localName(xml);
      var def = definitions[name] || {};
      var rendererName = def.renderer || name;
      var renderer = renderers[rendererName] || renderers[name];
      if (!renderer) throw new Error('[CourseKit components] No renderer registered for <' + name + '>.');
      return renderer(xml, ctx);
    },
    renderChildren: renderChildren,
    renderGenericNode: renderGenericNode,
    runBehaviors: runBehaviors,
    localName: localName,
    child: child,
    children: children,
    text: text,
    attr: attr,
    boolAttr: boolAttr,
    styleRef: styleRef,
    resolveAsset: resolveAsset,
    mergeDefinition: mergeDefinition
  };
})();
