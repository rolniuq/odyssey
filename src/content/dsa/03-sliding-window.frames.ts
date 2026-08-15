import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 7 },
          { value: 1, state: 'active' },
          { value: 5 },
          { value: 3 },
          { value: 6 },
          { value: 4 },
        ],
        pointers: [
          { index: 1, label: 'buy', color: '#6366f1' },
          { index: 1, label: 'scan', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Day 1 price 1 is below day 0’s 7, so the buy candidate jumps to day 1 — a lower buy price can never hurt a later profit. The window starts here.',
  },
  {
    rows: [
      {
        cells: [
          { value: 7 },
          { value: 1, state: 'done' },
          { value: 5, state: 'active' },
          { value: 3 },
          { value: 6 },
          { value: 4 },
        ],
        pointers: [
          { index: 1, label: 'buy', color: '#6366f1' },
          { index: 2, label: 'scan', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Day 2 price 5 → profit 5 − 1 = 4. Best so far: 4. The sell edge advances one day at a time while the buy edge stays on day 1.',
  },
  {
    rows: [
      {
        cells: [
          { value: 7 },
          { value: 1, state: 'done' },
          { value: 5, state: 'done' },
          { value: 3, state: 'active' },
          { value: 6 },
          { value: 4 },
        ],
        pointers: [
          { index: 1, label: 'buy', color: '#6366f1' },
          { index: 3, label: 'scan', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Day 3 price 3 → profit 3 − 1 = 2, no record. The window slides on anyway: every future sell still pairs with the same day-1 buy.',
  },
  {
    rows: [
      {
        cells: [
          { value: 7 },
          { value: 1, state: 'done' },
          { value: 5, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'active' },
          { value: 4 },
        ],
        pointers: [
          { index: 1, label: 'buy', color: '#6366f1' },
          { index: 4, label: 'scan', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Day 4 price 6 → profit 6 − 1 = 5, a new record. The buy pencil never leaves day 1; the sell edge keeps walking the line.',
  },
  {
    rows: [
      {
        cells: [
          { value: 7 },
          { value: 1, state: 'done' },
          { value: 5, state: 'done' },
          { value: 3, state: 'done' },
          { value: 6, state: 'done' },
          { value: 4, state: 'active' },
        ],
        pointers: [
          { index: 1, label: 'buy', color: '#6366f1' },
          { index: 5, label: 'scan', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Day 5 price 4 → profit 3, no record. Array over: best profit is 5, by buying day 1 and selling day 4. Two edges, at most one pass each — O(n).',
  },
];
