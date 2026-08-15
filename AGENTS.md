## Development

This project uses **Bun**. Install deps and run scripts with `bun` (`bun install`,
`bun run <script>`).

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Quality gates (run before you finish any change)

- `bun run format` — Prettier (configs are `.mts`)
- `bun run lint` — ESLint (flat config in `eslint.config.mts`)
- `bun run check` — `astro check` type-checking (0 errors)
- `bun run build` — production build + content schema validation

See [`RULES.md`](./RULES.md) for the full coding contract.

## Commits

Follow **Conventional Commits** (enforced by the `.githooks/commit-msg` hook):
`<type>(<scope>): <subject>`. Types:
`feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert`. Full rules +
examples in [`COMMIT_CONVENTION.md`](./COMMIT_CONVENTION.md).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## About this project

**OdysseyDB** teaches PostgreSQL the Feynman way: one concept per page, deep, sourced from the
official docs. Agents working here **add and edit lessons and islands**; they should read
[`RULES.md`](./RULES.md) first — it is the authoritative coding contract.

## The product rules (always true)

1. **One logic per page.** A lesson teaches exactly one concept. If a source doc covers two
   concepts, split it into two lessons. Never cram.
2. **Learn deep, not fast.** No streaks, no XP, no speed UI. Discipline = daily consistency.
3. **Visuals for every flow.** Every lesson ships at least one animated diagram (SVG/React island)
   that demonstrates the flow, with Play/Pause + step-through.
4. **Official docs are the source.** Each lesson's `docSource` links to the official PostgreSQL page
   it derives from. One doc = one lesson.
5. **Lessons prove understanding.** A Feynman explainer (analogy → precision → "what it is NOT")
   plus a quiz where every answer, right or wrong, explains WHY.

## How to add a lesson (the normal flow)

1. **Copy the template** — every lesson must match the structure of
   `src/content/lessons/01-how-a-query-runs.mdx`. Keep the frontmatter keys exactly as
   `src/content.config.ts` requires: `order`, `title`, `coreConcept`, `docSource`, `docTitle`,
   `difficulty`, `objectives`, and `quiz`.
2. **One concept.** Give it a single memorable `coreConcept`.
3. **An animated diagram.** Import one of the existing React islands (or build a new one in
   `src/components/`) and place it where the flow is explained. Each island is a React component;
   run them with a `client:` directive.
4. **Quiz with teaching explanations.** The `explanation` explains WHY the correct answer is right —
   and, for wrong picks, why not.
5. **Verify before you finish:**
   - `bun run check` passes with 0 errors.
   - `bun run lint` and `bun run format:check` pass.
   - `bun run build` produces no errors (this runs content schema validation).
   - A quick `astro dev --background` spot-check of `/lessons/[slug]`.

## `order` and navigation

- `order` is a number; the lessons index and prev/next navigation sort by it.
- Name files with a zero-padded prefix matching the order (e.g. `02-...`, `03-...`) for readability,
  but the **`order` field is what actually drives sorting**.

## Structural conventions

- `src/content/lessons/` — one `.mdx` per lesson.
- `src/components/` — React islands only (interactive quiz/diagrams). Preface no other React in
  there.
- `src/layouts/` — Astro layout components (non-island).
- `src/pages/` — routes. `[slug].astro` is the lesson body template.
- `src/components/QueryExecutor.tsx` is the reference for how islands are built (positions,
  `useState` step machine, Play/Pause + tap-to-select).

## Content style

- Plain language first; precise terms after the analogy. Target a smart newcomer.
- Keep pages short enough to read in ~10 minutes.
- The final section of every lesson body should be "What this is NOT" — common misreadings — and
  "Why this matters" linking to later lessons.
