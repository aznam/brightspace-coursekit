import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vitepress = require('vitepress');

export default vitepress.defineConfig({
  base: '/brightspace-coursekit/',
  title: 'Brightspace CourseKit',
  description: 'Declarative course content and component framework for Brightspace',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Page authors', link: '/guide/' },
      { text: 'Module developers', link: '/module-development/' },
      { text: 'Reference', link: '/reference/semantic-xsd' },
      { text: 'Maintainers', link: '/maintainers/' }
    ],
    sidebar: [
      { text: 'Page authors', collapsed: false, items: [{ text: 'Start', link: '/guide/' }, { text: 'Page parameters', link: '/reference/page-parameters' }, { text: 'Semantic catalog', link: '/reference/semantic-xsd' }] },
      { text: 'Module developers', collapsed: true, items: [{ text: 'Tutorial', link: '/module-development/tutorial' }, { text: 'Namespaces', link: '/module-development/namespaces' }, { text: 'XSD extensions', link: '/module-development/xsd-extensions' }, { text: 'Implement CSS conventions', link: '/module-development/implementing-css-conventions' }, { text: 'Module CSS', link: '/modules/' }] },
      { text: 'Maintainers', collapsed: true, items: [{ text: 'Overview', link: '/maintainers/' }, { text: 'Schema pipeline', link: '/maintainers/schema-pipeline' }, { text: 'Fonts & icons', link: '/maintainers/assets-and-icons' }] },

      { text: 'Getting started', items: [{ text: 'Overview', link: '/' }, { text: 'Local setup', link: '/guide/getting-started' }, { text: 'Bootstrap configuration', link: '/guide/bootstrap' }, { text: 'Authoring semantic XML', link: '/guide/authoring' }, { text: 'Variables and metadata', link: '/guide/variables' }] },
      { text: 'Semantic components (write XML here)', collapsed: false, items: [{ text: 'Overview and contracts', link: '/semantic/' }, { text: 's:content', link: '/semantic/content' }, { text: 's:section', link: '/semantic/section' }, { text: 's:paragraph', link: '/semantic/paragraph' }, { text: 's:heading', link: '/semantic/heading' }, { text: 's:link', link: '/semantic/link' }, { text: 's:picture', link: '/semantic/picture' }, { text: 's:list', link: '/semantic/list' }, { text: 's:item', link: '/semantic/item' }, { text: 's:note', link: '/semantic/note' }, { text: 's:information', link: '/semantic/information' }, { text: 'Learning module (l:*)', link: '/semantic/learning' }] },
      { text: 'Architecture', items: [{ text: 'Semantic → page → components', link: '/architecture/pipeline' }, { text: 'Managers and lifecycle', link: '/architecture/managers' }, { text: 'Resources and VFS', link: '/architecture/resources' }] },
      { text: 'Extension and schemas', items: [{ text: 'Manifests', link: '/reference/manifests' }, { text: 'Semantic vocabulary', link: '/reference/semantic' }, { text: 'Pages', link: '/reference/pages' }, { text: 'XSD preprocessor', link: '/extensions/xsd' }, { text: 'XSLT preprocessor', link: '/extensions/xslt' }, { text: 'Modules', link: '/extensions/modules' }] },
      { text: 'Visual components', collapsed: true, items: [{ text: 'Catalog', link: '/components/' }, { text: "central-content", link: "/components/central-content" },
                                                            { text: "collapse-box", link: "/components/collapse-box" },
                                                            { text: "heading", link: "/components/heading" },
                                                            { text: "hero", link: "/components/hero" },
                                                            { text: "hoverbox", link: "/components/hoverbox" },
                                                            { text: "infobox", link: "/components/infobox" },
                                                            { text: "inline-toc", link: "/components/inline-toc" },
                                                            { text: "item", link: "/components/item" },
                                                            { text: "link", link: "/components/link" },
                                                            { text: "list", link: "/components/list" },
                                                            { text: "navbar", link: "/components/navbar" },
                                                            { text: "page-layout", link: "/components/page-layout" },
                                                            { text: "paragraph", link: "/components/paragraph" },
                                                            { text: "picture", link: "/components/picture" },
                                                            { text: "section", link: "/components/section" },
                                                            { text: "side", link: "/components/side" },
                                                            { text: "sidebar-after", link: "/components/sidebar-after" },
                                                            { text: "sidebar-before", link: "/components/sidebar-before" }
                                                          ] 
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/aznam/brightspace-coursekit' }],
    search: { provider: 'local' }
  }
});