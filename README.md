# OdysseyDB

Learn PostgreSQL **deeply, one concept per page** — based on the Feynman technique and the
[official PostgreSQL documentation](https://www.postgresql.org/docs/).

> If you can't explain it simply, you don't understand it well enough. — (attributed to) Richard
> Feynman

Every lesson page is one idea, taught slowly and completely: a plain-language explainer, an animated
diagram of how it actually works, and a quiz that makes you prove you can say it in your own words.

## Why

Most tutorials try to cover everything fast. This project deliberately does the opposite — **one
logic per page**, going through the official docs in order. Learn deep, not fast. Work is done day
by day, with discipline, not speed.

## How a lesson works

Each lesson lives at `src/content/lessons/*.mdx` and teaches exactly **one concept**. A page has:

1. **The one idea** — a single sentence stating the concept being taught.
2. **Objectives** — what you can explain _in your own words_ afterwards.
3. **A Feynman explainer** — analogy → precise definition → "what it is NOT".
4. **An animated diagram** — an interactive SVG/React island showing the flow.
5. **A quiz** — MCQs with instant _why right / why wrong_ explanations.

Adding a lesson is just adding one `.mdx` file with the right frontmatter — see
[`RULES.md`](./RULES.md) and [`AGENTS.md`](./AGENTS.md).

## Tech stack

- [Astro](https://astro.build) (static output) + [React](https://react.dev) islands
- [Tailwind CSS](https://tailwindcss.com) v4
- [Bun](https://bun.sh) as the package manager & runtime scripts
- MDX content collections (`src/content/lessons/`)
- TypeScript everywhere (source, configs), Prettier + ESLint for consistency

## Commands

From the project root (uses [bun](https://bun.sh)):

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `bun install`          | Install dependencies                               |
| `bun run dev`          | Start the dev server (or `astro dev --background`) |
| `bun run build`        | Build the static site to `./dist/`                 |
| `bun run preview`      | Preview the production build                       |
| `bun run check`        | Type-check with `astro check`                      |
| `bun run lint`         | ESLint across the project                          |
| `bun run lint:fix`     | Autofix ESLint issues                              |
| `bun run format`       | Format all files with Prettier                     |
| `bun run format:check` | Verify Prettier formatting                         |

App runs at `http://localhost:4321`.

## Project structure

```text
src/
├── content/
│   ├── content.config.ts   # Lesson schema (frontmatter contract)
│   └── lessons/            # One .mdx file per lesson, ordered by `order`
├── components/             # React islands (Quiz, animated diagrams)
├── layouts/                # BaseLayout, LessonLayout
└── pages/                  # / , /lessons, /lessons/[slug]
public/
      # static assets (favicon, icons, images)
```

## Roadmap (day-by-day)

Latest-first; each item is one lesson. Start from the bottom.

- [ ] **Client/server architecture** — accept connection → spawn backend → shared memory
- [ ] Connecting & `psql`, `CREATE TABLE`
- [ ] `SELECT` → `WHERE` → `ORDER BY`
- [ ] `JOIN`s, and eventually indexes, `EXPLAIN`, transactions/MVCC, vacuum, JSON…

## License

Learning content is derived from the official PostgreSQL docs. This project is **not affiliated**
with the PostgreSQL project.
