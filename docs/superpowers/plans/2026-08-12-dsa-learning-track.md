# Odyssey DSA Learning Track — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a DSA learning track to the existing Odyssey app — a `/dsa/` section with 28
day-lessons, each teaching one algorithm/DS concept with an animated visualizer, in-browser
LeetCode-style problems solved against a sandboxed JS judge, and a teaching quiz (6-10 questions).

**Architecture:** A second Astro content collection (`dsa`) declared in `src/content.config.ts`,
rendered by new `/dsa/` routes wrapped in a new `DsaLessonLayout` that auto-renders one `CodeRunner`
island per problem and the existing `Quiz` island. The judge runs user JavaScript inside a
Blob-sourced Web Worker (`new Function` + deepEqual against hidden test cases), keeping the site
100% static (GitHub Pages). Animated diagrams use a new data-driven `DsaVisualizer` island. Content
is authored in waves following the reference lesson.

**Tech Stack:** Astro 7 (already installed), MDX content collections + Zod schema, React 19 islands
(`@astrojs/react`), Tailwind v4 (already installed), no new dependencies, Bun as package manager.

## Global Constraints

- **TypeScript only** in `src/`. Config files are `.mts`. In `.tsx` files use `className`, never
  `class`.
- **Package manager:** Bun. Run scripts with `bun run <script>`.
- **Quality gates — ALL must pass before a task is complete** (see `RULES.md` §5):
  - `bun run format` (no changes), `bun run format:check` ("All matched files use Prettier code
    style!"), `bun run lint` (no error output), `bun run check` (0 errors), `bun run build` (no
    errors; this validates content schemas).
- **Prettier style:** 80-100 char lines, 2-space indent, trailing commas (ES5), single quotes (see
  `prettier.config.mts`).
- **Dev spot-checks:** use `astro dev --background`, then `astro dev status`, `astro dev stop`,
  `astro dev logs`. Dev server may serve under `/odyssey/` (base is configured in
  `astro.config.mts`) — check both `/dsa/` and `/odyssey/dsa/` if a URL 404s.
- **No test runner exists in this repo.** Verification = the quality gates above + the manual island
  spot-checks described per task. Do not add vitest or any dependency.
- **Product rules** (from the spec; always true): one concept per lesson; daily plan but zero
  gamification and **no state/persistence of any kind** (no localStorage, no day-tracking); original
  Feynman lessons with web-sourced `docSource`; every lesson ships an animated visualizer; quiz
  answers teach WHY; user solves in browser in **JavaScript only**.
- **Conventional Commits** enforced by `.githooks/commit-msg` (types:
  `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`). One descriptive commit per task.
  Match repo style (see `git log --oneline`).
- **Lesson body contract** (from `RULES.md` + the OdysseyDB template): sections in this order — "The
  one question this page answers", "Start with an analogy", precise definition sections, "What this
  is NOT" (a misconception table with two columns), "Why this matters". Pages ~10-min read.
- Every lesson's `docSource` is a reputable reference (Wikipedia, GeeksforGeeks, language official
  docs, LeetCode official editorials). Never scrape or copy wholesale; text is our own rewrite.

---

### Task 1: Add the `dsa` content collection + shared schemas

**Files:**

- Modify: `src/content.config.ts`

**Interfaces:**

- Produces: collection `dsa` whose entry type is usable anywhere `getCollection('dsa')` is called.
  `dsa.data.problems[]` has the shape consumed by `CodeRunner` (Task 2). `dsa.data.quiz` is
  identical in shape to `lessons.data.quiz` and is consumed by the existing `Quiz` island.

- [ ] **Step 1: Refactor `src/content.config.ts` to the full content below**

Replace the entire file with:

```ts
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
```

Note: the existing `lessons` schema's behavior is unchanged — only its `quiz` sub-schema was
extracted to the shared `quizSchema`.

- [ ] **Step 2: Verify the gates**

Run: `bun run check` Expected: 0 errors (the existing `01-how-a-query-runs.mdx` still validates
against the refactored schema).

Run: `bun run lint` Expected: no error output.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add dsa content collection with lesson and problem schemas"
```

---

### Task 2: `CodeRunner` island — the sandboxed in-browser JS judge

**Files:**

- Create: `src/components/CodeRunner.tsx`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: default-export `CodeRunner` and exported types `CodeRunnerProblem`, `ProblemTestCase`.
  The `DsaLessonLayout` (Task 4) passes each `lesson.data.problems[i]` as `problem`; props
  type-check structurally against the Zod-inferred shape (Task 1).

- [ ] **Step 1: Create `src/components/CodeRunner.tsx` with the full content below**

```tsx
import { useEffect, useRef, useState } from 'react';

export interface ProblemTestCase {
  input: unknown[];
  expected: unknown;
}

export interface CodeRunnerProblem {
  title: string;
  leetcodeId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  starterCode: string;
  testCases: ProblemTestCase[];
}

interface CodeRunnerProps {
  problem: CodeRunnerProblem;
}

interface TestResult {
  pass: boolean;
  got: unknown;
  expected: unknown;
  error: string | null;
}

// The worker under test: defines `solution` from user code, runs every test case in a
// try/catch, deep-compares against the expected value, and reports back. Runs in a
// Blob worker so a busy loop in user code never blocks the page UI.
const WORKER_SOURCE = [
  'function deepEqual(a, b) {',
  '  if (a === b) return true;',
  '  if (typeof a !== typeof b) return false;',
  '  if (a === null || b === null) return a === b;',
  "  if (typeof a !== 'object') return false;",
  '  const aArr = Array.isArray(a);',
  '  const bArr = Array.isArray(b);',
  '  if (aArr !== bArr) return false;',
  '  if (aArr) {',
  '    if (a.length !== b.length) return false;',
  '    for (let i = 0; i < a.length; i++) {',
  '      if (!deepEqual(a[i], b[i])) return false;',
  '    }',
  '    return true;',
  '  }',
  '  const aKeys = Object.keys(a);',
  '  const bKeys = Object.keys(b);',
  '  if (aKeys.length !== bKeys.length) return false;',
  '  for (const k of aKeys) {',
  '    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;',
  '    if (!deepEqual(a[k], b[k])) return false;',
  '  }',
  '  return true;',
  '}',
  '',
  'self.onmessage = function (event) {',
  '  var msg = event.data;',
  '  var solution;',
  '  try {',
  "    var factory = new Function(msg.code + '\\nreturn solution;');",
  '    solution = factory();',
  "    if (typeof solution !== 'function') {",
  "      throw new Error('Define a function named solution, e.g. function solution(nums, target) { ... }');",
  '    }',
  '  } catch (err) {',
  "    self.postMessage({ kind: 'error', error: String(err && err.message ? err.message : err) });",
  '    return;',
  '  }',
  '  var results = [];',
  '  var start = Date.now();',
  '  for (var i = 0; i < msg.testCases.length; i++) {',
  '    var tc = msg.testCases[i];',
  '    try {',
  '      var got = solution.apply(null, tc.input);',
  '      results.push({ pass: deepEqual(got, tc.expected), got: got, expected: tc.expected, error: null });',
  '    } catch (err) {',
  '      results.push({',
  '        pass: false,',
  '        got: undefined,',
  '        expected: tc.expected,',
  '        error: String(err && err.message ? err.message : err),',
  '      });',
  '    }',
  '  }',
  '  self.postMessage({ kind: "done", results: results, ms: Date.now() - start });',
  '};',
].join('\n');

