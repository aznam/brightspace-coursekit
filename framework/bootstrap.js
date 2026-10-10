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
      backgroundImage:'',
      resources:data.resources||{styles:[],scripts:[],fonts:[]},
      paths:{root:activeCourseBase.replace(/\/$/,''),assets:resolveCourseDirectory(activeCourseBase,p.assets||'assets/'),attachments:resolveCourseDirectory(activeCourseBase,p.attachments||'attachments/'),content:resolveCourseDirectory(activeCourseBase,p.content||'content/'),styles:resolveCourseDirectory(activeCourseBase,c.styles),scripts:resolveCourseDirectory(activeCourseBase,c.scripts),fonts:resolveCourseDirectory(activeCourseBase,c.fonts),framework:frameworkBase.replace(/\/$/,'')}
    };
    applyPalette(data);
  }
  // Course-owned resources: host HTML first, then their configured course folder.
  // Framework component resources are deliberately excluded from this fallback.
  async function loadFonts(){
    var fonts=(window.COURSE_CONFIG.resources&&window.COURSE_CONFIG.resources.fonts)||[];
    var css=[];
    for(var i=0;i<fonts.length;i++){
      var font=fonts[i];
      if(font.source==='online'){
        if(font.url)await loadCss(await window.BRIGHTSPACE.resources.resolve('styles',font.url));
      }else if(font.source==='local'){
        for(var j=0;j<(font.files||[]).length;j++){
          var f=font.files[j];
          var url=font.location==='framework'
            ?new URL(f.file,new URL('fonts/',frameworkBase)).href
            :await window.BRIGHTSPACE.resources.resolve('fonts',f.file);
          css.push('@font-face{font-family:"'+font.family.replace(/"/g,'')+'";src:url("'+url+'") format("'+(f.format||'woff2')+'");font-weight:'+(f.weight||400)+';font-style:'+(f.style||'normal')+';font-display:swap;}');
        }
      }
      if(font.cssVariable)document.documentElement.style.setProperty(font.cssVariable,'"'+font.family+'", '+(font.fallback||'sans-serif'));
    }
    if(css.length){var style=document.createElement('style');style.textContent=css.join('\n');document.head.appendChild(style);}
  }
  async function resolveXmlReferences(xml){
    var doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.getElementsByTagName('parsererror').length)throw new Error('[CourseKit bootstrap] Invalid XML content.');
    // Apply the same course/page variable rules as the course-page presenter,
    // before resolving resource references. Do not change the original text content.
    var values=Object.create(null);
    Object.keys(courseData.course||{}).forEach(function(key){var value=courseData.course[key];if(value!=null&&typeof value!=='object')values['course.'+key]=value;});
    Object.keys(courseData.variables||{}).forEach(function(key){
      if(key==='course'||key.indexOf('course.')===0)throw new Error('[CourseKit variables] Reserved variable: '+key);
      values[key]=courseData.variables[key];
    });
    function interpolate(value){return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_.-]*)\}/g,function(_,name){
      if(!Object.prototype.hasOwnProperty.call(values,name))throw new Error('[CourseKit variables] Unknown variable ${'+name+'}.');
      return String(values[name]);
    });}
    var blocks=Array.from(doc.documentElement.children).filter(function(n){return n.localName==='variables';});
    blocks.forEach(function(block){Array.from(block.children).forEach(function(n){
      if(n.localName!=='var')return;
      var name=n.getAttribute('name');
      if(!name||name==='course'||name.indexOf('course.')===0)throw new Error('[CourseKit variables] Invalid variable name: '+name);
      values[name]=interpolate(n.textContent.trim());
    });});
    // Elements carrying course-level references use explicit categories.
    var refs=[['hero','image','assets'],['picture-with-legend','src','assets'],
      ['picture-without-legend','src','assets'],['a','href','attachments'],['link','href','attachments']];
    var elements=Array.from(doc.getElementsByTagName('*'));
    for(var i=0;i<elements.length;i++){
      var el=elements[i];
      var rule=refs.find(function(r){return r[0]===el.localName;});
      if(!rule||!el.hasAttribute(rule[1]))continue;
      var raw=el.getAttribute(rule[1]);
      raw=interpolate(raw);
      if(raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:'))continue;
      el.setAttribute(rule[1],await window.BRIGHTSPACE.resources.resolve(rule[2],raw));
    }
    return new XMLSerializer().serializeToString(doc);
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
      window.BRIGHTSPACE.resolveSchema=async function(name){
        if(!name||typeof name!=='string')throw new Error('[CourseKit schema] Schema name must be a nonempty string.');
        if(schemaCache[name])return schemaCache[name];
        var frameworkPath=(registry.schemas||{})[name];
        var coursePath=(courseData.schemas||{})[name];
        if(!frameworkPath&&!coursePath)throw new Error('[CourseKit schema] Unknown schema: '+name);
        // Prefer the host HTML directory, then the course's schema directory,
        // then the framework-declared schema. A course mapping replaces the
        // default local filename but does not bypass the host-first policy.
        var localName=coursePath||(frameworkPath ? new URL(frameworkPath,frameworkBase).pathname.split('/').pop() : null);
        var resolved=await window.BRIGHTSPACE.resources.resolve('schemas',localName,{
          frameworkPath:frameworkPath||null
        });
        schemaCache[name]=resolved;
        return resolved;
      };
      window.BRIGHTSPACE.resources=window.BRIGHTSPACE.resourcesFactory.create(activeCourseBase,{hostBase:document.baseURI,frameworkBase:frameworkBase,paths:window.COURSE_CONFIG.paths});await loadFonts();if(courseData.theme&&courseData.theme.backgroundImage){window.COURSE_CONFIG.backgroundImage=await window.BRIGHTSPACE.resources.resolve('assets',courseData.theme.backgroundImage);}if(!contentLogical)throw new Error('[CourseKit bootstrap] No XML content specified. Use data-content or ?content=.');var xml=await window.BRIGHTSPACE.resources.readText('content',contentLogical);var pageType=pageTypeFromXml(xml,registry);var pt=registry.pageTypes&&registry.pageTypes[pageType];if(!pt)throw new Error('[CourseKit bootstrap] Unknown page type '+pageType);await loadAll((pt.styles||[]).map(function(p){return new URL(p,frameworkBase).href;}),loadCss);await loadScript(new URL('scripts/component-engine.js',frameworkBase).href);var defs=[];for(var i=0;i<(pt.components||[]).length;i++)defs.push(await loadComponentDefinition(pt.components[i]));window.BRIGHTSPACE.components.setDefinitions(definitions);var styleUrls=[],scriptUrls=[];Object.keys(definitions).forEach(function(id){var d=definitions[id];styleUrls=styleUrls.concat(d.__styleUrls||[]);scriptUrls=scriptUrls.concat(d.__scriptUrls||[]);});await loadAll(unique(styleUrls),loadCss);await loadAll((pt.scripts||[]).filter(function(p){ return p !== 'scripts/component-engine.js'; }).map(function(p){return new URL(p,frameworkBase).href;}),loadScript);await loadAll(unique(scriptUrls),loadScript);var res=window.COURSE_CONFIG.resources||{};for(var i=0;i<(res.styles||[]).length;i++)await loadCss(await window.BRIGHTSPACE.resources.resolve('styles',res.styles[i]));if(pageType==='course-page')window.BRIGHTSPACE.renderCoursePage(await resolveXmlReferences(xml),{root:document.getElementById('brightspace-root')||document.body});for(var i=0;i<(res.scripts||[]).length;i++)await loadScript(await window.BRIGHTSPACE.resources.resolve('scripts',res.scripts[i]));window.dispatchEvent(new CustomEvent('coursekit:ready'));})
    .catch(function(error){console.error(error);var root=document.getElementById('brightspace-root')||document.body;var pre=document.createElement('pre');pre.textContent=error.stack||error.message||String(error);pre.style.whiteSpace='pre-wrap';pre.style.padding='1rem';root.appendChild(pre);window.dispatchEvent(new CustomEvent('coursekit:error',{detail:error}));});
})();
