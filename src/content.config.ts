import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const quizSchema = z.array(
  z.object({
    question: z.string(),
    options: z.array(z.string()),
    answerIndex: z.number().int().min(0),
    explanation: z.string(),
  })
);

const difficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

const problemSchema = z.object({
  title: z.string(),
  leetcodeId: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prompt: z.string(),
  starterCode: z.string(),
  testCases: z.array(
    z.object({
      input: z.array(z.any()),
      expected: z.any(),
    })
  ),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    docSource: z.string().url(),
    docTitle: z.string(),
    difficulty: difficultySchema,
    objectives: z.array(z.string()),
    coreConcept: z.string(),
    quiz: quizSchema.default([]),
  }),
});

const dsa = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/dsa' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    coreConcept: z.string(),
    docSource: z.string().url(),
    docTitle: z.string(),
    difficulty: difficultySchema,
    objectives: z.array(z.string()),
    quiz: quizSchema.default([]),
    problems: z.array(problemSchema).default([]),
  }),
});

export const collections = { lessons, dsa };
