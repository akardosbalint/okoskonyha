import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://akardosbalint.hu',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/adatvedelem/') && !page.includes('/aszf/'),
    }),
    mdx(),
  ],
});
