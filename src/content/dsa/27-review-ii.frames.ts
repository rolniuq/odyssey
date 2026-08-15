import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 3, state: 'active' }],
        pointers: [{ index: 0, label: 'walk', color: '#6366f1' }],
      },
      { cells: [{ value: 5 }, { value: 1 }] },
      { cells: [{ value: 6 }, { value: 2 }, { value: 0 }, { value: 8 }] },
      { cells: [{ value: 7 }, { value: 4 }] },
    ],
    caption:
      'Find the lowest common ancestor of 5 and 4. The walk starts at the root, 3. The rule: a node is the answer when one side of it holds p and the other side holds q — or when the node itself is p or q and the other value is somewhere beneath it. A node counts as its own ancestor.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [{ value: 5, state: 'active' }, { value: 1 }],
        pointers: [{ index: 0, label: 'walk', color: '#6366f1' }],
      },
      { cells: [{ value: 6 }, { value: 2 }, { value: 0 }, { value: 8 }] },
      { cells: [{ value: 7 }, { value: 4 }] },
    ],
    caption:
      'Descend into the left child, 5. The walk stops here for a reason: 5 is one of the two targets, and 4 lives inside this same subtree. A node that contains only one target can still be the LCA — the other target is beneath it, so 5 is an ancestor of both. Candidate found.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [{ value: 5, state: 'done' }, { value: 1 }],
      },
      {
        cells: [{ value: 6 }, { value: 2, state: 'active' }, { value: 0 }, { value: 8 }],
        pointers: [{ index: 1, label: 'walk', color: '#6366f1' }],
      },
      { cells: [{ value: 7 }, { value: 4 }] },
    ],
    caption:
      'Peek below 5 to place the second target: 4 hangs under 2. Both 5 and 4 are inside the 5-subtree, so the answer cannot be deeper than 5 — nothing under 5 is an ancestor of 5 itself. The recursion reports: the left half found a target, the right half found a target, so 5 is the meeting point.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [{ value: 5, state: 'done' }, { value: 1 }],
        pointers: [{ index: 0, label: 'lca', color: '#10b981' }],
      },
      { cells: [{ value: 6 }, { value: 2 }, { value: 0 }, { value: 8 }] },
      { cells: [{ value: 7 }, { value: 4 }] },
    ],
    caption:
      'Answer: 5. The deepest node that is an ancestor of both targets — a post-order walk that never chases a target outside its own subtree. Same shape works for 5 and 1 (answer 3) and for 7 and 4 (answer 2). O(n) for one walk.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'l' },
          { value: 'e' },
          { value: 'e' },
          { value: 't' },
          { value: 'c' },
          { value: 'o' },
          { value: 'd' },
          { value: 'e' },
          { value: '' },
        ],
        pointers: [{ index: 0, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 'T', state: 'done' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
      },
    ],
    caption:
      'Word Break flips to dynamic programming recall: s = "leetcode", dict = {"leet", "code"}. dp[i] says whether the prefix s[0..i) can be split into dictionary words. The base dp[0] = true — an empty prefix is always splittable. Every later cell asks: is there a cut j where dp[j] is true and s[j..i) is a word?',
  },
  {
    rows: [
      {
        cells: [
          { value: 'l' },
          { value: 'e' },
          { value: 'e' },
          { value: 't' },
          { value: 'c' },
          { value: 'o' },
          { value: 'd' },
          { value: 'e' },
          { value: '' },
        ],
        pointers: [{ index: 4, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 'T', state: 'done' },
          { value: 'F' },
          { value: 'F' },
          { value: 'F' },
          { value: 'T', state: 'active' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
      },
    ],
    caption:
      'dp[4]: try every cut j before 4. The cut j=0 works — "leet" is a dictionary word and dp[0] is true — so dp[4] = true. The prefix "leet" segments cleanly. Each cell is one tiny subquestion, and the answers below it were already settled, which is what makes the fill one sweep.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'l' },
          { value: 'e' },
          { value: 'e' },
          { value: 't' },
          { value: 'c' },
          { value: 'o' },
          { value: 'd' },
          { value: 'e' },
          { value: '' },
        ],
        pointers: [{ index: 8, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 'T', state: 'done' },
          { value: 'F' },
          { value: 'F' },
          { value: 'F' },
          { value: 'T', state: 'done' },
          { value: 'F' },
          { value: 'F' },
          { value: 'F' },
          { value: 'T', state: 'active' },
        ],
      },
    ],
    caption:
      'dp[8]: the cut j=4 works — "code" is a dictionary word and dp[4] is true — so dp[8] = true. The whole string segments as leet + code. Answer: true. This is 1D DP from Day 12: one growing quantity, each cell reads only earlier cells, and overlapping subproblems are computed exactly once.',
  },
];
