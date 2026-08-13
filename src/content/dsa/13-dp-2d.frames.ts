import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
        pointers: [{ index: 0, label: 'row 0', color: '#6366f1' }],
      },
      { cells: [{ value: 1 }, { value: '' }, { value: '' }] },
      { cells: [{ value: 1 }, { value: '' }, { value: '' }] },
    ],
    caption:
      'dp[i][j] = the number of distinct paths from the top-left corner to cell (i, j). The top row is base case number one: from the start, moving only right, there is exactly 1 route to every cell in row 0.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [{ value: 1, state: 'done' }, { value: '' }, { value: '' }],
        pointers: [{ index: 0, label: 'col 0', color: '#6366f1' }],
      },
      {
        cells: [{ value: 1, state: 'done' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'Base case number two: the left column. Moving only down, there is exactly 1 route to every cell in column 0. Row 0 and column 0 now anchor the whole grid.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [{ value: 1, state: 'done' }, { value: 2, state: 'active' }, { value: '' }],
        pointers: [{ index: 1, label: 'fill', color: '#f59e0b' }],
      },
      { cells: [{ value: 1 }, { value: '' }, { value: '' }] },
    ],
    caption:
      'Interior cell (1, 1): the last step arrives either from above or from the left, so dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2 routes. Every cell sums its two incoming neighbors.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'active' },
        ],
        pointers: [{ index: 2, label: 'fill', color: '#f59e0b' }],
      },
      { cells: [{ value: 1 }, { value: '' }, { value: '' }] },
    ],
    caption:
      'dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3. Row 0 above is already full, and this row fills left to right — dependencies always point up and left, never forward.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [{ value: 1, state: 'done' }, { value: 3, state: 'active' }, { value: '' }],
        pointers: [{ index: 1, label: 'fill', color: '#f59e0b' }],
      },
    ],
    caption:
      'Down into row 2: dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3. The left column is the anchor again; each new row leans on the row above it.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'active' },
        ],
        pointers: [{ index: 2, label: 'fill', color: '#f59e0b' }],
      },
    ],
    caption:
      'The final cell: dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6. A robot in a 3×3 grid has exactly 6 distinct routes to the bottom-right corner. The recurrence filled a table, not a brain.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
        ],
      },
    ],
    caption:
      'Completed: every cell is a small addition of its two neighbors. The same rule scaled to a 3×7 grid yields 28 routes — and, scaled to m×n, the recurrence never changes.',
  },
];
