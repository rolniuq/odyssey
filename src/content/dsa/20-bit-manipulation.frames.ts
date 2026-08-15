import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'active' },
          { value: 1 },
          { value: 2 },
          { value: 1 },
          { value: 2 },
        ],
        pointers: [{ index: 0, label: 'fold', color: '#6366f1' }],
      },
      { cells: [{ value: 0, state: 'active' }] },
    ],
    caption:
      'The XOR trick keeps a running total, and it starts at 0 — the identity for XOR, so anything XOR 0 is itself. Now fold each number of the array in, one at a time. The sample is Single Number: [4, 1, 2, 1, 2], where only 4 appears once.',
  },
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 1, state: 'active' },
          { value: 2 },
          { value: 1 },
          { value: 2 },
        ],
        pointers: [{ index: 1, label: 'fold', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 4, state: 'active' },
        ],
      },
    ],
    caption:
      'Fold in the first number: 0 ^ 4 = 4. The tally is now 4. Because this 4 has no twin anywhere in the array, nothing ahead can cancel it.',
  },
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'active' },
          { value: 1 },
          { value: 2 },
        ],
        pointers: [{ index: 2, label: 'fold', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'active' },
        ],
      },
    ],
    caption:
      'Fold in 1: 4 ^ 1 = 5. The tally grows — this 1 has not cancelled yet because its twin is still sitting ahead in the array.',
  },
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 1, state: 'active' },
          { value: 2 },
        ],
        pointers: [{ index: 3, label: 'fold', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 7, state: 'active' },
        ],
      },
    ],
    caption:
      'Fold in 2: 5 ^ 2 = 7. So far every number has been unique — nothing has paired off, because each value has only appeared once.',
  },
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'active' },
        ],
        pointers: [{ index: 4, label: 'fold', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 7, state: 'done' },
          { value: 6, state: 'active' },
        ],
      },
    ],
    caption:
      'Fold in the second 1: 7 ^ 1 = 6. The two 1s have now met — and since any value XOR itself is 0, that pair cancelled cleanly out of the tally.',
  },
  {
    rows: [
      {
        cells: [
          { value: 4, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 7, state: 'done' },
          { value: 6, state: 'done' },
          { value: 4, state: 'done' },
        ],
      },
    ],
    caption:
      'Fold in the second 2: 6 ^ 2 = 4, and its twin cancels too. Every duplicate has paired off; what survives is 4 — the one number that appears exactly once. Single Number in a single pass, no extra memory.',
  },
];
