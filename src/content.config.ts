import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Motos', 'Beneficios', 'Rutas', 'Articulos moteros']),
    date: z.coerce.date(),
    heroImage: z.string().min(1),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    affiliateUrl: z.string().url().optional(),
    affiliateLabel: z.string().optional(),
    affiliateOffer: z.string().optional(),
  }),
});

export const collections = { blog };