const DIFFICULTY_BADGE: Record<CodeRunnerProblem['difficulty'], string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

function fmt(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function leetcodeUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `https://leetcode.com/problems/${slug}/`;
}

export default function CodeRunner({ problem }: CodeRunnerProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  function getWorker(): Worker {
    if (workerRef.current) return workerRef.current;
    const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;
    return worker;
  }

  function run() {
    setRunning(true);
    setSyntaxError(null);
    const worker = getWorker();
    worker.onmessage = (event) => {
      setRunning(false);
      if (event.data.kind === 'error') {
        setResults(null);
        setSyntaxError(event.data.error);
      } else {
        setResults(event.data.results);
      }
    };
    worker.postMessage({ code, testCases: problem.testCases });
  }

  function reset() {
    setCode(problem.starterCode);
    setResults(null);
    setSyntaxError(null);
  }

  const passed = results?.filter((r) => r.pass).length ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">{problem.title}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_BADGE[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">#{problem.leetcodeId}</span>
          {results && (
            <span
              className={`text-xs font-semibold ${
                passed === problem.testCases.length ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {passed}/{problem.testCases.length} tests
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <pre className="max-h-40 overflow-auto rounded-xl bg-slate-50 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-600">
          {problem.prompt}
        </pre>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="h-44 w-full rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
          <a
            href={leetcodeUrl(problem.title)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Open on LeetCode ↗
          </a>
        </div>

        {syntaxError && (
          <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">Could not load your code:</p>
            <p className="mt-1 font-mono leading-relaxed">{syntaxError}</p>
          </div>
        )}

        {results && !syntaxError && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex flex-wrap items-start gap-3 rounded-xl border p-3 text-sm ${
                  r.pass
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                <span className="font-semibold">Test {i + 1}</span>
                <span className={r.pass ? '' : 'font-medium'}>
                  {r.pass ? '✓ passed' : '✗ failed'}
                  {r.error ? ` — ${r.error}` : ''}
                </span>
                <span className="w-full font-mono text-xs leading-relaxed">
                  got {fmt(r.got)} · expected {fmt(r.expected)}
                </span>
              </div>
            ))}
            <p className="text-xs text-slate-400">
              Ran in the page&apos;s own sandbox — view the full test set on LeetCode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify compile + lint**

Run `bun run check` → 0 errors. Run `bun run lint` → no error output. Run `bun run format` then
`bun run format:check` → clean. (Functional runtime behaviour is exercised in Task 5, when the
island is first rendered.)

- [ ] **Step 3: Commit**

```bash
git add src/components/CodeRunner.tsx
git commit -m "feat: sandboxed in-browser JavaScript judge island"
```

---

### Task 3: `DsaVisualizer` island — the data-driven animated diagram

**Files:**

- Create: `src/components/DsaVisualizer.tsx`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: default-export `DsaVisualizer` and exported interfaces `VisualizerFrame`,
  `VisualizerRow`, `VisualizerCell`, `VisualizerPointer`. Lesson MDX files (Task 5+) import the
  component and annotate their frame data with `VisualizerFrame[]`.

- [ ] **Step 1: Create `src/components/DsaVisualizer.tsx` with the full content below**

```tsx
import { useEffect, useState } from 'react';

export interface VisualizerCell {
  value: string | number;
  state?: 'idle' | 'active' | 'done';
}

export interface VisualizerPointer {
  index: number;
  label: string;
  color: string;
}

export interface VisualizerRow {
  cells: VisualizerCell[];
  pointers?: VisualizerPointer[];
}

export interface VisualizerFrame {
  rows: VisualizerRow[];
  caption: string;
}

interface DsaVisualizerProps {
  title: string;
  frames: VisualizerFrame[];
}

const CELL_STATE: Record<string, string> = {
  idle: 'border-slate-200 bg-slate-100 text-slate-700',
  active: 'border-indigo-600 bg-indigo-600 text-white shadow-md',
  done: 'border-emerald-300 bg-emerald-100 text-emerald-800',
};

export default function DsaVisualizer({ title, frames }: DsaVisualizerProps) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrame((f) => {
        if (f >= frames.length - 1) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  function select(i: number) {
    setFrame(i);
    setPlaying(false);
  }

  const current = frames[frame];

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => select(0)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => Math.max(f - 1, 0))}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            ← Step
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {playing ? 'Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => Math.min(f + 1, frames.length - 1))}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Step →
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        {current.rows.map((row, r) => (
          <div key={r} className="relative pt-6">
            <div className="flex justify-center gap-1">
              {row.cells.map((cell, c) => (
                <div
                  key={c}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-sm font-semibold transition ${CELL_STATE[cell.state ?? 'idle']}`}
                >
                  {cell.value}
                </div>
              ))}
            </div>
            {row.pointers?.map((p, pi) => (
              <div
                key={pi}
                className="pointer-events-none absolute top-0"
                style={{
                  left: `${((p.index + 0.5) / row.cells.length) * 100}%`,
                  transform: 'translateX(-50%)',
                  color: p.color,
                }}
              >
                <span className="text-[10px] font-bold tracking-wide uppercase">{p.label}</span>
                <div className="mx-auto h-4 w-px bg-current" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="min-h-[3.5rem] border-t border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-indigo-600">
            Step {frame + 1} / {frames.length}:
          </span>{' '}
          {current.caption}
        </p>
      </div>
    </figure>
  );
}
```

- [ ] **Step 2: Verify compile + lint**

Run `bun run check` → 0 errors. Run `bun run lint` → no error output. Run `bun run format` /
`bun run format:check` → clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/DsaVisualizer.tsx
git commit -m "feat: data-driven animated step-through diagram island"
```

---

### Task 4: DSA routes, layouts, and home/nav polish

**Files:**

- Create: `src/layouts/DsaLessonLayout.astro`
- Create: `src/pages/dsa/index.astro`
- Create: `src/pages/dsa/lessons/[slug].astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**

- Consumes: `CodeRunner` (Task 2), `DsaVisualizer` (via lesson MDX, Task 5), the existing `Quiz`
  island, collection `dsa` (Task 1).
- Produces: routes `/dsa/` and `/dsa/lessons/[slug]`; `DsaLessonLayout` with props
  `{ lesson: CollectionEntry<'dsa'>, prev?, next? }`; `BaseLayout` accepts an optional
  `pill?: string` prop.

- [ ] **Step 1: Modify `BaseLayout.astro` — add the DSA nav item and a section pill**

Replace the frontmatter:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  pill?: string;
}

const { title, description, pill } = Astro.props;
const nav = [
  { href: '/lessons', label: 'Lessons' },
  { href: '/dsa', label: 'DSA' },
];
---
```

Replace the header brand pill (currently hardcoded `PostgreSQL`):

```astro
<span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
  >{pill ?? 'PostgreSQL'}</span
>
```

(The `<a href="/" ...>` home link stays; the existing `Home` item was dropped from `nav` because the
wordmark already links home.)

- [ ] **Step 2: Replace `src/pages/index.astro` with the two-card track picker**

Full file:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const lessons = await getCollection('lessons');
const dsa = await getCollection('dsa');
---

<BaseLayout title="Odyssey — learn deeply, prove it with a quiz">
  <section class="py-10 text-center">
    <p class="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
      A slow, disciplined journey — taught one idea at a time
    </p>
    <h1 class="mx-auto mt-4 max-w-2xl text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
      One idea per page. Explain it. Prove it with a quiz.
    </h1>
    <p class="mx-auto mt-5 max-w-xl text-lg text-slate-600">
      Based on Richard Feynman&apos;s technique — if you can&apos;t explain it simply, you
      don&apos;t understand it. Pick a track below.
    </p>
  </section>

  <section class="grid gap-4 sm:grid-cols-2">
    <a
      href="/lessons"
      class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow"
    >
      <span class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
        PostgreSQL
      </span>
      <h2 class="mt-3 text-xl font-bold tracking-tight text-slate-800 group-hover:text-indigo-700">
        Learn PostgreSQL
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        One concept per page, sourced from the official docs. Animated diagrams and a teaching quiz
        per lesson.
      </p>
      <p class="mt-4 text-sm font-semibold text-indigo-600">{lessons.length} lessons ↗</p>
    </a>
    <a
      href="/dsa"
      class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow"
    >
      <span
        class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
      >
        Algorithms
      </span>
      <h2 class="mt-3 text-xl font-bold tracking-tight text-slate-800 group-hover:text-emerald-700">
        Learn DSA
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        A 28-day sequence through the fundamentals, with LeetCode-style problems you solve in the
        browser.
      </p>
      <p class="mt-4 text-sm font-semibold text-emerald-600">{dsa.length} days so far ↗</p>
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Create `src/layouts/DsaLessonLayout.astro`**

Full file:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Quiz from '../components/Quiz';
import CodeRunner from '../components/CodeRunner';
import type { CollectionEntry } from 'astro:content';

interface Props {
  lesson: CollectionEntry<'dsa'>;
  prev?: CollectionEntry<'dsa'>;
  next?: CollectionEntry<'dsa'>;
}

const { lesson, prev, next } = Astro.props;
const { title, difficulty, objectives, coreConcept, docSource, docTitle, problems, order } =
  lesson.data;

const difficultyBadge: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};
---

<BaseLayout title={`${title} — Odyssey DSA`} pill="DSA">
  <!-- Header: one concept, one day -->
  <div class="mb-8">
    <a href="/dsa" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
      ← DSA syllabus
    </a>
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
        Day {String(order).padStart(2, '0')}
      </span>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <span
        class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyBadge[difficulty]}`}
      >
        {difficulty}
      </span>
    </div>

    <div class="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <p class="text-xs font-semibold tracking-wider text-indigo-500 uppercase">
        The one idea on this page
      </p>
      <p class="mt-1 text-lg font-medium text-indigo-900">{coreConcept}</p>
    </div>

    <div class="mt-4">
      <p class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        After this page you can explain in your own words…
      </p>
      <ul class="mt-2 space-y-1.5">
        {
          objectives.map((o) => (
            <li class="flex items-start gap-2 text-slate-700">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              {o}
            </li>
          ))
        }
      </ul>
    </div>
  </div>

  <!-- Feynman teaching body (includes the DsaVisualizer island) -->
  <article class="lesson-body">
    <slot />
  </article>

  <!-- In-browser problems: one CodeRunner per problem -->
  <section class="mt-12 space-y-6">
    <h2 class="text-2xl font-bold tracking-tight">Solve it in your own browser</h2>
    <p class="text-sm text-slate-500">
      Write <code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs"
        >function solution(...)</code
      > in JavaScript and run it against hidden test cases — your editor, your pace.
    </p>
    {problems.map((p) => <CodeRunner client:load key={p.title} problem={p} />)}
  </section>

  <!-- Teaching quiz -->
  <section class="mt-12">
    <Quiz questions={lesson.data.quiz} />
  </section>

  <hr class="my-10 border-slate-200" />

  <!-- Source + navigation -->
  <div class="flex flex-col gap-4">
    <p class="text-sm text-slate-500">
      Source:{' '}
      <a
        href={docSource}
        target="_blank"
        rel="noreferrer"
        class="font-medium text-indigo-600 hover:underline"
      >
        {docTitle}
      </a>
    </p>
    <nav class="flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-6">
      {
        prev ? (
          <a href={`/dsa/lessons/${prev.id}`} class="group max-w-xs">
            <span class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Previous day
            </span>
            <span class="block text-sm font-medium text-slate-700 group-hover:text-indigo-600">
              ← {prev.data.title}
            </span>
          </a>
        ) : (
          <span />
        )
      }
      {
        next ? (
          <a href={`/dsa/lessons/${next.id}`} class="group max-w-xs text-right">
            <span class="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Next day
            </span>
            <span class="block text-sm font-medium text-slate-700 group-hover:text-indigo-600">
              {next.data.title} →
            </span>
          </a>
        ) : (
          <span />
        )
      }
    </nav>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create `src/pages/dsa/index.astro` — the syllabus**

Full file:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

const days = await getCollection('dsa');
days.sort((a, b) => a.data.order - b.data.order);

const difficultyBadge: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};
---

<BaseLayout title="DSA syllabus — Odyssey" pill="DSA">
  <div class="mb-8">
    <a href="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">← Home</a>
    <h1 class="mt-3 text-3xl font-bold tracking-tight">The 28-day algorithm track</h1>
    <p class="mt-2 max-w-2xl text-slate-600">
      One concept per day, deep — each with problems you solve in the browser and a quiz that
      teaches. Go at your own pace; the sequence is a suggestion, not a deadline.
    </p>
  </div>

  <ol class="space-y-3">
    {
      days.map((day, i) => (
        <li>
          <a
            href={`/dsa/lessons/${day.id}`}
            class={`group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow ${
              i % 2 === 1 ? 'hover:border-amber-300' : 'hover:border-emerald-300'
            }`}
          >
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 group-hover:bg-emerald-600 group-hover:text-white">
              {String(day.data.order).padStart(2, '0')}
            </span>
            <span class="min-w-0">
              <span class="flex flex-wrap items-center gap-2">
                <span class="font-semibold text-slate-800 group-hover:text-emerald-700">
                  {day.data.title}
                </span>
                <span
                  class={`rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyBadge[day.data.difficulty]}`}
                >
                  {day.data.difficulty}
                </span>
              </span>
              <span class="mt-0.5 block text-sm text-slate-500">{day.data.coreConcept}</span>
              <span class="mt-1 block text-xs text-slate-400">
                {day.data.problems.length} problem
                {day.data.problems.length === 1 ? '' : 's'} · {day.data.quiz.length} quiz questions
              </span>
            </span>
            <span class="ml-auto shrink-0 self-center text-sm font-semibold text-indigo-600">
              →
            </span>
          </a>
        </li>
      ))
    }
  </ol>
</BaseLayout>
```

- [ ] **Step 5: Create `src/pages/dsa/lessons/[slug].astro`**

Full file:

```astro
---
import { getCollection, render, type CollectionEntry } from 'astro:content';
import DsaLessonLayout from '../../../layouts/DsaLessonLayout.astro';

export async function getStaticPaths() {
  const days = (await getCollection('dsa')).sort((a, b) => a.data.order - b.data.order);
  return days.map((day) => {
    const idx = days.findIndex((d) => d.id === day.id);
    return {
      params: { slug: day.id },
      props: {
        lesson: day,
        prev: idx > 0 ? days[idx - 1] : undefined,
        next: idx < days.length - 1 ? days[idx + 1] : undefined,
      },
    };
  });
}

interface Props {
  lesson: CollectionEntry<'dsa'>;
  prev?: CollectionEntry<'dsa'>;
  next?: CollectionEntry<'dsa'>;
}

const { lesson, prev, next } = Astro.props;
const { Content } = await render(lesson);
---

<DsaLessonLayout lesson={lesson} prev={prev} next={next}>
  <Content />
</DsaLessonLayout>
```

- [ ] **Step 6: Verify the gates + spot-check empty syllabus**

Run `bun run format`, then `bun run lint`, then `bun run check`, then `bun run build`. Expected: all
green. `/dsa/` renders an empty syllabus (no content yet) and DSA lesson pages render none — the
build must not fail.

Start the dev server (`astro dev --background`, then `astro dev status`) and curl
`http://localhost:4321/dsa/` and `http://localhost:4321/odyssey/dsa/` (whichever base the dev server
uses — find out from the logs) — both return 200 with the syllabus shell. Then `astro dev stop`.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/DsaLessonLayout.astro src/pages/dsa src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add dsa routes, syllabus, and two-track home picker"
```

---

### Task 5: Reference lesson — Day 2 "Two Pointers" (proves the whole pipeline)

**Files:**

- Create: `src/content/dsa/02-two-pointers.mdx`

**Interfaces:**

- Consumes: `DsaVisualizer` + `VisualizerFrame` (Task 3); renders via `DsaLessonLayout` (Task 4).
- Produces: the reference lesson every content wave (Tasks 6-11) copies structurally.

This is the template every later lesson follows: frontmatter keys in the exact schema order (any
order works, all keys required), a `DsaVisualizer` with annotated `const frames: VisualizerFrame[]`,
the full Feynman body contract, ≥6 quiz questions each explaining WHY (right and wrong), and 1-3
problems each with ≥3 hidden test cases.

- [ ] **Step 1: Create `src/content/dsa/02-two-pointers.mdx` with the full content below**

```mdx
---
order: 2
title: 'Two Pointers, one pass'
coreConcept:
  'Two pointers can turn a nested-loop scan into a single O(n) pass — each pointer move rules out a
  whole class of candidates at once.'
docSource: 'https://www.geeksforgeeks.org/two-pointers-technique/'
docTitle: 'Two Pointers Technique — GeeksforGeeks'
difficulty: 'beginner'
objectives:
  - 'Recognize the two-pointer setup: one index from each end, closing in'
  - 'Write a two-pointer solution that runs in O(n) time and O(1) extra space'
  - 'Explain why dropping an element by moving a pointer is never a mistake'
quiz:
  - question: 'What is the signature win of the two-pointer trick?'
    options:
      - 'Running the loop twice, once with each pointer'
      - 'Each step skips an entire group of candidates, so the pass costs O(n) instead of O(n²)'
      - 'Keeping two copies of the input so you can compare them safely'
      - 'Using a hash map to remember where each pointer stopped'
    answerIndex: 1
    explanation:
      'The win is not "two loops". It is that a pointer move eliminates many candidates at once —
      the array is sorted (or symmetric), so everything past that index is also out. That is what
      collapses the complexity.'
  - question: 'In Valid Palindrome, where do the two pointers start?'
    options:
      - 'Both in the middle, moving outward'
      - 'One at the first character and one at the last, moving toward each other'
      - 'At the start of the string, searching for vowels'
      - 'One in a hash map, comparing letter counts'
    answerIndex: 1
    explanation:
      'A palindrome is symmetric: mirror characters must match. Put one pointer at index 0 and the
      other at the last index, walk them inward, and stop when they meet or cross.'
  - question: 'When a two-pointer comparison fails (mirror characters differ), what do you know?'
    options:
      - 'The reversed string is somehow still equal'
      - 'The rest of the scan is still worth doing'
      - 'The string is NOT a palindrome — the very first mismatch proves it'
      - 'You need to swap in a third pointer'
    answerIndex: 2
    explanation:
      'Every palindrome must match ALL mirror pairs. The first pair that differs proves the whole
      claim false, so you can stop immediately for O(n) worst case.'
  - question: 'Two Sum II (sorted input) — when the current sum is too big, which pointer moves?'
    options:
      - 'The left one moves right'
      - 'The right one moves left'
      - 'Both move inward together'
      - 'Neither — you have to restart'
    answerIndex: 1
    explanation:
      'Sorted ascending, so the right end holds the biggest value. If the sum overshoots the target,
      every pair using the current right value is also too big — moving right in is safe and
      necessary.'
  - question: 'Why does the two-pointer approach use O(1) extra space?'
    options:
      - 'Because it allocates one array per pointer'
      - 'Because it only stores two indices, not copies of the data'
      - 'Because it sorts the array first'
      - 'Because it builds a hash map of size n'
    answerIndex: 1
    explanation:
      'Two integers (left, right) — nothing else. You read the array in place and never allocate
      data structures, so space stays constant regardless of input size.'
  - question:
      "For Valid Palindrome, the phrase 'ignore case and non-alphanumerics' means the pointers…"
    options:
      - 'pre-process the whole string once and then scan it'
      - 'skip over characters that are not letters/digits as they move, comparing the rest lowecased'
      - 'move in hash-map order'
      - 'only scan even-length substrings'
    answerIndex: 1
    explanation:
      'Pre-processing is an option, but skipping inline keeps it one pass and O(1) space: while a
      character is not alphanumeric, move that pointer past it before comparing.'
  - question: 'The middle character of an odd-length palindrome…'
    options:
      - 'must match its own mirror, which is itself — so it is trivially fine'
      - 'must be removed before comparing'
      - 'disproves the palindrome'
      - 'forces the whole algorithm to O(n²)'
    answerIndex: 0
    explanation:
      'Once the pointers cross, every pair has matched. The leftover middle character has no
      partner, so it needs no check at all — the loop simply ends when left > right.'
  - question: 'Which real-world shape does the two-pointer idea most resemble?'
    options:
      - 'Nested loops remade as one loop'
      - 'Walking toward a friend from opposite ends of a street so you always shrink the gap'
      - 'Sorting a deck of cards by hand'
      - 'Building a hash table'
    answerIndex: 1
    explanation:
      'Every step either lowers the right end or raises the left end, so the "distance" strictly
      shrinks — exactly like two people closing a gap. That shrinking invariant is the whole trick.'
problems:
  - title: 'Valid Palindrome'
    leetcodeId: 125
    difficulty: 'easy'
    prompt: |
      Given a string s, return true if it is a palindrome, or false otherwise.
      Ignore case and skip over all non-alphanumeric characters (only letters and digits count).
      Examples: "A man, a plan, a canal: Panama" → true; "race a car" → false.
    starterCode: |
      function solution(s) {
        // two pointers from the ends; skip non-alphanumerics; compare lowercased.
        // when the pointers cross, every mirror pair matched.
        return true;
      }
    testCases:
      - input: ['A man, a plan, a canal: Panama']
        expected: true
      - input: ['race a car']
        expected: false
      - input: [' ']
        expected: true
      - input: ['Never odd or even']
        expected: true
  - title: 'Two Sum II — Input Array Is Sorted'
    leetcodeId: 167
    difficulty: 'medium'
    prompt: |
      Given a 1-indexed sorted array of integers numbers and a target, return the indices
      [leftIndex, rightIndex] of the two numbers that add up to target. Each input has exactly
      one solution and you may not use the same element twice.
      Examples: [2,7,11,15], target 9 → [1,2]; [-1,0], target -1 → [1,2].
    starterCode: |
      function solution(numbers, target) {
        // left and right at the ends; sum too big => move right in,
        // sum too small => move left up; else return the 1-indexed pair.
        return [0, 0];
      }
    testCases:
      - input: [[2, 7, 11, 15], 9]
        expected: [1, 2]
      - input: [[2, 3, 4], 6]
        expected: [1, 3]
      - input: [[-1, 0], -1]
        expected: [1, 2]
      - input: [[1, 2, 3, 4, 10], 14]
        expected: [2, 5]
---

import DsaVisualizer, { type VisualizerFrame } from '../../components/DsaVisualizer';

const frames: VisualizerFrame[] = [ { rows: [ { cells: [{ value: 'r' }, { value: 'a' }, { value: 'c'
}, { value: 'e' }, { value: 'c' }, { value: 'a' }, { value: 'r' }], pointers: [ { index: 0, label:
'left', color: '#6366f1' }, { index: 6, label: 'right', color: '#f59e0b' }, ], }, ], caption:
'Start: left at index 0, right at index 6. Both hold "r" — matched already.', }, { rows: [ { cells:
[ { value: 'r', state: 'done' }, { value: 'a' }, { value: 'c' }, { value: 'e' }, { value: 'c' }, {
value: 'a' }, { value: 'r', state: 'done' }, ], pointers: [ { index: 1, label: 'left', color:
'#6366f1' }, { index: 5, label: 'right', color: '#f59e0b' }, ], }, ], caption: 'Move both in one
step: a === a — matched.', }, { rows: [ { cells: [ { value: 'r', state: 'done' }, { value: 'a',
state: 'done' }, { value: 'c' }, { value: 'e' }, { value: 'c' }, { value: 'a', state: 'done' }, {
value: 'r', state: 'done' }, ], pointers: [ { index: 2, label: 'left', color: '#6366f1' }, { index:
4, label: 'right', color: '#f59e0b' }, ], }, ], caption: 'c === c — matched. The pointers are about
to surround the middle e.', }, { rows: [ { cells: [ { value: 'r', state: 'done' }, { value: 'a',
state: 'done' }, { value: 'c', state: 'done' }, { value: 'e', state: 'active' }, { value: 'c',
state: 'done' }, { value: 'a', state: 'done' }, { value: 'r', state: 'done' }, ], pointers: [ {
index: 3, label: 'left', color: '#6366f1' }, { index: 3, label: 'right', color: '#f59e0b' }, ], },
], caption: 'The pointers have crossed — every mirror pair matched, so it IS a palindrome. The
middle letter never needs a partner.', }, ];

<DsaVisualizer title="Two pointers, slow motion" frames={frames} client:idle />

## The one question this page answers

Nested loops feel like the obvious way to scan an array twice: for each `i`, check every `j`. That
costs **O(n²)**. The two-pointer trick asks a sharper question: _can one pass, using two indices, do
the same job?_ For a huge class of problems the answer is yes — and the cost drops to **O(n)**.

## Start with an analogy

Two friends stand at opposite ends of a long street and want to meet. There is no phone, so their
rule is simple: _at every step, at least one of you moves one house closer to the middle._ The gap
strictly shrinks every step — they never walk back out, and they meet in at most `n` moves.

The array is the street. `left` and `right` are the friends. The rule "always shrink the gap" is the
invariant that makes the whole pass linear: `n` possible moves, no more.

## The two setups, honestly

### Both ends, closing in

Sorted array (or a problem that is symmetric), so you can compare `numbers[left] + numbers[right]`
against a target. If the sum is **too big**, every pair using the current `right` is too big — move
`right` left. If **too small**, every pair using the current `left` is too small — move `left`
right.

The catch: this only works when the array is sorted (or the comparison is monotonic in the pointer
positions). Without that ordering, moving a pointer does not safely rule anything out.

### One end, moving together

Both pointers start at `0` and `right` runs ahead, keeping a window between them (a **sliding
window** — Day 3). Same DNA: each step shrinks or slides the window and skips work. If you grasp
"one pass, two indices, always shrink the gap", sliding window is a free upgrade.

## What this is NOT

| Misconception                                    | Truth                                                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| "Two pointers literally means running two loops" | It means _one_ loop maintaining two indices; the trick is the shrinking invariant, not a second pass.                          |
| "It works on any array"                          | It demands an ordering that lets a pointer move safely rule out candidates — sorted arrays, palindromes, monotone comparisons. |
| "Each step compares two random elements"         | Each step deliberately discards the whole region behind the moved pointer; that discard is what buys O(n).                     |

## Why this matters for the rest of the trip

Sliding window (Day 3) is two pointers with a moving right edge. Merge-style algorithms and many
linked-list tricks reuse the same "two walkers" mental model. And when you meet problems like
_Container With Most Water_ or _3Sum_, the reflex "can two pointers discard a region per step?" is
exactly what turns O(n²) intuition into O(n) code.

Solve the two problems above before moving on — then go further on LeetCode (sort the array first,
then the two-pointer intuition falls into place).
```

- [ ] **Step 2: Verify the gates**

Run `bun run format`, `bun run format:check`, `bun run lint`, `bun run check`, `bun run build`.
Expected: all green; the build now emits the DSA lesson + syllabus pages.

- [ ] **Step 3: Spot-check the full pipeline in the dev server**

`astro dev --background`, then `astro dev logs` to learn the URL base. Open:

1. `/dsa/` — syllabus shows exactly "Day 02 · Two Pointers, one pass" with the problem count.
2. `/dsa/lessons/02-two-pointers/` — header, the four-frame visualizer (Play/Pause/step), then the
   two problem cards.
3. In the first CodeRunner, deliberately type `return false;` in the Valid Palindrome editor and
   press **Run** → at least one test shows ✗. Then write the correct two-pointer solution → all
   tests ✓, counter shows `4/4 tests`.
4. Break the code (`function solution(` unbalanced) → Run → the "Could not load your code" panel
   appears.
5. The quiz renders and, after answering, shows the teaching explanation panel.

Then `astro dev stop`.

- [ ] **Step 4: Commit**

```bash
git add src/content/dsa/02-two-pointers.mdx
git commit -m "feat: two-pointers reference lesson with visualizer, judge, and quiz"
```

---

### Task 6: Content wave A — Days 1, 3, 4, 5

**Files:**

- Create: `src/content/dsa/01-arrays-and-hashing.mdx`
- Create: `src/content/dsa/03-sliding-window.mdx`
- Create: `src/content/dsa/04-stacks-and-queues.mdx`
- Create: `src/content/dsa/05-binary-search.mdx`

**Content contract (applies to every wave task below):**

- Copy the frontmatter keys and body section order from `02-two-pointers.mdx` exactly. Every lesson
  needs `order, title, coreConcept, docSource, docTitle, difficulty, objectives, quiz, problems`.
- **Quiz:** 6-10 questions; every `explanation` says why the correct answer is right and why each
  plausible wrong one is not. No generic "all of these" explanations.
- **Problems:** 1-3 per lesson; each has `title`, `leetcodeId`, `difficulty`, a `prompt` (problem
  statement, 2-5 lines), a `starterCode` skeleton with `function solution(...)` and a plan comment,
  and **≥3 hidden test cases** covering the edge cases (empty input, single element, extremes,
  duplicates).
- **Visual:** import `DsaVisualizer` + `type VisualizerFrame`; `const frames: VisualizerFrame[]` (≥3
  frames) showing the day's flow — arrays/hash-map fills, a moving window, a stack of boxes, or a
  shrinking search range. Trees/graphs (Tasks 7-9) may use a bespoke hand-drawn SVG island in the
  body instead, but must still ship an animated, pausable diagram.
- **docSource:** pick one reputable reference per lesson (Wikipedia, GeeksforGeeks, official docs,
  LeetCode editorial). `docTitle` = short display label.
- **Feynman body:** "The one question this page answers" → "Start with an analogy" → precise
  sections → "What this is NOT" misconception table → "Why this matters" linking forward.
- Order/filename: `order` is a number 1..28; zero-pad the filename to match (e.g. `01-`, `05-`). The
  syllabus sorts by `order`.

The per-day plan for this task:

| File                        | order | Concept          | difficulty   | Problems                                                                                                |
| --------------------------- | ----- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `01-arrays-and-hashing.mdx` | 1     | Arrays & Hashing | beginner     | Two Sum (1, easy), Contains Duplicate (217, easy)                                                       |
| `03-sliding-window.mdx`     | 3     | Sliding Window   | intermediate | Best Time to Buy and Sell Stock (121, easy), Longest Substring Without Repeating Characters (3, medium) |
| `04-stacks-and-queues.mdx`  | 4     | Stacks & Queues  | beginner     | Valid Parentheses (20, easy), Min Stack (155, medium)                                                   |
| `05-binary-search.mdx`      | 5     | Binary Search    | intermediate | Binary Search (704, easy), Search in Rotated Sorted Array (33, medium)                                  |

- [ ] **Step 1:** Author `01-arrays-and-hashing.mdx` per the contract, then `bun run check` → 0
      errors.
- [ ] **Step 2:** Author `03-sliding-window.mdx`, `04-stacks-and-queues.mdx`,
      `05-binary-search.mdx`, running `bun run check` after each.
- [ ] **Step 3:** Run `bun run format`, `bun run format:check`, `bun run lint`, `bun run build`. All
      green.
- [ ] **Step 4:** Spot-check `/dsa/` (Days 01, 02, 03, 04, 05 listed in order) and one lesson
      end-to-end (run one problem, break one, answer a quiz question). Then `astro dev stop`.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/01-arrays-and-hashing.mdx src/content/dsa/03-sliding-window.mdx src/content/dsa/04-stacks-and-queues.mdx src/content/dsa/05-binary-search.mdx
git commit -m "feat: dsa lessons days 1, 3-5 (arrays/hashing, sliding window, stacks, binary search)"
```

---

### Task 7: Content wave B — Days 6-10

**Files:**

- Create: `src/content/dsa/06-linked-lists.mdx`
- Create: `src/content/dsa/07-recursion.mdx`
- Create: `src/content/dsa/08-binary-trees.mdx`
- Create: `src/content/dsa/09-tree-traversals.mdx`
- Create: `src/content/dsa/10-heaps.mdx`

Follow the Content contract from Task 6. For linked lists/binary trees, `testCases` can model nodes
as the value shown to `solution` (e.g. `[3,2,0,-4]` for a cycle problem with a `pos` argument, or
nested arrays for trees) — keep `input`/`expected` JSON-serializable and the prompt explicit about
the input shape, since the sandbox has no LeetCode tree/linked-list helpers. Prefer problems whose
LeetCode signature accepts plain arrays/values (e.g. Reverse Linked List described over an
array-to-list conversion is discouraged — pick array-representable problems), or write the
starterCode to build the structure itself.

| File                     | order | Concept                 | difficulty   | Problems                                                                                |
| ------------------------ | ----- | ----------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `06-linked-lists.mdx`    | 6     | Linked Lists            | intermediate | Reverse Linked List (206, easy), Linked List Cycle (141, easy)                          |
| `07-recursion.mdx`       | 7     | Recursion               | beginner     | Climbing Stairs (70, easy) + a from-scratch recursion drill (e.g. `factorial`)          |
| `08-binary-trees.mdx`    | 8     | Binary Trees            | intermediate | Invert Binary Tree (226, easy), Maximum Depth of Binary Tree (104, easy)                |
| `09-tree-traversals.mdx` | 9     | Tree Traversals         | intermediate | Same Tree (100, easy), Binary Tree Level Order Traversal (102, medium)                  |
| `10-heaps.mdx`           | 10    | Heaps / Priority Queues | intermediate | Kth Largest Element in an Array (215, medium), K Closest Points to Origin (973, medium) |

- [ ] **Step 1:** Author `06-linked-lists.mdx` and `07-recursion.mdx`, `bun run check` after each.
- [ ] **Step 2:** Author `08-binary-trees.mdx`, `09-tree-traversals.mdx`, `10-heaps.mdx`,
      `bun run check` after each.
- [ ] **Step 3:** Run all gates (`format`, `format:check`, `lint`, `check`, `build`) → green.
- [ ] **Step 4:** Spot-check `/dsa/` order and at least one tree/heap lesson end-to-end; verify the
      linked-list/tree problem prompts + starterCode resolve to correct `expected` shapes by
      actually running a passing solution. Then `astro dev stop`.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/06-linked-lists.mdx src/content/dsa/07-recursion.mdx src/content/dsa/08-binary-trees.mdx src/content/dsa/09-tree-traversals.mdx src/content/dsa/10-heaps.mdx
git commit -m "feat: dsa lessons days 6-10 (linked lists, recursion, trees, heaps)"
```

---

### Task 8: Content wave C — Days 11-15

**Files:**

- Create: `src/content/dsa/11-greedy.mdx` · `12-dp-1d.mdx` · `13-dp-2d.mdx` · `14-backtracking.mdx`
  · `15-graphs-representation.mdx`

Follow the Content contract from Task 6. DP lessons should make the analogy + recurrence (the state,
the transition, the base case) the center of the page — the visualizer should animate filling the DP
table. Backtracking should animate the branch-and-prune (choose → try → un-choose) with cell states
for 'trying', 'pruned', 'accepted'. Graph representation should show adjacency list vs. matrix (can
reuse the array visualizer with 0/1 cells).

| File                           | order | Concept                 | difficulty   | Problems                                                             |
| ------------------------------ | ----- | ----------------------- | ------------ | -------------------------------------------------------------------- |
| `11-greedy.mdx`                | 11    | Greedy algorithms       | intermediate | Jump Game (55, medium), Can Place Flowers (605, easy)                |
| `12-dp-1d.mdx`                 | 12    | DP I — 1D               | intermediate | House Robber (198, medium), Coin Change (322, medium)                |
| `13-dp-2d.mdx`                 | 13    | DP II — 2D / states     | advanced     | Unique Paths (62, medium), Longest Common Subsequence (1143, medium) |
| `14-backtracking.mdx`          | 14    | Backtracking            | intermediate | Subsets (78, medium), Permutations (46, medium)                      |
| `15-graphs-representation.mdx` | 15    | Graphs — representation | intermediate | Number of Islands (200, medium), Flood Fill (733, easy)              |

- [ ] **Step 1:** Author `11-greedy.mdx` + `12-dp-1d.mdx`, `bun run check` after each.
- [ ] **Step 2:** Author `13-dp-2d.mdx` + `14-backtracking.mdx` + `15-graphs-representation.mdx`,
      `bun run check` after each.
- [ ] **Step 3:** Run all gates → green.
- [ ] **Step 4:** Spot-check `/dsa/` order and one DP or backtracking lesson end-to-end (animate,
      solve, quiz). Then `astro dev stop`.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/11-greedy.mdx src/content/dsa/12-dp-1d.mdx src/content/dsa/13-dp-2d.mdx src/content/dsa/14-backtracking.mdx src/content/dsa/15-graphs-representation.mdx
git commit -m "feat: dsa lessons days 11-15 (greedy, dp, backtracking, graphs)"
```

---

### Task 9: Content wave D — Days 16-20

**Files:**

- Create: `src/content/dsa/16-graphs-search.mdx` · `17-union-find.mdx` · `18-tries.mdx` ·
  `19-intervals.mdx` · `20-bit-manipulation.mdx`

Follow the Content contract from Task 6. Union-Find and Tries lend themselves to the array
visualizer (parent array fill, trie as nested boxes); intervals animate merging sorted ranges (cells
= intervals, `done` = merged).

| File                      | order | Concept                 | difficulty   | Problems                                                               |
| ------------------------- | ----- | ----------------------- | ------------ | ---------------------------------------------------------------------- |
| `16-graphs-search.mdx`    | 16    | Graphs — BFS/DFS search | advanced     | Course Schedule (207, medium), Clone Graph (133, medium)               |
| `17-union-find.mdx`       | 17    | Union-Find              | intermediate | Number of Provinces (547, medium)                                      |
| `18-tries.mdx`            | 18    | Tries                   | intermediate | Implement Trie (Prefix Tree) (208, medium), Word Search II (212, hard) |
| `19-intervals.mdx`        | 19    | Intervals               | intermediate | Merge Intervals (56, medium), Meeting Rooms (252, easy)                |
| `20-bit-manipulation.mdx` | 20    | Bit Manipulation        | beginner     | Missing Number (268, easy), Single Number (136, easy)                  |

- [ ] **Step 1:** Author `16-graphs-search.mdx` + `17-union-find.mdx`, `bun run check` after each.
- [ ] **Step 2:** Author `18-tries.mdx` + `19-intervals.mdx` + `20-bit-manipulation.mdx`,
      `bun run check` after each.
- [ ] **Step 3:** Run all gates → green.
- [ ] **Step 4:** Spot-check `/dsa/` order and one lesson (tries/union-find preferred) end-to-end.
      Then `astro dev stop`.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/16-graphs-search.mdx src/content/dsa/17-union-find.mdx src/content/dsa/18-tries.mdx src/content/dsa/19-intervals.mdx src/content/dsa/20-bit-manipulation.mdx
git commit -m "feat: dsa lessons days 16-20 (graph search, union-find, tries, intervals, bits)"
```

---

### Task 10: Content wave E — Days 21-25

**Files:**

- Create: `src/content/dsa/21-monotonic-stack.mdx` · `22-matrix-patterns.mdx` · `23-sorting.mdx` ·
  `24-binary-search-on-answer.mdx` · `25-design-lru.mdx`

Follow the Content contract from Task 6. Monotonic stack animates pushing/popping a stack with an
invariant; matrix patterns use the array visualizer with named pointers for rows/columns; LRU Cache
is best served by a bespoke animated SVG (list + hash map) — a bespoke animated SVG island is
allowed when the generic visualizer cannot express the flow.

| File                             | order | Concept                 | difficulty   | Problems                                                                              |
| -------------------------------- | ----- | ----------------------- | ------------ | ------------------------------------------------------------------------------------- |
| `21-monotonic-stack.mdx`         | 21    | Monotonic Stack         | advanced     | Daily Temperatures (739, medium), Largest Rectangle in Histogram (84, hard)           |
| `22-matrix-patterns.mdx`         | 22    | Matrix / grid patterns  | intermediate | Rotate Image (48, medium), Spiral Matrix (54, medium)                                 |
| `23-sorting.mdx`                 | 23    | Sorting + invariants    | intermediate | Sort Colors (75, medium), Kth Largest Element in an Array via partition (215, medium) |
| `24-binary-search-on-answer.mdx` | 24    | Binary search on answer | advanced     | Koko Eating Bananas (875, medium)                                                     |
| `25-design-lru.mdx`              | 25    | Design (LRU Cache)      | medium       | LRU Cache (146, medium)                                                               |

- [ ] **Step 1:** Author `21-monotonic-stack.mdx` + `22-matrix-patterns.mdx`, `bun run check` after
      each.
- [ ] **Step 2:** Author `23-sorting.mdx` + `24-binary-search-on-answer.mdx` + `25-design-lru.mdx`,
      `bun run check` after each.
- [ ] **Step 3:** Run all gates → green.
- [ ] **Step 4:** Spot-check `/dsa/` order and one advanced lesson end-to-end. Then
      `astro dev stop`.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/21-monotonic-stack.mdx src/content/dsa/22-matrix-patterns.mdx src/content/dsa/23-sorting.mdx src/content/dsa/24-binary-search-on-answer.mdx src/content/dsa/25-design-lru.mdx
git commit -m "feat: dsa lessons days 21-25 (monotonic stack, matrices, sorting, lru)"
```

---

### Task 11: Content wave F — review days 26-28 + final syllabus check

**Files:**

- Create: `src/content/dsa/26-review-i.mdx` · `27-review-ii.mdx` · `28-final-sprint.mdx`

A review day breaks the "one new concept" rule on purpose: each re-uses earlier concepts with
**harder** problems and a **longer quiz (8-10 questions)** that mixes concepts. Everything else
(body contract, visualizer, judge) still applies. One of the review days should include at least one
problem from a day beyond Lesson 1-3 so the reviewer sees spaced revisits of "Two Pointers" and
"Sliding Window" content.

| File                  | order | Concept                                                 | difficulty   | Problems                                                                                                        |
| --------------------- | ----- | ------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| `26-review-i.mdx`     | 26    | Review I — sliding window + two pointers under pressure | intermediate | 3Sum (15, medium), Minimum Window Substring (76, hard)                                                          |
| `27-review-ii.mdx`    | 27    | Review II — trees + DP recall                           | intermediate | Lowest Common Ancestor (236, medium), Word Break (139, medium)                                                  |
| `28-final-sprint.mdx` | 28    | Final sprint — full-sequence review                     | advanced     | A pick from each big family: Top K Frequent Elements (347, medium), Copy List with Random Pointer (138, medium) |

- [ ] **Step 1:** Author `26-review-i.mdx` + `27-review-ii.mdx`, `bun run check` after each.
- [ ] **Step 2:** Author `28-final-sprint.mdx`, `bun run check`.
- [ ] **Step 3:** Run all gates (`format`, `format:check`, `lint`, `check`, `build`) → green. Build
      must emit all 28 day pages + the DSA syllabus.
- [ ] **Step 4:** Full spot-check:
  - `/` shows both track cards with `28 days so far`.
  - `/dsa/` lists Days 01-28 in order with difficulty badges, problem counts, quiz counts.
  - Walk Day 01 → Day 28 via the prev/next footer; Day 01 has no Previous, Day 28 no Next.
  - Run a correct + a broken solution in a handful of lessons across tables, graphs, DP.
- [ ] **Step 5: Commit**

```bash
git add src/content/dsa/26-review-i.mdx src/content/dsa/27-review-ii.mdx src/content/dsa/28-final-sprint.mdx
git commit -m "feat: dsa review days 26-28, completing the 28-day track"
```

---
