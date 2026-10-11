import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const vitepress = require('vitepress');

export default vitepress.defineConfig({
  title: 'CourseKit',
  base: '/brightspace-coursekit/',
  description: 'CourseKit documentation',
  srcDir: '.',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/' }, { text: 'Components', link: '/components/' }],
    sidebar: {
      '/components/': [{ text: 'Component reference', items: [
        { text: 'navbar', link: '/components/navbar' },
        { text: 'hero', link: '/components/hero' },
        { text: 'side', link: '/components/side' },
        { text: 'central-content', link: '/components/central-content' },
        { text: 'inline-toc', link: '/components/inline-toc' },
        { text: 'section', link: '/components/section' },
        { text: 'collapse-box', link: '/components/collapse-box' },
        { text: 'hoverbox', link: '/components/hoverbox' },
        { text: 'infobox', link: '/components/infobox' },
        { text: 'picture', link: '/components/picture' },
        { text: 'picture-with-legend', link: '/components/picture-with-legend' },
        { text: 'picture-without-legend', link: '/components/picture-without-legend' },
      ] }],
      '/guide/': [{ text: 'Guide', items: [{text:'Overview',link:'/guide/'}, {text:'Documentation contract',link:'/guide/documentation-contract'}] }]
    }
  }
});
