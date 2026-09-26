/**
 * BRIGHTSPACE HTML FRAMEWORK — assignment.js
 * ─────────────────────────────────────────────
 * Extension du framework pour les pages de type Assignment.
 * Chargé APRÈS framework.js.
 * Chaque page déclare window.ASSIGNMENT_CONFIG avant ce script:
 * window.ASSIGNMENT_CONFIG = {
 *         assignmentNumber : 1,            // entier ou chaîne : 1, 2, 'A', 'Lab 3'…
 *         assignmentLabel  : 'Assignment', // 'Assignment' | 'Lab' | 'Project' | 'Quiz'…
 *         assignmentType   : 'regular',    // 'regular' | 'bonus'
 *         openDate : '2026-09-20T00:00',   // ISO 8601 — null si toujours ouvert
 *         deadline : {
 *           date      : '2026-10-05T23:59',
 *           type      : 'hard',            // 'hard' | 'soft'
 *           extension : null,              // null  OU  { date: '2026-10-07T23:59', reason: '…' }
 *         },
 *         submissionType : 'individual',   // 'individual' | 'group'
 *         groupSize      : null,           // ex. '2–3 students'  (uniquement si group)
 *         submissionUrl  : '#',            // URL du dropbox Brightspace  
 *         aiPolicy : 'default', // 'unrestricted' | 'restricted' | 'forbidden' | 'default'
 *         learningOutcomes : [
 *           { code: 'LO1', label: 'Apply agile planning to a realistic scenario.' },
 *           { code: 'LO2', label: 'Produce traceable requirements artifacts.' },
 *         ],
 *         estimatedTime   : '4–6 hours',
 *         difficulty      : 'medium',      // 'easy' | 'medium' | 'hard'
 *         weight          : 15,            // % de la note finale  (null si non communiqué)
 *         points          : 100,           // points bruts          (null si non communiqué)
 *         rubricsProvided : true,
 *         resources : [
 *           { label: '📄 Assignment Handout', url: '#' },
 *           { label: '📊 Grading Rubric',     url: '#' },
 *         ],
 *     };
 */
