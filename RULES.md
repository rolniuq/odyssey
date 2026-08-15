# OdysseyDB — Coding Contract

This is the authoritative set of rules for anyone (human or agent) writing code or content in this
repository. Follow it. If a rule here conflicts with an instruction, this file wins.

> Mission: **teach PostgreSQL deeply, one concept per page**, through the Feynman technique, sourced
> from the official PostgreSQL documentation.

---

## 1. Product rules (non-negotiable)

1. **One logic per page.** A lesson teaches exactly one concept. If a source doc covers two
   concepts, split it into two lessons. Never cram.
2. **Learn deep, not fast.** No streaks, no XP, no speed UI. There is no time pressure; discipline
   is daily consistency.
3. **Visuals for every flow.** Every lesson ships at least one animated diagram (a React/SVG island)
   that demonstrates the flow, with Play/Pause + step-through controls.
4. **Official docs are the source.** Each lesson's `docSource` links to the official PostgreSQL page
   it derives from. One doc = one lesson.
5. **Lessons prove understanding.** A quiz where every answer, right or wrong, explains WHY.

## 2. Project layout

| Path                    | Contains                                       |
| ----------------------- | ---------------------------------------------- |
| `src/content/lessons/`  | One `.mdx` per lesson (content collection)     |
| `src/content.config.ts` | Lesson frontmatter schema (the contract)       |
| `src/components/`       | React islands only (Quiz, animated diagrams)   |
| `src/layouts/`          | Astro layouts (non-interactive shell)          |
| `src/pages/`            | Routes; `lessons/[slug].astro` renders lessons |
| `public/`               | Static assets                                  |

## 3. Adding a lesson

1. **Copy the template first** — `src/content/lessons/01-how-a-query-runs.mdx`. Keep the frontmatter
   keys exactly as the schema requires: `order`, `title`, `coreConcept`, `docSource`, `docTitle`,
   `difficulty`, `objectives`, and `quiz`.
2. **One concept** → give it a single memorable `coreConcept` sentence.
3. **An animated diagram** → import an existing island from `src/components/`, or build a new one
   following `QueryExecutor.tsx` as the reference (state machine + Play/Pause + step). Run islands
   with a `client:` directive.
4. **A teaching quiz** → each `explanation` says why the correct answer is right and why each
   plausible wrong one isn't.
5. **Ordering** → `order` is a number that drives the index and prev/next nav. Name the file with a
   zero-padded prefix matching it (e.g. `02-...`).

## 4. Tech & style (from `.editorconfig`, `.prettier*`, `eslint.config.mts`)

- **TypeScript only.** No `.js`/`.mjs` in `src/`. Config files are `.mts`. Indexes prefer
  `className`, never `class`, in `.tsx`.
- **Package manager:** Bun. `bun install`, `bun run <script>`. Commit `bun.lock`, not
  `package-lock.json`.
- **Formatting:** Prettier with `prettier-plugin-astro` + `prettier-plugin-tailwindcss`. Run
  `bun run format` before finishing (verify with `bun run format:check`).
- **Linting:** ESLint flat config. Resolve all errors before finishing (`bun run lint`).
- **Artistic rule of thumb:** 80–100 char lines, 2-space indent, trailing commas (ES5).

## 5. Verifying before you claim "done"

Run **all** of these and require green output:

| Command                | Expect                                       |
| ---------------------- | -------------------------------------------- |
| `bun run format`       | no changes                                   |
| `bun run format:check` | "All matched files use Prettier code style!" |
| `bun run lint`         | no error output                              |
| `bun run check`        | 0 errors                                     |
| `bun run build`        | 3+ pages built, no errors                    |

Then spot-check `http://localhost:4321/lessons/[slug]` over `astro dev --background`.

## 6. Git / commits

- Never commit `node_modules/`, `dist/`, `.astro/`, or `.env*` (see `.gitignore`).
- **Follow `COMMIT_CONVENTION.md`** (Conventional Commits). The `.githooks/commit-msg` hook enforces
  it locally (`git config core.hooksPath .githooks`).
- Write one descriptive commit per logical change.
- Do not force-push or rewrite published history.

## 7. "What this is NOT" — contract impositions

- **Not** a full PostgreSQL course clone; we derive from the official docs and teach the section,
  not the whole manual (one page per concept).
- **Not** a speed-runner UI — no timers, no streaks, no leaderboards.
- **Not** an abandoned in-progress with inconsistent naming — every concept, file, city, variable is
  named deliberately, once, and reused.

---

**Bottom line:** one concept, taught deeply, visualized, sourced from the official docs, proven by a
teaching quiz — and verified with the four gates above before it ships.
