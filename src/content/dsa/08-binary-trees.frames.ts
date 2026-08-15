import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 4, state: 'active' }],
        pointers: [{ index: 0, label: 'node', color: '#6366f1' }],
      },
      {
        cells: [{ value: 2 }, { value: 7 }],
      },
      {
        cells: [{ value: 1 }, { value: 3 }, { value: 6 }, { value: 9 }],
      },
    ],
    caption:
      'The whole tree is a value plus two smaller trees. Invert starts at the root 4: swap its children — the left subtree (2) trades with the right subtree (7).',
  },
  {
    rows: [
      {
        cells: [{ value: 4, state: 'done' }],
      },
      {
        cells: [
          { value: 7, state: 'active' },
          { value: 2, state: 'active' },
        ],
        pointers: [{ index: 0, label: 'node', color: '#6366f1' }],
      },
      {
        cells: [{ value: 1 }, { value: 3 }, { value: 6 }, { value: 9 }],
      },
    ],
    caption:
      'After the root swap, 7 sits on the left and 2 on the right. Recurse into both: first invert 7, then invert 2.',
  },
  {
    rows: [
      {
        cells: [{ value: 4, state: 'done' }],
      },
      {
        cells: [
          { value: 7, state: 'done' },
          { value: 2, state: 'done' },
        ],
      },
      {
        cells: [{ value: 9, state: 'active' }, { value: 6 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 0, label: 'node', color: '#6366f1' }],
      },
    ],
    caption:
      'Both middle nodes swapped: 7 exchanges (6, 9) so 9 becomes its left child, and 2 exchanges (1, 3) so 3 becomes its left child. The bottom row now reads 9 6 3 1.',
  },
  {
    rows: [
      {
        cells: [{ value: 4, state: 'done' }],
      },
      {
        cells: [
          { value: 7, state: 'done' },
          { value: 2, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 9, state: 'done' },
          { value: 6, state: 'done' },
          { value: 3, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
    ],
    caption:
      'Leaves: 9, 6, 3 and 1 have no children, so their swap is a no-op and each returns at once — the base case null carries no work.',
  },
  {
    rows: [
      {
        cells: [{ value: 4, state: 'done' }],
        pointers: [{ index: 0, label: 'root', color: '#10b981' }],
      },
      {
        cells: [
          { value: 7, state: 'done' },
          { value: 2, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 9, state: 'done' },
          { value: 6, state: 'done' },
          { value: 3, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
    ],
    caption:
      'Reserialized level order: [4, 7, 2, 9, 6, 3, 1]. One rule — swap, then recurse into both children — at every node produced the full mirror in one pass.',
  },
];
