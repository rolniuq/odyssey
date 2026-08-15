import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }],
        pointers: [{ index: 0, label: 'node 0', color: '#6366f1' }],
      },
    ],
    caption:
      'A small undirected graph: four nodes and four edges — 0-1, 0-2, 1-2, 2-3. A program has to store this shape in memory somehow; there are two classic layouts, and both appear next.',
  },
  {
    rows: [
      { cells: [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 0 }] },
      { cells: [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 0 }] },
      { cells: [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }] },
      { cells: [{ value: 0 }, { value: 0 }, { value: 1 }, { value: 0 }] },
    ],
    caption:
      'The adjacency matrix: entry M[i][j] is 1 exactly when an edge joins node i to node j. Node 0 connects to 1 and 2; node 3 connects only to 2. Building it costs O(V²) memory regardless of how many edges there are.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1, state: 'active' },
          { value: 1, state: 'active' },
          { value: 0 },
        ],
        pointers: [{ index: 0, label: 'row 0', color: '#f59e0b' }],
      },
      { cells: [{ value: 1 }, { value: 0 }, { value: 1 }, { value: 0 }] },
      { cells: [{ value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }] },
      { cells: [{ value: 0 }, { value: 0 }, { value: 1 }, { value: 0 }] },
    ],
    caption:
      'Reading neighbors is a challenge you win by walking a row: the neighbors of node 0 are exactly the columns holding a 1 in row 0 — here {1, 2}. "Is 0 connected to 2?" is a single O(1) look-up in the matrix.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1, state: 'active' },
          { value: 1, state: 'active' },
          { value: 0 },
        ],
      },
      {
        cells: [
          { value: 1, state: 'active' },
          { value: 0 },
          { value: 1, state: 'active' },
          { value: 0 },
        ],
      },
      {
        cells: [
          { value: 1, state: 'active' },
          { value: 1, state: 'active' },
          { value: 0 },
          { value: 1, state: 'active' },
        ],
      },
      {
        cells: [{ value: 0 }, { value: 0 }, { value: 1, state: 'active' }, { value: 0 }],
      },
    ],
    caption:
      'The graph is undirected, so every edge appears twice: M[i][j] and M[j][i] are both 1. The matrix is symmetric about its diagonal. That duplication is exactly why the matrix doubles its memory cost for no new information.',
  },
  {
    rows: [
      { cells: [{ value: '0' }, { value: '→' }, { value: '1' }, { value: '2' }] },
      { cells: [{ value: '1' }, { value: '→' }, { value: '0' }, { value: '2' }] },
      { cells: [{ value: '2' }, { value: '→' }, { value: '0' }, { value: '1' }, { value: '3' }] },
      { cells: [{ value: '3' }, { value: '→' }, { value: '2' }] },
    ],
    caption:
      'The same graph as an adjacency list: each node keeps only its true neighbors in a small row. Memory scales with O(V + E), not O(V²); for sparse graphs that is dramatically cheaper, and iterating a node’s neighbors costs O(1) per neighbor.',
  },
];
