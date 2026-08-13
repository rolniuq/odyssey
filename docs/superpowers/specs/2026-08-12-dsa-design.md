# Odyssey DSA — Learn Data Structures & Algorithms the Feynman way

**Date:** 2026-08-12 **Status:** Design approved (brainstorming) — pending implementation plan

## 1. Goal

Add a DSA learning track to the existing Odyssey app. It teaches one algorithm/DS concept per page,
in a daily sequence, with in-browser LeetCode-style problem solving and quiz questions that teach.
It mirrors the OdysseyDB (PostgreSQL) section in spirit and machinery but lives as a separate
section under the same Astro app.

## 2. Scope & product decisions

Agreed during brainstorming:

1. **New section in this repo** — a `/dsa/` route and a separate `dsa` content collection, alongside
   the existing PostgreSQL `lessons` collection. The PostgreSQL section is untouched.
2. **Daily plan, zero gamification, no tracking** — content is presented as "Day 1 … Day 28".
   Navigation is free (`prev`/`next` by `order`); there are no streaks, XP, badges, timers,
   completion markers, or persisted state of any kind. "Everyday" is a structure of the content, not
   a mechanism.
3. **Original lessons, web-sourced** — every lesson is an original Feynman rewrite. `docSource`
   links to a reputable reference (Wikipedia, GeeksforGeeks, official docs, textbook pages) but the
   text is our own. No scraping or wholesale copying.
4. **In-browser solving, JavaScript** — each lesson ships 1-3 LeetCode-style problems solved inline.
   The site stays 100% static (GitHub Pages deploy keeps working).
5. **More quiz** — 6-10 multiple-choice questions per lesson, same teaching-explanation format as
   OdysseyDB (every answer, right or wrong, explains WHY).
6. **Animated visuals** — every lesson ships at least one animated diagram (Play/Pause +
   step-through), reusing a generic data-driven visualizer plus a small number of bespoke diagrams.

## 3. Content model — the `dsa` collection

New collection in `src/content/dsa/`, one `.mdx` file per day, declared in `src/content.config.ts`
alongside `lessons`.

Frontmatter schema:

```
order          number                         // 1..28 = Day number, drives index + prev/next
title          string                         // e.g. "Two Pointers, one pass"
coreConcept    string                         // one-sentence concept
docSource      url                            // reputable reference URL
docTitle       string                         // display title of the reference
difficulty     "beginner" | "intermediate" | "advanced"
objectives     string[]                       // "after this page you can …"
quiz           [{ question, options: string[], answerIndex, explanation }]  // 6-10 items
problems       [{
                 title,                       // "Valid Palindrome"
                 leetcodeId,                  // 125 → builds the external LeetCode link
                 difficulty,                  // "easy" | "medium" | "hard"
                 prompt,                      // problem statement (markdown)
                 starterCode,                 // JS function stub
                 testCases                    // [{ input, expected }] — hidden from prompt
               }]                             // 1-3 per lesson
```

Body = Feynman lesson: analogy → precision → worked flow → "What this is NOT" → "Why this matters".

## 4. The in-browser judge — `CodeRunner` island

One React island per problem, rendered inline in the lesson page. User writes **JavaScript** for a
`function solution(...)` stub.

- **Editor:** plain monospace `<textarea>` (not Monaco — keeps bundle lean), Run / Reset buttons,
  "Open on LeetCode" external link.
- **Execution:** code runs in a **Web Worker created from a Blob** so a frozen loop cannot hang the
  page UI. The worker:
  1. Receives `{ code, testCases }`.
  2. `new Function(code)` defines `solution`, then runs each test case in a try/catch.
  3. Returns per-case `{ pass, got, expected, error }` plus total runtime.
- **Result panel:** per-test check/cross with expected-vs-got, plus a verdict; syntax, runtime, and
  wrong-output errors surface on separate lines.
