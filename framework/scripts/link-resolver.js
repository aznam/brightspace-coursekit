(function () {
  'use strict';
  var CK = window.BRIGHTSPACE = window.BRIGHTSPACE || {};
  CK.links = {
    classify: function (href) {
      if (!href || href.charAt(0) === '#' || /^(?:mailto:|tel:|javascript:)/i.test(href)) return 'local';
      var url = new URL(href, document.baseURI);
      var configured = CK.config.get('links.brightspaceOrigins', []);
      var origins = [location.origin].concat(configured.map(function (value) { return new URL(value, document.baseURI).origin; }));
      return origins.indexOf(url.origin) !== -1 && (/^\/content\/enforced\//.test(url.pathname) || /^\/d2l\//.test(url.pathname) || configured.some(function (v) { return new URL(v, document.baseURI).origin === url.origin; })) ? 'brightspace' : 'external';
    },
    apply: function (anchor, explicitTarget) {
      if (explicitTarget) { anchor.target = explicitTarget; }
      else { var kind = CK.links.classify(anchor.getAttribute('href')); if (kind !== 'local') anchor.target = kind === 'brightspace' ? '_top' : '_blank'; }
      if (anchor.target === '_blank') anchor.rel = 'noopener noreferrer';
      return anchor;
    }
  };
})();
