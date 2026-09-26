(function () {
  'use strict';

  var bootstrapScript = document.currentScript;

  if (!bootstrapScript || !bootstrapScript.src) {
    throw new Error(
      '[Brightspace bootstrap] Unable to determine bootstrap.js location.'
    );
  }

  var CONFIG = window.BRIGHTSPACE_BOOTSTRAP_CONFIG;

  if (!CONFIG || typeof CONFIG !== 'object') {
    throw new Error(
      '[Brightspace bootstrap] Missing window.BRIGHTSPACE_BOOTSTRAP_CONFIG. ' +
      'Load bootstrap-config.js before bootstrap.js.'
    );
  }

  var bootstrapBase = new URL('.', bootstrapScript.src);
  var pageTypes = Object.create(null);
  var registeredModules = Object.create(null);

  window.BRIGHTSPACE = window.BRIGHTSPACE || {};

  var lifecycle = {
    beforeFramework: [],
    afterFramework: [],
    beforeFrameworkClosed: false,
    ready: false
  };

  /* =========================================================
     URL RESOLUTION
     ========================================================= */

  function resolveFromBootstrap(path) {
    return new URL(path, bootstrapBase).href;
  }

  function resolveDirectoryFromBootstrap(path) {
    var url = new URL(path, bootstrapBase);

    /*
     * new URL('styles/framework.css', '.../brightspace')
     * treats "brightspace" as a file and resolves to "../styles/...".
     *
     * frameworkBase is a directory, so normalize it with a trailing slash.
     */
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }

    return url.href;
  }

  /* =========================================================
     REGISTRATION API
     ========================================================= */

  function currentRegistryBase(kind, name) {
    var registryScript = document.currentScript;

    if (!registryScript || !registryScript.src) {
      throw new Error(
        '[Brightspace bootstrap] Unable to determine registry location for ' +
        kind + ': ' + name
      );
    }

    return new URL('.', registryScript.src).href;
  }

  window.BRIGHTSPACE.registerPageType = function (name, definition) {
    if (!name || typeof name !== 'string') {
      throw new Error('[Brightspace bootstrap] Invalid page type name.');
    }

    if (!definition || typeof definition !== 'object') {
      throw new Error(
        '[Brightspace bootstrap] Invalid page type definition: ' + name
      );
    }

    if (pageTypes[name]) {
      throw new Error(
        '[Brightspace bootstrap] Page type already registered: ' + name
      );
    }

    pageTypes[name] = {
      name: name,
      registryBase: currentRegistryBase('page type', name),
      css: Array.isArray(definition.css) ? definition.css.slice() : [],
      js: Array.isArray(definition.js) ? definition.js.slice() : []
    };
  };

  window.BRIGHTSPACE.registerModule = function (name, definition) {
    if (!name || typeof name !== 'string') {
      throw new Error('[Brightspace bootstrap] Invalid module name.');
    }

    if (!definition || typeof definition !== 'object') {
      throw new Error(
        '[Brightspace bootstrap] Invalid module definition: ' + name
      );
    }

    if (registeredModules[name]) {
      throw new Error(
        '[Brightspace bootstrap] Module already registered: ' + name
      );
    }

    registeredModules[name] = {
      name: name,
      registryBase: currentRegistryBase('module', name),
      css: Array.isArray(definition.css) ? definition.css.slice() : [],
      js: Array.isArray(definition.js) ? definition.js.slice() : [],
      dependsOn: Array.isArray(definition.dependsOn)
        ? definition.dependsOn.slice()
        : [],
      allowedPageTypes: Array.isArray(definition.allowedPageTypes)
        ? definition.allowedPageTypes.slice()
        : null
    };
  };

  /* =========================================================
     PAGE-SPECIFIC LIFECYCLE
     ========================================================= */

  window.BRIGHTSPACE.beforeFramework = function (callback) {
    if (typeof callback !== 'function') {
      throw new Error(
        '[Brightspace bootstrap] beforeFramework() expects a function.'
      );
    }

    if (lifecycle.beforeFrameworkClosed) {
      throw new Error(
        '[Brightspace bootstrap] beforeFramework() was registered too late.'
      );
    }

    lifecycle.beforeFramework.push(callback);
  };

  window.BRIGHTSPACE.afterFramework = function (callback) {
    if (typeof callback !== 'function') {
      throw new Error(
        '[Brightspace bootstrap] afterFramework() expects a function.'
      );
    }

    if (lifecycle.ready) {
      callback(window.BRIGHTSPACE_RUNTIME);
      return;
    }

    lifecycle.afterFramework.push(callback);
  };

  /* =========================================================
     PAGE REQUEST
     ========================================================= */

  function requestedPageType() {
    return (
      bootstrapScript.getAttribute('data-page-type') || 'course-page'
    ).trim();
  }

  function requestedModules() {
    var raw = bootstrapScript.getAttribute('data-modules');

    if (!raw || !raw.trim()) {
      return [];
    }

    return raw.trim().split(/[\s,]+/).filter(Boolean);
  }

  function resolveModules(requested, pageType) {
    var result = [];
    var visiting = Object.create(null);

    function add(name) {
      if (result.indexOf(name) !== -1) return;

      var module = registeredModules[name];

      if (!module) {
        throw new Error(
          '[Brightspace bootstrap] Unknown optional module: ' + name
        );
      }

      if (
        module.allowedPageTypes &&
        module.allowedPageTypes.indexOf(pageType) === -1
      ) {
        throw new Error(
          '[Brightspace bootstrap] Module "' + name +
          '" is not allowed for page type "' + pageType + '".'
        );
      }

      if (visiting[name]) {
        throw new Error(
          '[Brightspace bootstrap] Circular module dependency involving: ' +
          name
        );
      }

      visiting[name] = true;
      module.dependsOn.forEach(add);
      visiting[name] = false;

      result.push(name);
    }

    requested.forEach(add);
    return result;
  }

  /* =========================================================
     LOADERS
     ========================================================= */

  function unique(list) {
    return list.filter(function (item, index) {
      return list.indexOf(item) === index;
    });
  }

  function loadCss(url) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      link.onload = function () {
        resolve(url);
      };

      link.onerror = function () {
        reject(
          new Error(
            '[Brightspace bootstrap] Unable to load stylesheet: ' + url
          )
        );
      };

      document.head.appendChild(link);
    });
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.async = false;

      script.onload = function () {
        resolve(url);
      };

      script.onerror = function () {
        reject(
          new Error(
            '[Brightspace bootstrap] Unable to load script: ' + url
          )
        );
      };

      document.head.appendChild(script);
    });
  }

  function loadScriptsSequentially(urls) {
    var chain = Promise.resolve();

    urls.forEach(function (url) {
      chain = chain.then(function () {
        return loadScript(url);
      });
    });

    return chain;
  }

  function waitForDom() {
    if (document.readyState !== 'loading') {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      document.addEventListener(
        'DOMContentLoaded',
        resolve,
        { once: true }
      );
    });
  }

  function runCallbacks(callbacks) {
    var chain = Promise.resolve();

    callbacks.forEach(function (callback) {
      chain = chain.then(function () {
        return callback(window.BRIGHTSPACE_RUNTIME);
      });
    });

    return chain;
  }

  /*
   * Page-specific styles must win over page-type and module styles
   * at equal specificity.
   */
  function promotePageStyles() {
    var styles = document.querySelectorAll(
      'style[data-page-style], ' +
      'link[rel="stylesheet"][data-page-style]'
    );

    styles.forEach(function (node) {
      document.head.appendChild(node);
    });
  }

  /* =========================================================
     RESOLVED DEPLOYMENT PATHS
     ========================================================= */

  var frameworkBase = resolveDirectoryFromBootstrap(
    CONFIG.frameworkBase
  );

  /*
   * The shared framework registry is a fixed framework-internal convention.
   * It is always resolved from frameworkBase.
   */
  var frameworkRegistryUrl = new URL(
    'framework-registry.js',
    frameworkBase
  ).href;

  var courseConfigUrl = resolveFromBootstrap(
    CONFIG.courseConfig
  );

  var moduleRegistryUrls = (
    CONFIG.moduleRegistries || []
  ).map(resolveFromBootstrap);

  var pageTypeName = requestedPageType();
  var requestedModuleNames = requestedModules();

  window.BRIGHTSPACE_RUNTIME = {
    bootstrapUrl: bootstrapScript.src,
    bootstrapBase: bootstrapBase.href,
    frameworkBase: frameworkBase,
    frameworkRegistry: frameworkRegistryUrl,
    courseConfig: courseConfigUrl,
    moduleRegistries: moduleRegistryUrls.slice(),
    pageType: pageTypeName,
    requestedModules: requestedModuleNames.slice(),
    modules: []
  };

  /* =========================================================
     BOOTSTRAP PIPELINE
     ========================================================= */

  /*
   * 1. Load the shared framework registry.
   * 2. Load additional registries.
   * 3. Resolve the requested page type and optional modules.
   * 4. Load CSS.
   * 5. Load course configuration and wait for the page DOM/configs.
   * 6. Run beforeFramework hooks.
   * 7. Load the base page runtime.
   * 8. Load optional-module JavaScript.
   * 9. Run afterFramework hooks.
   */
  loadScript(frameworkRegistryUrl)
    .then(function () {
      return loadScriptsSequentially(moduleRegistryUrls);
    })
    .then(function () {
      var baseRuntime = pageTypes[pageTypeName];

      if (!baseRuntime) {
        throw new Error(
          '[Brightspace bootstrap] Unknown page type: ' + pageTypeName
        );
      }

      var modules = resolveModules(
        requestedModuleNames,
        pageTypeName
      );

      window.BRIGHTSPACE_RUNTIME.modules = modules.slice();

      var cssFiles = [];

      baseRuntime.css.forEach(function (path) {
        cssFiles.push(
          new URL(path, baseRuntime.registryBase).href
        );
      });

      modules.forEach(function (moduleName) {
        var module = registeredModules[moduleName];

        module.css.forEach(function (path) {
          cssFiles.push(
            new URL(path, module.registryBase).href
          );
        });
      });

      var cssReady = Promise.all(
        unique(cssFiles).map(loadCss)
      );

      var courseConfigReady = loadScript(courseConfigUrl);
      var domReady = waitForDom();

      return Promise.all([
        cssReady,
        courseConfigReady,
        domReady
      ]).then(function () {
        promotePageStyles();

        lifecycle.beforeFrameworkClosed = true;

        return runCallbacks(lifecycle.beforeFramework)
          .then(function () {
            var baseJs = baseRuntime.js.map(function (path) {
              return new URL(
                path,
                baseRuntime.registryBase
              ).href;
            });

            return loadScriptsSequentially(baseJs);
          })
          .then(function () {
            var moduleJs = [];

            modules.forEach(function (moduleName) {
              var module = registeredModules[moduleName];

              module.js.forEach(function (path) {
                moduleJs.push(
                  new URL(path, module.registryBase).href
                );
              });
            });

            return loadScriptsSequentially(moduleJs);
          })
          .then(function () {
            return runCallbacks(
              lifecycle.afterFramework
            );
          });
      });
    })
    .then(function () {
      lifecycle.ready = true;

      window.dispatchEvent(
        new CustomEvent(
          'brightspace:framework-ready',
          {
            detail: window.BRIGHTSPACE_RUNTIME
          }
        )
      );
    })
    .catch(function (error) {
      console.error(error);

      window.dispatchEvent(
        new CustomEvent(
          'brightspace:framework-error',
          {
            detail: error
          }
        )
      );
    });

})();
