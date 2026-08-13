import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      { cells: [{ value: 1 }, { value: 2 }, { value: 3 }] },
      { cells: [{ value: 4 }, { value: 5 }, { value: 6 }] },
      { cells: [{ value: 7 }, { value: 8 }, { value: 9 }] },
    ],
    caption:
      'Spiral Matrix: read the grid clockwise from the outside in. Four boundaries fence the remaining box: top = 0, bottom = 2, left = 0, right = 2. Each pass peels one edge and tightens a boundary.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'active' },
          { value: 2, state: 'active' },
          { value: 3, state: 'active' },
        ],
        pointers: [{ index: 0, label: '→', color: '#f59e0b' }],
      },
      { cells: [{ value: 4 }, { value: 5 }, { value: 6 }] },
      { cells: [{ value: 7 }, { value: 8 }, { value: 9 }] },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
    ],
    caption:
      'Peel the top edge left → right: 1, 2, 3. The top boundary advances to row 1, and the remaining box shrinks. Result so far: [1, 2, 3].',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [{ value: 4 }, { value: 5 }, { value: 6, state: 'active' }],
        pointers: [{ index: 2, label: '↓', color: '#f59e0b' }],
      },
      { cells: [{ value: 7 }, { value: 8 }, { value: 9, state: 'active' }] },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
          { value: 9, state: 'done' },
        ],
      },
    ],
    caption:
      'Peel the right edge top → bottom: 6, 9. The right boundary retreats to column 1. Result: [1, 2, 3, 6, 9].',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      { cells: [{ value: 4 }, { value: 5 }, { value: 6, state: 'done' }] },
      {
        cells: [
          { value: 7, state: 'active' },
          { value: 8, state: 'active' },
          { value: 9, state: 'done' },
        ],
        pointers: [{ index: 1, label: '←', color: '#f59e0b' }],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
          { value: 9, state: 'done' },
          { value: 8, state: 'done' },
          { value: 7, state: 'done' },
        ],
      },
    ],
    caption:
      'Peel the bottom edge right → left: 8, 7. The bottom boundary rises to row 1. Result: [1, 2, 3, 6, 9, 8, 7]. The 5 in the middle is now the last cell standing.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [{ value: 4, state: 'active' }, { value: 5 }, { value: 6, state: 'done' }],
        pointers: [{ index: 0, label: '↑', color: '#f59e0b' }],
      },
      {
        cells: [
          { value: 7, state: 'done' },
          { value: 8, state: 'done' },
          { value: 9, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
          { value: 9, state: 'done' },
          { value: 8, state: 'done' },
          { value: 7, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
        ],
      },
    ],
    caption:
      'Peel the left edge bottom → top: 4, 5. The left boundary slides past the right one, the box is empty, and the spiral is complete: [1, 2, 3, 6, 9, 8, 7, 4, 5].',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 6, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 7, state: 'done' },
          { value: 8, state: 'done' },
          { value: 9, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
          { value: 9, state: 'done' },
          { value: 8, state: 'done' },
          { value: 7, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
        ],
      },
    ],
    caption:
      'Every cell was visited exactly once as the four boundaries tightened. Spiral order for the 3×3: [1, 2, 3, 6, 9, 8, 7, 4, 5]. Peeling the boundary edges is O(m × n) with O(1) extra memory.',
  },
];
