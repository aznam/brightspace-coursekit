(function () {
  'use strict';
  var CK = window.BRIGHTSPACE;
  CK.styles = {
    applyTheme: function () {
      var pal = CK.config.get('theme.palette', {});
      Object.keys(pal).forEach(function (key) { document.documentElement.style.setProperty('--ck-' + key, pal[key]); });
    },
    loadCustom: async function (loadCss) {
      var files = CK.config.get('resources.styles', []);
      for (var i = 0; i < files.length; i++) await loadCss(await CK.resources.resolve('styles', files[i]));
    }
  };
})();
