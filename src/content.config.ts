import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      excerpt: z.string(),
      date: z.coerce.date(),
      category: z.enum(['sztorik', 'fozesi-tippek', 'jotekonysag']),
      tags: z.array(z.string()).default([]),
      cover: image(),
      coverAlt: z.string(),
      featured: z.boolean().default(false),
      author: z.string().default('Kardos Bálint'),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{json,yaml,yml}', base: './src/content/testimonials' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      quote: z.string(),
      avatar: image().optional(),
      context: z.enum(['general', 'okoskonyha', 'jotekonysag', 'privat']).default('general'),
    }),
});

export const collections = { blog, testimonials };
