import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
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
  type: 'data',
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
