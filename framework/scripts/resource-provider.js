(function () {
  'use strict';
  window.BRIGHTSPACE = window.BRIGHTSPACE || {};

  function create(courseRoot, options) {
    options = options || {};
    var hostBase = options.hostBase || document.baseURI;
    var dirs = options.paths || {};
    var frameworkBase = options.frameworkBase || null;

    function absolute(path) { return /^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(path); }
    function getDirectory(type) {
      if (type === 'content') return courseRoot;
      if (type === 'schemas') return dirs.schemas || new URL('schemas/', courseRoot).href;
      if (['assets', 'attachments', 'styles', 'scripts', 'fonts'].includes(type)) return dirs[type];
      throw new Error('[CourseKit resources] Unknown resource type: ' + type);
    }
    function candidates(type, path, extra) {
      if (!path || typeof path !== 'string') throw new Error('[CourseKit resources] Missing resource path for ' + type);
      if (absolute(path)) return [new URL(path, hostBase).href];
      var result = [new URL(path, hostBase).href];
      var fallback = getDirectory(type);
      if (fallback) result.push(new URL(path, fallback.replace(/\/?$/, '/')).href);
      if (extra && extra.frameworkPath && frameworkBase) result.push(new URL(extra.frameworkPath, frameworkBase).href);
      return [...new Set(result)];
    }
    async function available(url) {
      var r = await fetch(url, {method:'HEAD',credentials:'same-origin',cache:'no-store'});
      if (r.ok) return true;
      if (r.status === 404) return false;
      if (r.status === 405 || r.status === 501) {
        r = await fetch(url, {method:'GET',credentials:'same-origin',cache:'no-store'});
        if (r.ok) return true;
        if (r.status === 404) return false;
      }
      throw new Error('[CourseKit resources] Cannot check '+url+' (HTTP '+r.status+').');
    }
    async function resolve(type,path,extra) {
      var list = candidates(type,path,extra);
      // Remote URLs and embedded resources cannot reliably be probed with HEAD (CORS).
      // Explicit URLs are authoritative and never participate in fallback.
      if (/^(?:https?:|data:|blob:)/i.test(path) && new URL(path, hostBase).origin !== new URL(hostBase).origin) return list[0];
      if (/^(?:data:|blob:)/i.test(path)) return list[0];
      for (var i=0;i<list.length;i++) if (await available(list[i])) return list[i];
      throw new Error('[CourseKit resources] '+type+' not found: '+path+' (checked '+list.join(', ')+')');
    }
    async function readText(type,path,extra) {
      // Backward compatible one-argument form reads relative to course root.
      if (path === undefined) {path=type; type='content';}
      var url=await resolve(type,path,extra);
      var response=await fetch(url,{credentials:'same-origin',cache:'no-store'});
      if (!response.ok) throw new Error('[CourseKit resources] Cannot read '+url+' (HTTP '+response.status+').');
      return response.text();
    }
    async function readJson(type,path,extra) { return JSON.parse(await readText(type,path,extra)); }
    return {type:'http',baseUrl:courseRoot, resolve:resolve,exists:available,readText:readText,readJson:readJson,candidates:candidates};
  }
  window.BRIGHTSPACE.resourcesFactory = {create:create};
})();
