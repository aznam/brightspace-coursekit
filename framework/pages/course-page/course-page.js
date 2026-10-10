(function () {
  'use strict';
  var C = window.BRIGHTSPACE.components;

  function pageVariables(root) {
    var courseData = window.COURSE_DATA || {};
    var courseVars = courseData.variables || {};
    var out = {};

    // Course identity fields are automatically available as ${course.code},
    // ${course.title}, ${course.section}, ${course.term}, ${course.year}.
    var course = courseData.course || {};
    Object.keys(course).forEach(function (key) {
      if (course[key] != null && typeof course[key] !== 'object') {
        out['course.' + key] = course[key];
      }
    });
    Object.keys(courseVars).forEach(function (key) {
      if (key === 'course' || key.indexOf('course.') === 0) {
        throw new Error('[CourseKit variables] Reserved variable name: ' + key);
      }
      out[key] = courseVars[key];
    });

    var block = C.child(root, 'variables');
    if (!block) return out;

    C.children(block, 'var').forEach(function (node) {
      var name = node.getAttribute('name');
      if (!name) throw new Error('[CourseKit variables] <var> requires a name attribute.');
      if (name === 'course' || name.indexOf('course.') === 0) {
        throw new Error('[CourseKit variables] Reserved variable name: ' + name);
      }
      // Resolve page variables in declaration order, so they may reuse course
      // variables or variables declared earlier in the same page.
      C.setVariables(out);
      out[name] = C.interpolate(String(node.textContent || '').trim());
    });
    return out;
  }

  function sectionInfo(root, numbered) {
    var out = [];
    C.children(root, 'central-content').forEach(function (central) {
      C.children(central, 'section').forEach(function (section, index) {
        if (!C.boolAttr(section, 'nav', true)) return;
        var title = C.text(C.child(section, 'title')) || C.attr(section, 'nav-label', 'Section ' + (index + 1));
        out.push({ id: C.attr(section, 'id', 'section-' + (index + 1)), label: title, number: numbered ? out.length + 1 : null });
      });
    });
    return out;
  }

  window.BRIGHTSPACE.renderCoursePage = function (xmlText, options) {
    options = options || {};
    var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
    var parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('[CourseKit course-page] Invalid XML: ' + parseError.textContent);
    var rootXml = doc.documentElement;
    if (C.localName(rootXml) !== 'page') throw new Error('[CourseKit course-page] Root element must be <page>.');

    var vars = pageVariables(rootXml);
    C.setVariables(vars);
    var numbered = C.boolAttr(rootXml, 'number-sections', false);
    var ctx = { page: rootXml, variables: vars, numbered: numbered, navSections: sectionInfo(rootXml, numbered), sectionDepth: 0 };
    var page = document.createElement('div'); page.className = 'ck-page';
    var background = window.COURSE_CONFIG && window.COURSE_CONFIG.backgroundImage;
    if (background) page.style.setProperty('--ck-page-background', 'linear-gradient(rgba(250,250,249,.92), rgba(250,250,249,.97)), url("' + background + '")');

    var layout = document.createElement('div'); layout.className = 'ck-page__layout';
    var sidebar = document.createElement('div'); sidebar.className = 'ck-page__sidebar';
    var hasSide = false;
    var main = null;

    C.children(rootXml).forEach(function (node) {
      var name = C.localName(node);
      if (name === 'variables') return;
      var rendered = C.renderElement(node, ctx);

      if (name === 'side') {
        sidebar.appendChild(rendered);
        hasSide = true;
      } else if (name === 'central-content') {
        main = rendered;
      } else {
        page.appendChild(rendered);
      }
    });

    if (hasSide) layout.appendChild(sidebar);
    if (main) layout.appendChild(main);
    if (!hasSide) layout.classList.add('ck-page__layout--no-side');
    page.appendChild(layout);

    var host = options.root || document.getElementById('brightspace-root') || document.body;
    host.innerHTML = ''; host.appendChild(page);
    var title = C.attr(rootXml, 'title', '');
    var courseCode = window.COURSE_CONFIG && window.COURSE_CONFIG.courseCode || '';
    document.title = [courseCode, title].filter(Boolean).join(' - ');
    C.runBehaviors(page, ctx);
    return page;
  };
})();
