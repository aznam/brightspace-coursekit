/**
 * BRIGHTSPACE OPTIONAL MODULE — sprites
 *
 * Resolves elements using:
 *   data-sp="<sprite-name>"
 *
 * Configuration is read from:
 *   COURSE_CONFIG.sprites
 *   COURSE_CONFIG.paths.assets
 *
 * Example:
 *   <i class="sp sp-lg" data-sp="warning"></i>
 */
(function () {
  'use strict';

  var CC = window.COURSE_CONFIG || {};
  var sp = CC.sprites;

  if (!sp || !sp.items || !CC.paths || !CC.paths.assets) {
    return;
  }

  var sheetUrl = CC.paths.assets + '/' + (sp.sheet || 'sprites.png');
  var W = sp.sheetW || 1;
  var H = sp.sheetH || 1;

  document.querySelectorAll('[data-sp]').forEach(function (el) {
    var name = el.getAttribute('data-sp');
    var item = sp.items[name];

    if (!item) {
      console.warn(
        '[Brightspace sprites module] Unknown sprite: "' + name + '"'
      );
      return;
    }

    var x = item[0];
    var y = item[1];
    var w = item[2];
    var h = item[3];

    el.style.backgroundImage = 'url("' + sheetUrl + '")';
    el.style.backgroundRepeat = 'no-repeat';

    el.style.backgroundSize =
      (W / w * 100) + '% ' +
      (H / h * 100) + '%';

    el.style.backgroundPosition =
      (W === w ? 0 : (x / (W - w) * 100)) + '% ' +
      (H === h ? 0 : (y / (H - h) * 100)) + '%';

    el.style.aspectRatio = w + ' / ' + h;
  });

})();
