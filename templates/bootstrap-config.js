/**
 * CourseKit — course bootstrap configuration.
 * Only edit the paths in the USER CONFIGURATION block.
 */

// ============================================================
// USER CONFIGURATION
// ============================================================

// Path to the CourseKit framework directory (e.g., '../framework/')
const frameworkPath = ''; 

// Path to this specific course's root directory (e.g., './')
const courseRoot = ''; 

// Path to the course.json configuration file
const courseConfig = 'course.json';

// ============================================================
// COURSEKIT INITIALIZATION — DO NOT MODIFY BELOW
// ============================================================
(function () {
    'use strict';
    const host = document.currentScript;
    if (!host || !host.src) throw new Error('[CourseKit] bootstrap-config.js must be loaded using a script src.');

    const framework = new URL(frameworkPath, host.src);
    const course = new URL(courseRoot, host.src);
    const loader = document.createElement('script');

    loader.type = 'module';
    loader.src = new URL('bootstrap.js', framework).href;
    loader.dataset.courseRoot = course.href;
    loader.dataset.courseConfig = new URL(courseConfig, course).href;
    loader.dataset.content = host.dataset.content || '';
    loader.async = false;
    loader.onerror = () => console.error('[CourseKit] Cannot load ' + loader.src);

    document.head.appendChild(loader);
})();