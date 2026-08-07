# OdysseyDB — Commit Convention

Every commit in this repo follows **Conventional Commits**. The `.githooks/commit-msg`
hook enforces it locally (wired with `git config core.hooksPath .githooks`).

## Format

```text
<type>(<scope>): <subject>
```

- **type** — the kind of change (required)
- **scope** — the area touched (optional, but encouraged)
- **subject** — a short, imperative summary (≤ 72 chars, lowercase, no trailing period)

## Allowed types

| type | use it for |
| --- | --- |
| `feat` | a new lesson, page, island, or feature |
| `fix` | a bug or broken lesson |
| `docs` | README, docs, comments only |
| `style` | formatting (Prettier), no behavior change |
| `refactor` | restructuring without changing behavior |
| `perf` | a performance improvement (Vite/build) |
| `test` | tests or test tooling |
| `build` | build system, tooling config (Vite, Bun, CI) |
| `ci` | GitHub Actions workflows |
| `chore` | housekeeping: deps, config, locks |
| `revert` | reverts a previous commit |

## Examples from this repo

```text
feat: Scaffold OdysseyDB — learn PostgreSQL the Feynman way
feat(lessons): add MVCC lesson
fix(quiz): explain wrong answers for question 3
docs: clarify lesson authoring flow in AGENTS.md
build: tune Vite with lightningcss minification
ci: deploy site to GitHub Pages on push
style: run prettier across src
```

## Rules of thumb

- One logical change per commit. Don't bundle an unrelated formatting run with a feature.
- Imperative subject, as if completing the sentence: *"this commit will …"*.
- Use the scope to say *what* is touched: `lessons`, `quiz`, `islands`, `tooling`, `site`.
- Breaking changes: append `!` after type/scope, e.g. `feat(config)!: switch schema`.

## Merge commits, reverts, and autosquash

`Merge …`, `Revert …`, `fixup!` and `squash!` messages bypass the hook so normal git
workflows keep working.

## Why

Clean history = a readable changelog and easier `git log` archaeology as lessons grow.
The daily worker's auto-commits already follow this shape (`feat(lessons): add next daily
concept`).