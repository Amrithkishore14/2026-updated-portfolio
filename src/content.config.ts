import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['cloud', 'web', 'fullstack', 'design']),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    year: z.string(),
    role: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).default([]),
    live: z.string().optional().default(''),
    liveLabel: z.string().optional().default('Open the live site'),
    code: z.string().optional().default(''),
    cover: z.string().optional().default(''),
    gallery: z.array(z.string()).default([]),
    concept: z.boolean().default(false),
  }),
});
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional().default(''),
    company: z.string().optional().default(''),
    relationship: z.string().optional().default('Other'),
    about: z.string().optional().default(''),
    quote: z.string(),
    linkedin: z.string().optional().default(''),
    approved: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(50),
    submittedAt: z.string().optional().default(''),
  }),
});
export const collections = { projects, testimonials };
