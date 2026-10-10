(function () {
  'use strict';
  var CK = window.BRIGHTSPACE;
  function cssQuote(s) { return String(s).replace(/[\\"\n\r]/g, ''); }
  CK.fonts = {load: async function (loadCss) {
    var fonts = CK.config.get('resources.fonts', []), rules = [];
    for (var i = 0; i < fonts.length; i++) {
      var font = fonts[i];
      if (font.source === 'online' && font.url) await loadCss(await CK.resources.resolve('styles', font.url));
      if (font.source === 'local') {
        var files = font.files || [];
        for (var j = 0; j < files.length; j++) {
          var f = files[j];
          var url = font.location === 'framework'
            ? new URL(f.file, new URL('fonts/', CK.config.frameworkRoot())).href
            : await CK.resources.resolve('fonts', f.file);
          rules.push('@font-face{font-family:"' + cssQuote(font.family) + '";src:url("' + cssQuote(url) + '") format("' + cssQuote(f.format || 'woff2') + '");font-weight:' + cssQuote(f.weight || 400) + ';font-style:' + cssQuote(f.style || 'normal') + ';font-display:swap;}');
        }
      }
      if (font.cssVariable) document.documentElement.style.setProperty(font.cssVariable, '"' + cssQuote(font.family) + '", ' + (font.fallback || 'sans-serif'));
    }
    if (rules.length) { var el = document.createElement('style'); el.textContent = rules.join('\n'); document.head.appendChild(el); }
  }};
})();
