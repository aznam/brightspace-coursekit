/**
 * BRIGHTSPACE HTML FRAMEWORK — written-assignment.js
 * Extension de document.js pour les devoirs écrits.
 *
 * IMPORTANT : charger ce fichier AVANT document.js afin qu'il
 * enregistre ses renderers avant la construction du document.
 */
(function () {
  'use strict';

  var AC = window.ASSIGNMENT_CONFIG || {};
  var WC = window.WRITTEN_ASSIGNMENT_CONFIG || {};
  var registry = window.DOCUMENT_MODULES = window.DOCUMENT_MODULES || {
    renderers: {},
    defaultCoverType: 'cover'
  };

  registry.defaultCoverType = 'assignment-cover';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function assignmentLabel() {
    var label = AC.assignmentLabel || 'Assignment';
    return AC.assignmentNumber != null ? label + ' ' + AC.assignmentNumber : label;
  }

  function yesNo(value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return value == null ? '' : String(value);
  }

  function studentFields() {
    var fields = [
      ['Last Name', true],
      ['First Name', true],
      ['Student ID', true]
    ];
    if (WC.showStudentSignature !== false) fields.push(['Signature', true]);

    return '<div class="wa-student-box">'
      + '<div class="wa-box-title">Student Information</div>'
      + '<div class="wa-student-fields">'
      + fields.map(function (f) {
        return '<div class="wa-field"><span class="wa-field-label">' + esc(f[0]) + '</span><span class="wa-field-line"></span></div>';
      }).join('')
      + '</div></div>';
  }

  function checklist() {
    var items = Array.isArray(WC.submissionChecklist) ? WC.submissionChecklist : [];
    if (!items.length) return '';
    return '<div class="wa-checklist-box">'
      + '<div class="wa-box-title">Submission Checklist</div>'
      + '<div class="wa-checklist">'
      + items.map(function (item) {
        return '<div class="wa-check-item"><span class="wa-checkbox"></span><span>' + esc(item) + '</span></div>';
      }).join('')
      + '</div></div>';
  }

  function gradingBox() {
    if (WC.gradingArea === false) return '';
    var columns = Array.isArray(WC.gradingColumns) && WC.gradingColumns.length
      ? WC.gradingColumns
      : ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Total'];

    return '<div class="wa-grading-box">'
      + '<div class="wa-box-title">For Grading Use</div>'
      + '<div class="wa-grading-grid" style="--grading-cols:' + columns.length + ';">'
      + columns.map(function (c) {
        return '<div class="wa-grading-cell"><strong>' + esc(c) + '</strong><span>____</span></div>';
      }).join('')
      + '</div></div>';
  }

  registry.renderers['assignment-cover'] = function (page, ctx) {
    var DC = ctx.document || {};
    var inst = ctx.institution();
    var logo = inst.logo ? '<img class="document-cover-logo" src="' + esc(ctx.resolveAsset(inst.logo)) + '" alt="' + esc(inst.name || 'Institution logo') + '">' : '';
    var courseSession = ctx.courseSessionText();
    var instructor = ctx.instructorText();

    return '<div class="document-cover-content">'
      + logo
      + '<div class="document-cover-institution">'
      + (inst.name ? '<strong>' + esc(inst.name) + '</strong>' : '')
      + (inst.faculty ? '<div>' + esc(inst.faculty) + '</div>' : '')
      + (inst.department ? '<div>' + esc(inst.department) + '</div>' : '')
      + '</div>'
      + '<hr class="document-cover-rule">'
      + '<div class="document-cover-course">'
      + esc(ctx.course.courseCode || '')
      + (ctx.course.courseTitle ? '<div class="document-cover-course-title">' + esc(ctx.course.courseTitle) + '</div>' : '')
      + (ctx.course.programName ? '<div class="document-cover-program">' + esc(ctx.course.programName) + '</div>' : '')
      + (courseSession ? '<div class="document-cover-course-title">' + esc(courseSession) + '</div>' : '')
      + '</div>'
      + '<div class="document-cover-title-block">'
      + '<div class="document-cover-kicker">' + esc(assignmentLabel()) + '</div>'
      + '<h1 class="document-cover-title">' + esc(DC.title || assignmentLabel()) + '</h1>'
      + (DC.subtitle ? '<div class="document-cover-subtitle">' + esc(DC.subtitle) + '</div>' : '')
      + '</div>'
      + studentFields()
      + checklist()
      + gradingBox()
      + '<div class="document-cover-meta" style="margin-top:0.12in">'
      + (instructor ? '<div class="document-cover-meta-item"><span class="document-cover-meta-label">Instructor</span><span class="document-cover-meta-value">' + esc(instructor) + '</span></div>' : '')
      + (DC.date ? '<div class="document-cover-meta-item"><span class="document-cover-meta-label">Date</span><span class="document-cover-meta-value">' + esc(ctx.formatDate(DC.date)) + '</span></div>' : '')
      + (WC.materialPermitted != null ? '<div class="document-cover-meta-item"><span class="document-cover-meta-label">Material permitted</span><span class="document-cover-meta-value">' + esc(yesNo(WC.materialPermitted)) + '</span></div>' : '')
      + (WC.duration ? '<div class="document-cover-meta-item"><span class="document-cover-meta-label">Duration</span><span class="document-cover-meta-value">' + esc(WC.duration) + '</span></div>' : '')
      + '</div>'
      + '</div>';
  };

  function learningOutcomes() {
    var los = Array.isArray(AC.learningOutcomes) ? AC.learningOutcomes : [];
    if (!los.length) return '<p>No learning outcomes specified for this assignment.</p>';
    return '<div class="wa-lo-list">' + los.map(function (lo) {
      if (typeof lo === 'string') return '<div class="wa-lo-item"><span class="wa-lo-code">' + esc(lo) + '</span><span class="wa-lo-label"></span></div>';
      return '<div class="wa-lo-item"><span class="wa-lo-code">' + esc(lo.code || 'LO') + '</span><span class="wa-lo-label">' + esc(lo.label || '') + '</span></div>';
    }).join('') + '</div>';
  }

  registry.renderers['assignment-instructions'] = function (page, ctx) {
  var source = ctx.getSourceHtml(page.id || 'assignment-instructions');

  /* Allow Learning Outcomes to be disabled for a specific instruction page. */
  if (page.showLearningOutcomes === false) {
    return source;
  }

  var loBlock = '<section class="wa-instruction-section">'
    + '<h2>Learning Outcomes</h2>' + learningOutcomes() + '</section>';

  /* The template can decide precisely where to place the LOs with this marker. */
  if (source.indexOf('data-wa-learning-outcomes') !== -1) {
    var holder = document.createElement('div');
    holder.innerHTML = source;
    var marker = holder.querySelector('[data-wa-learning-outcomes]');
    if (marker) marker.outerHTML = loBlock;
    return holder.innerHTML;
  }

  return source + loBlock;
};

  registry.renderers['assignment-content'] = function (page, ctx) {
    var body = ctx.getSourceHtml(page.id);
    var margin = WC.instructorMargin === false ? '' : '<aside class="wa-instructor-margin"><div class="wa-instructor-margin-label">Instructor Comments</div></aside>';
    return '<div class="wa-student-work">' + body + '</div>' + margin;
  };

  registry.renderers['assignment-appendix'] = registry.renderers['assignment-content'];

  if (WC.instructorMargin && typeof WC.instructorMargin === 'object' && WC.instructorMargin.width) {
    document.documentElement.style.setProperty('--wa-instructor-margin-width', WC.instructorMargin.width);
  }
})();
