import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One official PostgreSQL doc = one lesson.
 * A lesson teaches exactly ONE concept, deeply.
 */
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    // Used for ordering on the index page / prev-next navigation.
    order: z.number(),
    title: z.string(),
    // Direct link to the official PostgreSQL documentation this lesson derives from.
    docSource: z.string().url(),
    docTitle: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    // "After this page, you can explain in your own words ..."
    objectives: z.array(z.string()),
    // The one and only concept this page teaches.
    coreConcept: z.string(),
    quiz: z
      .array(
        z.object({
          question: z.string(),
          options: z.array(z.string()),
          // Index of the correct option.
          answerIndex: z.number().int().min(0),
          // Why this answer is correct (and, where useful, why the others are not).
          explanation: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { lessons };
