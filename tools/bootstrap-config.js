/**
 * CourseKit Toolkit — bootstrap configuration.
 * Paths are relative to this configuration file; absolute URLs are supported.
 */
// ============================================================
// USER CONFIGURATION — EDIT THIS BLOCK ONLY
// ============================================================
const frameworkPath = '../framework/';
const toolkitPath = '../toolkit/';
const toolsRoot = './';
const toolkitConfig = 'toolkit.json';
// Set courseRoot to a course URL to load one course; otherwise use courseCatalog.
const courseRoot = null;
const courseCatalog = 'courses.json';
// ============================================================
// TOOLKIT INITIALIZATION — DO NOT MODIFY
// ============================================================
(function () {
    'use strict';

    const host = document.currentScript;
    if (!host || !host.src) {
        throw new Error('[CourseKit Toolkit] bootstrap-config.js must be loaded using a script src.');
    }

    const framework = new URL(frameworkPath, host.src);
    const toolkit = new URL(toolkitPath, host.src);
    const tools = new URL(toolsRoot, host.src);
    const loader = document.createElement('script');
    loader.type = 'module';
    loader.src = new URL('bootstrap-toolkit.js', toolkit).href;
    loader.dataset.frameworkRoot = framework.href;
    loader.dataset.toolsRoot = tools.href;
    loader.dataset.toolkitRoot = toolkit.href;
    loader.dataset.toolkitConfig = new URL(toolkitConfig, toolkit).href;
    loader.dataset.courseRoot = courseRoot ? new URL(courseRoot, host.src).href : '';
    loader.dataset.courseCatalog = courseCatalog;
    loader.async = false;
    loader.onerror = () => {
        console.error('[CourseKit Toolkit] Cannot load ' + loader.src);
    };
    document.head.appendChild(loader);
})();