- **Accepted v1 limits:** JS only (no in-browser TS transpile); no true interrupt for infinite loops
  (a busy loop burns CPU inside the worker but does not freeze the UI — test cases stay small); no
  `fetch`/`DOM` access inside the sandbox.

## 5. Routing & UI

- `/dsa/` — syllabus index: Day 1-28, each showing title, `coreConcept`, difficulty badge, problem
  count.
- `/dsa/lessons/[slug]` — lesson page: Day badge → Feynman body → one `CodeRunner` per problem →
  quiz island. Prev/next nav by `order` (same as OdysseyDB lessons).
- Home (`/`) — two-card choice: **Learn PostgreSQL** / **Learn DSA**.
- **Layout:** reuse `BaseLayout`; add a small `DsaLessonLayout` (day header + "back to syllabus").
  OdysseyDB's `LessonLayout` stays untouched.

## 6. Animated visuals

Reusable `DsaVisualizer` island driven by per-lesson step data (arrays, pointers, boxes animated
frame-by-frame; Play/Pause + step-through), plus a small number of bespoke diagrams (tree/graph
layouts) where the generic animator cannot express the flow. `QueryExecutor.tsx` remains the
reference for island structure.

## 7. The 28-day curriculum

```
Day   Concept                    Sample problems
01    Arrays & Hashing           Two Sum · Contains Duplicate
02    Two Pointers               Valid Palindrome · Two Sum II
03    Sliding Window             Best Time to Buy/Sell Stock · Longest Substring
04    Stacks & Queues            Valid Parentheses · Min Stack
05    Binary Search              Binary Search · Rotated Sorted Array
06    Linked Lists               Reverse Linked List · Linked List Cycle
07    Recursion                  Climbing Stairs · recursion drill
08    Binary Trees               Invert Tree · Max Depth
09    Tree Traversals            Same Tree · Level Order
10    Heaps / PQ                 Kth Largest · K Closest Points
11    Greedy                     Jump Game · Can Place Flowers
12    DP I — 1D                  House Robber · Coin Change
13    DP II — 2D / states        Unique Paths · Longest Common Subsequence
14    Backtracking               Subsets · Permutations
15    Graphs — representation    Number of Islands · Flood Fill
16    Graphs — BFS/DFS search    Course Schedule · Clone Graph
17    Union-Find                 Number of Provinces
18    Tries                      Implement Trie · Word Search II
19    Intervals                  Merge Intervals · Meeting Rooms
20    Bit Manipulation           Missing Number · Single Number
21    Monotonic Stack            Daily Temperatures · Largest Rectangle
22    Matrix / grid patterns     Rotate Image · Spiral Matrix
23    Sort + invariants          Sort Colors · Kth Largest (partition)
24    Binary search on answer    Koko Eating Bananas
25    Design (LRU etc.)          LRU Cache
26    Hard-core review I         mixed revisits
27    Hard-core review II        mixed revisits
28    Final sprint               full-sequence review
```

Problem choices and review-day contents are finalized during content build.

## 8. Build-out order

1. Content collection + schema (`src/content.config.ts`).
2. `CodeRunner` island (Blob worker judge).
3. `DsaVisualizer` island + bespoke diagrams as needed.
4. Routes/layouts: `/dsa/` index, `/dsa/lessons/[slug]`, home two-card nav.
5. Content waves (Days 1-5, 6-10, 11-15, …), each wave gated by `bun run check`, `bun run lint`, and
   `bun run build` before the next.

## 9. Quality gates (inherited from RULES.md)

Every change passes `bun run format` / `bun run format:check` / `bun run lint` / `bun run check` (0
errors) / `bun run build` (no errors, content schema validated), plus an `astro dev --background`
spot-check of `/dsa/lessons/[slug]`.

## 10. Out of scope (v1)

- Accounts, progress sync, localStorage persistence of any kind.
- Multi-language runners (Python/C++), TS transpile in-browser, real infinite-loop interrupts,
  `fetch` access in the sandbox.
- Server-side judging / a submission API.
- Migrating or duplicating the PostgreSQL section.
