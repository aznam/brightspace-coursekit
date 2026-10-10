
(function () {
  'use strict';
  var script=document.currentScript;
  if(!script||!script.src)throw new Error('[CourseKit bootstrap] Cannot determine bootstrap.js URL.');
  // Paths are supplied by the course loader script, not through globals.
  window.BRIGHTSPACE=window.BRIGHTSPACE||{};
  var frameworkBase=new URL('.',script.src).href;
  var initialCourseBase=new URL(script.dataset.courseRoot||'.',frameworkBase).href;
  var registryUrl=new URL('registry.json',frameworkBase).href;
  var courseConfigUrl=new URL(script.dataset.courseConfig||'course.json',initialCourseBase).href;
  var contentLogical=script.dataset.content||new URL(window.location.href).searchParams.get('content')||null;

  // Page type is determined from the XML document's root namespace.
  function pageTypeFromXml(xml,registry){
    var doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.getElementsByTagName('parsererror').length){
      throw new Error('[CourseKit bootstrap] Invalid XML content.');
    }
    var root=doc.documentElement;
    if(!root)throw new Error('[CourseKit bootstrap] Missing XML root element.');
    var namespace=root.namespaceURI;
    var types=registry.pageTypes||{};
    var matches=Object.keys(types).filter(function(id){return types[id].namespace===namespace;});
    if(matches.length!==1)throw new Error('[CourseKit bootstrap] Expected one page type for XML namespace '+namespace+', found '+matches.length+'.');
    return matches[0];
  }

  function loadScript(url){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=url;s.async=false;s.onload=function(){resolve(url);};s.onerror=function(){reject(new Error('[CourseKit bootstrap] Cannot load '+url));};document.head.appendChild(s);});}
  function loadCss(url){return new Promise(function(resolve,reject){var l=document.createElement('link');l.rel='stylesheet';l.href=url;l.onload=function(){resolve(url);};l.onerror=function(){reject(new Error('[CourseKit bootstrap] Cannot load '+url));};document.head.appendChild(l);});}
  function unique(a){return a.filter(function(v,i){return a.indexOf(v)===i;});}
  function dir(base,path){var u=new URL(path||'.',base);if(!u.pathname.endsWith('/'))u.pathname+='/';return u.href;}
  function applyPalette(course){var pal=course.theme&&course.theme.palette||{};Object.keys(pal).forEach(function(k){document.documentElement.style.setProperty('--ck-'+k,pal[k]);});}
  function resolveCourseDirectory(base,path){return path?dir(base,path).replace(/\/$/,''):null;}

  var activeCourseBase=initialCourseBase, courseData=null, registry=null, definitions=Object.create(null);
  function installCourse(data){
    courseData=data||{};var siteId=data.siteId||null;
    if(siteId){activeCourseBase=new URL('/content/enforced/'+String(siteId).replace(/^\/+|\/+$/g,'')+'/',window.location.origin).href;}
    var p=data.paths||{}, c=data.customPaths||{}, theme=data.theme||{};
    window.COURSE_DATA=data;
    window.COURSE_CONFIG={
      siteId:siteId,
      courseCode:data.course&&data.course.code||'', courseTitle:data.course&&data.course.title||'',
      palette:theme.palette||{}, icons:data.icons||{}, variables:data.variables||{},
      backgroundImage:theme.backgroundImage?new URL(theme.backgroundImage,dir(activeCourseBase,p.assets||'assets/')).href:'',
      resources:data.resources||{styles:[],scripts:[],fonts:[]},
      paths:{root:activeCourseBase.replace(/\/$/,''),assets:resolveCourseDirectory(activeCourseBase,p.assets||'assets/'),attachments:resolveCourseDirectory(activeCourseBase,p.attachments||'attachments/'),content:resolveCourseDirectory(activeCourseBase,p.content||'content/'),styles:resolveCourseDirectory(activeCourseBase,c.styles),scripts:resolveCourseDirectory(activeCourseBase,c.scripts),fonts:resolveCourseDirectory(activeCourseBase,c.fonts),framework:frameworkBase.replace(/\/$/,'')}
    };
    applyPalette(data);
  }
  function resolveCustom(kind,file){var base=window.COURSE_CONFIG.paths[kind];if(!base)throw new Error('[CourseKit bootstrap] Custom '+kind+' directory disabled, but '+file+' was requested.');return new URL(file,base+'/').href;}
  function loadFonts(){var fonts=(window.COURSE_CONFIG.resources&&window.COURSE_CONFIG.resources.fonts)||[];var css=[];fonts.forEach(function(font){if(font.source==='online'){if(font.url){var l=document.createElement('link');l.rel='stylesheet';l.href=font.url;document.head.appendChild(l);}}else if(font.source==='local'){var base=font.location==='framework'?new URL('fonts/',frameworkBase).href:window.COURSE_CONFIG.paths.fonts;if(!base)throw new Error('[CourseKit bootstrap] Local course font requested but customPaths.fonts is disabled.');(font.files||[]).forEach(function(f){css.push('@font-face{font-family:"'+font.family.replace(/"/g,'')+'";src:url("'+new URL(f.file,base.replace(/\/$/,'')+'/').href+'") format("'+(f.format||'woff2')+'");font-weight:'+(f.weight||400)+';font-style:'+(f.style||'normal')+';font-display:swap;}');});}if(font.cssVariable){document.documentElement.style.setProperty(font.cssVariable,'"'+font.family+'", '+(font.fallback||'sans-serif'));}});if(css.length){var st=document.createElement('style');st.textContent=css.join('\n');document.head.appendChild(st);}}
  // Resolve page XML relative to the host HTML first, then the active course root.
  // Absolute URLs and root-relative paths are requested only once.
  async function resolveContent(content, courseRoot) {
    var local = new URL(content, document.baseURI).href;
    var course = new URL(content, courseRoot).href;
    var candidates = local === course ? [local] : [local, course];
    for (var i = 0; i < candidates.length; i++) {
      var response = await fetch(candidates[i], {credentials: 'same-origin', cache: 'no-store'});
      if (response.ok) return {url: candidates[i], text: await response.text()};
      if (response.status !== 404) {
        throw new Error('[CourseKit bootstrap] Cannot load '+candidates[i]+' (HTTP '+response.status+').');
      }
    }
    throw new Error('[CourseKit bootstrap] XML content not found: '+content+' (checked '+candidates.join(', ')+').');
  }
  async function readJsonAbsolute(url){var r=await fetch(url,{credentials:'same-origin'});if(!r.ok)throw new Error('[CourseKit bootstrap] Cannot read '+url);return r.json();}
  async function loadComponentDefinition(id){
    if(definitions[id])return definitions[id];
    var url=new URL('components/'+id+'/component.json',frameworkBase).href;
    var own=await readJsonAbsolute(url);
    var ownBase=new URL('.',url).href;

    // Resources declared by this manifest must remain relative to this manifest.
    // Parent resources keep the URLs resolved by the parent definition.
    var declaredStyles=(own.styles||[]).slice();
    var declaredScripts=(own.scripts||[]).slice();
    var inheritedStyles=[], inheritedScripts=[];

    if(own.extends){
      var parent=await loadComponentDefinition(own.extends);
      inheritedStyles=(parent.__styleUrls||[]).slice();
      inheritedScripts=(parent.__scriptUrls||[]).slice();
      own=window.BRIGHTSPACE.components.mergeDefinition(parent,own);
    }

    own.__base=ownBase;
    own.__styleUrls=unique(inheritedStyles.concat(declaredStyles.map(function(path){return new URL(path,ownBase).href;})));
    own.__scriptUrls=unique(inheritedScripts.concat(declaredScripts.map(function(path){return new URL(path,ownBase).href;})));
    definitions[id]=own;
    return own;
  }
  async function loadAll(urls,loader){for(var i=0;i<urls.length;i++)await loader(urls[i]);}

  loadScript(new URL('scripts/resource-provider.js',frameworkBase).href)
    .then(function(){return Promise.all([readJsonAbsolute(registryUrl),readJsonAbsolute(courseConfigUrl)]);})
    .then(async function(vals){registry=vals[0];
      installCourse(vals[1]);
      // Resolve logical schema IDs independently of the host HTML location.
      // Course-specific schemas take precedence over framework defaults.
      // This API is asynchronous because existence must be checked over HTTP.
      var schemaCache=Object.create(null);
      async function existsSchema(url){
        var response=await fetch(url,{method:'HEAD',credentials:'same-origin',cache:'no-store'});
        if(response.ok)return true;
        if(response.status===404)return false;
        if(response.status===405||response.status===501){
          var check=await fetch(url,{method:'GET',credentials:'same-origin',cache:'no-store'});
          if(check.ok)return true;
          if(check.status===404)return false;
          throw new Error('[CourseKit schema] Cannot check '+url+' (HTTP '+check.status+').');
        }
        throw new Error('[CourseKit schema] Cannot check '+url+' (HTTP '+response.status+').');
      }
      window.BRIGHTSPACE.resolveSchema=async function(name){
        if(!name||typeof name!=='string')throw new Error('[CourseKit schema] Schema name must be a nonempty string.');
        if(schemaCache[name])return schemaCache[name];
        var frameworkPath=(registry.schemas||{})[name];
        var coursePath=(courseData.schemas||{})[name];
        var candidates=[];
        if(coursePath){
          candidates.push(new URL(coursePath,activeCourseBase).href);
        }else if(frameworkPath){
          // A local file of the same name overrides the framework schema.
          var filename=new URL(frameworkPath,frameworkBase).pathname.split('/').pop();
          candidates.push(new URL('schemas/'+filename,activeCourseBase).href);
        }
        if(frameworkPath)candidates.push(new URL(frameworkPath,frameworkBase).href);
        if(!candidates.length)throw new Error('[CourseKit schema] Unknown schema: '+name);
        for(var i=0;i<candidates.length;i++){
          if(await existsSchema(candidates[i])){
            schemaCache[name]=candidates[i];
            return candidates[i];
          }
        }
        throw new Error('[CourseKit schema] Schema not found locally or in framework: '+name+' (checked '+candidates.join(', ')+').');
      };window.BRIGHTSPACE.resources=window.BRIGHTSPACE.resourcesFactory.create(activeCourseBase);loadFonts();if(!contentLogical)throw new Error('[CourseKit bootstrap] No XML content specified. Use data-content or ?content=.');var resolvedContent=await resolveContent(contentLogical,activeCourseBase);var xml=resolvedContent.text;var pageType=pageTypeFromXml(xml,registry);var pt=registry.pageTypes&&registry.pageTypes[pageType];if(!pt)throw new Error('[CourseKit bootstrap] Unknown page type '+pageType);await loadAll((pt.styles||[]).map(function(p){return new URL(p,frameworkBase).href;}),loadCss);await loadScript(new URL('scripts/component-engine.js',frameworkBase).href);var defs=[];for(var i=0;i<(pt.components||[]).length;i++)defs.push(await loadComponentDefinition(pt.components[i]));window.BRIGHTSPACE.components.setDefinitions(definitions);var styleUrls=[],scriptUrls=[];Object.keys(definitions).forEach(function(id){var d=definitions[id];styleUrls=styleUrls.concat(d.__styleUrls||[]);scriptUrls=scriptUrls.concat(d.__scriptUrls||[]);});await loadAll(unique(styleUrls),loadCss);await loadAll((pt.scripts||[]).filter(function(p){ return p !== 'scripts/component-engine.js'; }).map(function(p){return new URL(p,frameworkBase).href;}),loadScript);await loadAll(unique(scriptUrls),loadScript);var res=window.COURSE_CONFIG.resources||{};await loadAll((res.styles||[]).map(function(f){return resolveCustom('styles',f);}),loadCss);if(pageType==='course-page')window.BRIGHTSPACE.renderCoursePage(xml,{root:document.getElementById('brightspace-root')||document.body});await loadAll((res.scripts||[]).map(function(f){return resolveCustom('scripts',f);}),loadScript);window.dispatchEvent(new CustomEvent('coursekit:ready'));})
    .catch(function(error){console.error(error);var root=document.getElementById('brightspace-root')||document.body;var pre=document.createElement('pre');pre.textContent=error.stack||error.message||String(error);pre.style.whiteSpace='pre-wrap';pre.style.padding='1rem';root.appendChild(pre);window.dispatchEvent(new CustomEvent('coursekit:error',{detail:error}));});
})();
