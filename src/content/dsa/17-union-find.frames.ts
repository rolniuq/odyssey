import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        pointers: [{ index: 0, label: 'parent', color: '#6366f1' }],
      },
    ],
    caption:
      'Seven nodes, and a single row of parent pointers. Initially every node is its own parent, so every node is also its own root — seven separate components of one node each. find(3) walks from 3 straight to root 3.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'active' },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        pointers: [{ index: 1, label: 'parent', color: '#6366f1' }],
      },
      { cells: [{ value: '0—1', state: 'done' }] },
    ],
    caption:
      'union(0, 1) finds the two roots — find(0) = 0 and find(1) = 1 — and points one at the other: parent[1] = 0. Nodes 0 and 1 now share a root and form one component.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'active' },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        pointers: [{ index: 2, label: 'parent', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{0,1}', state: 'done' },
          { value: '∪', state: 'done' },
          { value: '2', state: 'done' },
        ],
      },
    ],
    caption:
      'union(1, 2): find(1) is NOT 1 — it walks 1 → 0 and finds root 0. So this union actually joins component {0, 1} with node 2. Find(honest) then sets parent[2] = 0, merging all three under root 0.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3 },
          { value: 3, state: 'active' },
          { value: 5 },
          { value: 6 },
        ],
        pointers: [{ index: 4, label: 'parent', color: '#6366f1' }],
      },
      { cells: [{ value: '3—4', state: 'done' }] },
    ],
    caption:
      'union(3, 4) over on the right: both are isolated roots, so the merge is direct — parent[4] = 3. Node 3 is now the root of a second, unrelated component {3, 4}.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3 },
          { value: 3, state: 'done' },
          { value: 3, state: 'active' },
          { value: 6 },
        ],
        pointers: [{ index: 5, label: 'parent', color: '#6366f1' }],
      },
      { cells: [{ value: '3—5', state: 'done' }] },
    ],
    caption:
      'union(4, 5): find(4) = 3 (walking 4 → 3), and find(5) = 5, so the roots are 3 and 5. parent[5] = 3 adds node 5 to the {3, 4} component. Two components so far: {0, 1, 2} and {3, 4, 5}.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 0, state: 'active' },
          { value: 3 },
          { value: 3, state: 'done' },
          { value: 6 },
        ],
        pointers: [{ index: 3, label: 'parent', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{0,1,2}', state: 'done' },
          { value: '∪', state: 'done' },
          { value: '{3,4,5}', state: 'done' },
        ],
      },
    ],
    caption:
      'union(0, 5) connects the two big components. find(0) = 0, find(5) = 3 — different roots, so parent[3] = 0 unifies everyone right of the equation under root 0. One town now: {0, 1, 2, 3, 4, 5}.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3 },
          { value: 0, state: 'active' },
          { value: 6 },
        ],
        pointers: [{ index: 5, label: 'compress', color: '#f59e0b' }],
      },
      {
        cells: [
          { value: 5 },
          { value: '→' },
          { value: 3 },
          { value: '→' },
          { value: 0, state: 'done' },
        ],
      },
    ],
    caption:
      'find(5) again: 5 → 3 → root 0. Path compression notices the walk and repoints parent[5] straight at 0 — the same flattening applied to every node on the path. The chain of two hops collapses to one, so the next find is instant.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [
          { value: 0 },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3, state: 'done' },
          { value: 0, state: 'done' },
          { value: 6, state: 'done' },
        ],
        pointers: [{ index: 6, label: 'alone', color: '#f59e0b' }],
      },
      {
        cells: [
          { value: '{0,1,2,3,4,5}', state: 'done' },
          { value: '  ' },
          { value: '{6}', state: 'done' },
        ],
      },
    ],
    caption:
      'Final parent array: every node from 0..5 answers to root 0; node 6 never joined an edge, so it remains its own root. find(1) === find(5) — same component. find(6) waits alone. Connectivity, answered by counting roots: two components.',
  },
];
