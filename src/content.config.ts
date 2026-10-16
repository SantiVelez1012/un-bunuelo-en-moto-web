import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Motos', 'Productos', 'Beneficios', 'Rutas']).optional(),
    categories: z.array(z.enum(['Motos', 'Productos', 'Beneficios', 'Rutas'])).min(1).optional(),
    date: z.coerce.date(),
    heroImage: z.string().min(1),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    affiliateUrl: z.string().url().optional(),
    affiliateLabel: z.string().optional(),
    affiliateOffer: z.string().optional(),
  }).refine((post) => Boolean(post.category || post.categories?.length), {
    path: ['categories'],
    message: 'Define al menos una categoría en category o categories.',
  }),
});

export const collections = { blog };
