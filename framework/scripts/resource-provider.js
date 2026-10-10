(function () {
  'use strict';
  window.BRIGHTSPACE = window.BRIGHTSPACE || {};
  function create(baseUrl) {
    function resolve(path) { return new URL(path, baseUrl).href; }
    async function readText(path) {
      var response = await fetch(resolve(path), { credentials: 'same-origin' });
      if (!response.ok) throw new Error('[CourseKit resources] Unable to read "' + path + '" (' + response.status + ').');
      return response.text();
    }
    async function readJson(path) {
      var text = await readText(path);
      try { return JSON.parse(text); }
      catch (error) { throw new Error('[CourseKit resources] Invalid JSON in "' + path + '": ' + error.message); }
    }
    return { type: 'http', baseUrl: baseUrl, resolve: resolve, readText: readText, readJson: readJson };
  }
  window.BRIGHTSPACE.resourcesFactory = { create: create };
})();
