import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://akardosbalint.hu',
  // A teljes oldal statikus marad (minden oldal build-időben előre renderelődik);
  // az adapter csak azt teszi lehetővé, hogy egy-két API route (pl. a hírlevél-feliratkozás)
  // Vercel szerverless függvényként fusson, ahol az API-kulcsok biztonságban maradnak.
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/adatvedelem/') && !page.includes('/aszf/') && !page.includes('/blog/cimke/'),
    }),
    mdx(),
  ],
});