(function () {
  'use strict';

  var AC = window.ASSIGNMENT_CONFIG;
  if (!AC) return; // Si pas de config Assignment, on ne fait rien.

  // On normalise les données
  var dl  = AC.deadline || {};
  var ext = dl.extension || null;
  AC = {
    assignmentNumber : AC.assignmentNumber != null ? AC.assignmentNumber : null,
    assignmentLabel  : AC.assignmentLabel || 'Assignment',
    assignmentType   : AC.assignmentType === 'bonus' ? 'bonus' : 'regular',
    openDate         : AC.openDate || null,
    deadline         : {
      date      : dl.date  || null,
      type      : dl.type  || 'hard',
      extension : ext ? { date: ext.date || null, reason: ext.reason || '' } : null,
    },
    submissionType   : AC.submissionType || 'individual',
    groupSize        : AC.groupSize      || null,
    submissionUrl    : AC.submissionUrl  || '#',
    aiPolicy         : AC.aiPolicy || 'default',
    learningOutcomes : Array.isArray(AC.learningOutcomes) ? AC.learningOutcomes.map(function(lo) {
      if (typeof lo === 'string') return { code: lo, label: '' };
      return { code: lo.code || null, label: lo.label || '' };
    }) : [],
    estimatedTime    : AC.estimatedTime || null,
    difficulty       : AC.difficulty    || null,
    weight           : AC.weight        != null ? AC.weight : null,
    points           : AC.points        != null ? AC.points : null,
    rubricsProvided  : !!AC.rubricsProvided,
    resources        : Array.isArray(AC.resources) ? AC.resources : [],
  };

  /* ── 1. Ajouter l'Eyebrow au Hero ── */
  function injectHeroEyebrow() {
    var hero = document.getElementById('fw-hero');
    if (!hero || AC.assignmentNumber == null) return;
    
    var eyebrow = document.createElement('div');
    eyebrow.className = 'assignment-hero-eyebrow';
    eyebrow.textContent = AC.assignmentLabel + ' ' + AC.assignmentNumber;
    hero.insertBefore(eyebrow, hero.firstChild);
  }

  /* ── 2. Construire la bande Assignment ── */
  function buildAssignmentBand() {
    var hero = document.getElementById('fw-hero');
    if (!hero) return;

    var band = document.createElement('div');
    band.id        = 'fw-assignment-band';
    band.className = 'assignment-band';
    band.innerHTML = buildBandStripHtml() + buildBandPanelHtml();
    hero.parentNode.insertBefore(band, hero.nextSibling);

    var wrapper = document.querySelector('.edtech-wrapper');
    if (wrapper) wrapper.classList.add('has-assignment-band');

    function setStickyTop() {
      var nb = document.getElementById('fw-sticky-bar');
      band.style.top = (nb ? nb.offsetHeight : 0) + 'px';
    }
    setStickyTop();
    window.addEventListener('resize', setStickyTop);

    initAssignmentBandBehavior(band);
  }

  function buildBandStripHtml() {
    var dl = AC.deadline, hasExt = !!(dl.extension && dl.extension.date);
    var items = [];

    if (AC.openDate) {
      items.push('<div class="aband-item"><span class="aband-item-label">Opens</span><span class="aband-item-value">' + fmtDate(AC.openDate) + '</span></div>');
    }

    if (dl.date) {
      var typeIcon = dl.type === 'hard' ? '🔴' : '🟡';
      var typeText = dl.type === 'hard' ? 'Hard Deadline' : 'Soft Deadline';
      var ddHtml = '<div class="aband-item"><span class="aband-item-label">' + typeIcon + '\u00a0' + typeText + '</span><span class="aband-item-value' + (hasExt ? ' aband-struck' : '') + '">' + fmtDateTime(dl.date) + '</span>';
      if (hasExt) {
        ddHtml += '<span class="aband-item-value aband-ext-date">' + fmtDateTime(dl.extension.date) + (dl.extension.reason ? '\u00a0<span class="aband-ext-reason">(' + dl.extension.reason + ')</span>' : '') + '</span>';
      }
      ddHtml += '</div>';
      items.push(ddHtml);
    }

    items.push('<div class="aband-item aband-item-progress">' + buildProgressHtml() + '</div>');
    if (AC.assignmentType === 'bonus') {
      items.push(
        '<div class="aband-item">' +
          '<span class="aband-badge aband-badge-bonus">+\u00a0Bonus</span>' +
        '</div>'
      );
    }
    var subText = AC.submissionType === 'group' ? '👥\u00a0Group' + (AC.groupSize ? '\u00a0(' + AC.groupSize + ')' : '') : '👤\u00a0Individual';
    items.push('<div class="aband-item"><span class="aband-badge aband-badge-sub">' + subText + '</span></div>');

    var aiMap = {
      unrestricted : { text: '🤖\u00a0AI: Unrestricted',   cls: 'aband-badge-ai-ok' },
      restricted   : { text: '⚠️\u00a0AI: Restricted',     cls: 'aband-badge-ai-warn' },
      forbidden    : { text: '🚫\u00a0AI: Forbidden',      cls: 'aband-badge-ai-no' },
      default      : { text: 'ℹ️\u00a0AI: Default policy', cls: 'aband-badge-ai-default' },
    };
    var ai = aiMap[AC.aiPolicy] || aiMap.default;
    items.push('<div class="aband-item"><span class="aband-badge ' + ai.cls + '">' + ai.text + '</span></div>');

    return '<div class="aband-strip">' + items.join('<div class="aband-sep"></div>') + '<span class="aband-expand-hint">Details\u00a0▾</span></div>';
  }

  function buildBandPanelHtml() {
    var html = '<div class="aband-panel"><div class="aband-panel-inner">';
    if (AC.learningOutcomes.length > 0) {
      html += '<div class="aband-panel-block"><span class="aband-panel-block-label">Learning Outcomes</span><div class="aband-lo-list">';
      AC.learningOutcomes.forEach(function (lo) {
        if (!lo.code) return;
        var hasHover = !!lo.label;
        html += '<span class="aband-lo-tag' + (hasHover ? ' hover-trigger' : '') + '">' + lo.code;
        if (hasHover) html += '<span class="hover-panel"><span class="hover-panel-title">' + lo.code + '</span><span class="hover-panel-text">' + lo.label + '</span></span>';
        html += '</span>';
      });
      html += '</div></div>';
    }

    var metas = [];
    if (AC.estimatedTime) metas.push({ label: '⏱ Est. Time', value: AC.estimatedTime });
    if (AC.difficulty) metas.push({ label: 'Difficulty', value: { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' }[AC.difficulty] || AC.difficulty });
    if (AC.weight != null) metas.push({ label: 'Weight', value: AC.weight + '% of grade' });
    if (AC.points != null) metas.push({ label: 'Points', value: AC.points + ' pts' });
    metas.push({ label: 'Rubrics', value: AC.rubricsProvided ? '✅ Provided' : '❌ Not provided' });

    html += '<div class="aband-panel-block aband-panel-meta">';
    metas.forEach(function (m) { html += '<div class="aband-meta-item"><span class="aband-meta-label">' + m.label + '</span><span class="aband-meta-value">' + m.value + '</span></div>'; });
    html += '</div></div></div>';
    return html;
  }

function buildProgressHtml() {
    var dl = AC.deadline;
    var effectiveDeadline = (dl.extension && dl.extension.date) ? dl.extension.date : dl.date;
    if (!effectiveDeadline) return '<div class="aband-progress"><span class="aband-progress-label">No deadline set</span></div>';

    var now = Date.now(), deadlineTs = new Date(effectiveDeadline).getTime(), openTs = AC.openDate ? new Date(AC.openDate).getTime() : null;
    var pct, label, fillCls;

    if (now >= deadlineTs) { 
      pct = 0; /* FIX : La barre est vide (0%) quand le temps est écoulé */
      label = (dl.type === 'hard') ? 'Closed' : 'Late'; 
      fillCls = 'aband-fill-danger'; 
    }
    else if (openTs && now < openTs) { 
      pct = 100; /* FIX : La barre est pleine (100%) avant l'ouverture */
      label = 'Not open yet'; 
      fillCls = 'aband-fill-ok'; 
    }
    else {
      var start = openTs || (deadlineTs - 14 * 86400000);
      var total = deadlineTs - start;
      var remainingMs = Math.max(0, deadlineTs - now);
      
      /* FIX : Le pourcentage correspond désormais au temps RESTANT */
      pct = Math.min(100, Math.round((remainingMs / total) * 100));
      label = fmtRemaining(remainingMs);
      
      /* FIX : Logique de couleurs inversée 
         - Moins de 10% restants -> Rouge
         - Moins de 35% restants -> Orange
         - Plus de 35% restants  -> Vert */
      fillCls = pct <= 10 ? 'aband-fill-danger' : pct <= 35 ? 'aband-fill-warn' : 'aband-fill-ok';
    }
    
    return '<div class="aband-progress"><div class="aband-progress-track"><div class="aband-progress-fill ' + fillCls + '" style="width:' + pct + '%"></div></div><span class="aband-progress-label">' + label + '</span></div>';
  }

  function initAssignmentBandBehavior(band) {
    var isTouchDevice = window.matchMedia('(hover: none)').matches, hideTimer;
    if (isTouchDevice) {
      band.addEventListener('click', function (e) { if (!e.target.closest('.hover-trigger')) band.classList.toggle('aband-open'); });
      document.addEventListener('click', function (e) { if (!band.contains(e.target)) band.classList.remove('aband-open'); });
    } else {
      band.addEventListener('mouseenter', function () { clearTimeout(hideTimer); band.classList.add('aband-open'); });
      band.addEventListener('mouseleave', function () { hideTimer = setTimeout(function () { band.classList.remove('aband-open'); }, 150); });
    }
  }

  /* ── 3. Construire les Sidebars ── */
  function buildAssignmentSidebar() {
    var sbBefore = document.querySelector('.sidebar-before');
    if (!sbBefore) {
      sbBefore = document.createElement('aside');
      sbBefore.className = 'sidebar-before';
      var main = document.querySelector('.main-content');
      if (main) main.parentNode.insertBefore(sbBefore, main);
    }
    var submitCard = document.createElement('div');
    submitCard.className = 'sidebar-card assignment-submit-card';
    submitCard.innerHTML = buildSubmitCardHtml();
    sbBefore.insertBefore(submitCard, sbBefore.firstChild);

    if (AC.resources.length > 0) {
      var sbAfter = document.querySelector('.sidebar-after');
      if (!sbAfter) {
        sbAfter = document.createElement('aside');
        sbAfter.className = 'sidebar-after';
        var container = document.querySelector('.edtech-container');
        if (container) container.appendChild(sbAfter);
      }
      var resCard = document.createElement('div');
      resCard.className = 'sidebar-card';
      resCard.innerHTML  = buildResourcesCardHtml();
      sbAfter.appendChild(resCard);
    }
  }

  function buildSubmitCardHtml() {
    var dl = AC.deadline, hasExt = !!(dl.extension && dl.extension.date);
    var effectiveDeadline = hasExt ? dl.extension.date : dl.date;
    
    // FIX : La soumission n'est fermée QUE si la deadline est dépassée ET qu'elle est "hard"
    var isClosed = false;
    if (effectiveDeadline && Date.now() >= new Date(effectiveDeadline).getTime()) {
      isClosed = (dl.type === 'hard');
    }

    var html = '<h3>📬 Submit</h3>';

    if (dl.date) {
      var typeLabel = dl.type === 'hard' ? '🔴 Hard deadline' : '🟡 Soft deadline';
      html += '<div class="fact-row"><span class="fact-label">' + typeLabel + '</span><span class="fact-value">';
      if (hasExt) html += '<span class="submit-struck">' + fmtDateTime(dl.date) + '</span><span class="submit-ext-date">' + fmtDateTime(dl.extension.date) + '</span>';
      else html += fmtDateTime(dl.date);
      html += '</span></div>';
    }
    if (hasExt && dl.extension.reason) html += '<div class="submit-ext-reason">📌\u00a0' + dl.extension.reason + '</div>';

    var subText = AC.submissionType === 'group' ? '👥\u00a0Group' + (AC.groupSize ? '\u00a0(' + AC.groupSize + ')' : '') : '👤\u00a0Individual';
    html += '<div class="fact-row"><span class="fact-label">Type</span><span class="fact-value">' + subText + '</span></div>';

    if (AC.assignmentType === 'bonus') {
      html += '<div class="fact-row">' +
        '<span class="fact-label">Grading</span>' +
        '<span class="fact-value assignment-bonus-value">+\u00a0Bonus</span>' +
      '</div>';
    }
    if (AC.weight != null) html += '<div class="fact-row"><span class="fact-label">Weight</span><span class="fact-value">' + AC.weight + '% of grade</span></div>';
    if (AC.points != null) html += '<div class="fact-row"><span class="fact-label">Points</span><span class="fact-value">' + AC.points + '\u00a0pts</span></div>';

    // Si ce n'est pas fermé mais que la deadline est dépassée (Soft), on change le texte
    var btnText = 'Submit\u00a0Assignment\u00a0\u2192';
    if (!isClosed && effectiveDeadline && Date.now() >= new Date(effectiveDeadline).getTime()) {
      btnText = 'Submit\u00a0Late\u00a0\u2192';
    }

    html += isClosed 
      ? '<div class="btn-submit btn-submit-closed">Submission Closed</div>' 
      : '<a href="' + window.escHtml(AC.submissionUrl) + '" class="btn-submit" target="_top">' + btnText + '</a>';
      
    return html;
  }

  function buildResourcesCardHtml() {
    var html = '<h3>🔗 Resources</h3>';
    AC.resources.forEach(function (r) {
      html += '<a href="' + window.escHtml(r.url) + '" class="resource-link" target="_top">'
        + window.escHtml(r.label)
        + '</a>';
    });
    return html;
  }

  /* ── Utilitaires Dates ── */
  function fmtDate(iso) { return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }); }
  function fmtDateTime(iso) { var d = new Date(iso); return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) + '\u00a0' + d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }); }
  function fmtRemaining(ms) {
    if (ms <= 0) return 'Closed';
    var d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000);
    return d > 1 ? d + ' days left' : d === 1 ? '1 day\u00a0' + h + 'h left' : h + 'h left';
  }

  /* ── Initialisation ── */
  function init() {
    injectHeroEyebrow();
    buildAssignmentBand();
    buildAssignmentSidebar();

    // Re-initialize hoverboxes in case the assignment runtime
    // generated new hover-trigger elements.
    if (typeof window.initHoverboxes === 'function') {
      window.initHoverboxes();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();