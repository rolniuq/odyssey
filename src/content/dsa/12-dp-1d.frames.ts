import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 0, label: 'house i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 2, state: 'active' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
      },
    ],
    caption:
      'dp[i] = best loot among houses 0..i under the no-adjacent rule. Base case at house 0: dp[0] = 2 — with one house, rob it. The row below is the table about to be filled left to right.',
  },
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 1, label: 'house i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'active' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
      },
    ],
    caption:
      'House 1: either skip it and keep the best of house 0 (2), or rob it (7). dp[1] = max(2, 7) = 7. The choice is made from two already-answered subquestions.',
  },
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 2, label: 'house i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'done' },
          { value: 11, state: 'active' },
          { value: '' },
          { value: '' },
        ],
      },
    ],
    caption:
      'House 2: skip it — best stays dp[1] = 7; or rob it plus the best two houses back: dp[0] + 9 = 11. dp[2] = max(7, 11) = 11. Each cell is a tiny max of two earlier answers.',
  },
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 3, label: 'house i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'done' },
          { value: 11, state: 'done' },
          { value: 11, state: 'active' },
          { value: '' },
        ],
      },
    ],
    caption:
      'House 3: skip it (11) or rob it plus dp[1] (7 + 3 = 10). dp[3] = max(11, 10) = 11. Notice house 2 was never considered — it is forbidden next door, exactly the recurrence doing its job.',
  },
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
        pointers: [{ index: 4, label: 'house i', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'done' },
          { value: 11, state: 'done' },
          { value: 11, state: 'done' },
          { value: 12, state: 'active' },
        ],
      },
    ],
    caption:
      'House 4: skip it (11) or rob it plus dp[2] (11 + 1 = 12). dp[4] = 12. The whole table came from repeating one rule; each cell reads its two predecessors in constant time.',
  },
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 9 }, { value: 3 }, { value: 1 }],
      },
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'done' },
          { value: 11, state: 'done' },
          { value: 11, state: 'done' },
          { value: 12, state: 'done' },
        ],
        pointers: [{ index: 4, label: 'answer', color: '#10b981' }],
      },
    ],
    caption:
      'Full table: [2, 7, 11, 11, 12]. The answer is the rightmost cell, 12 — rob houses 0 and 2 and 4 (2 + 9 + 1). One pass, two reads per cell: O(n) time and O(n) space.',
  },
];
