import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 0 }, { value: 2 }, { value: 1 }, { value: 1 }, { value: 0 }],
        pointers: [
          { index: 0, label: 'low', color: '#10b981' },
          { index: 0, label: 'mid', color: '#6366f1' },
          { index: 5, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Sort Colors with the Dutch national flag: three pointers divide the array. Invariant — everything before low is a 0, everything after high is a 2, and the unknown middle runs from mid to high. Start: low = 0, mid = 0, high = 5.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'active' },
          { value: 0 },
          { value: 2 },
          { value: 1 },
          { value: 1 },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 0, label: 'low', color: '#10b981' },
          { index: 0, label: 'mid', color: '#6366f1' },
          { index: 4, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 2 at index 0 — swap it with index 5 (high) and pull high left to 4. A 2 now sits in the 2-zone, locked in as done. The swapped-in value (0) must still be examined, so mid does not move.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'active' },
          { value: 2 },
          { value: 1 },
          { value: 1 },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 1, label: 'low', color: '#10b981' },
          { index: 1, label: 'mid', color: '#6366f1' },
          { index: 4, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 0 at index 0 — swap with low (the same spot) and advance both low and mid to 1. The leading 0 is locked into the 0-zone. Invariant holds: [0] | [0, 2, 1, 1] | [2].',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 2, state: 'active' },
          { value: 1 },
          { value: 1 },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'low', color: '#10b981' },
          { index: 2, label: 'mid', color: '#6366f1' },
          { index: 4, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 0 at index 1 — swap with low (again the same spot) and advance both to 2. Two zeros are locked. Invariant: [0, 0] | [2, 1, 1] | [2].',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 1, state: 'active' },
          { value: 1 },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'low', color: '#10b981' },
          { index: 2, label: 'mid', color: '#6366f1' },
          { index: 3, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 2 at index 2 — swap with index 4 (high) and pull high to 3. The 1s slide left into the middle, and a second 2 locks into the 2-zone. The unknown middle shrank again.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 1, state: 'active' },
          { value: 1 },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'low', color: '#10b981' },
          { index: 3, label: 'mid', color: '#6366f1' },
          { index: 3, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 1 at index 2 — a 1 is already home in the middle, so just advance mid to 3. No swap needed. The invariant never breaks: [0, 0] | [1, 1] | [2, 2].',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'active' },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'low', color: '#10b981' },
          { index: 4, label: 'mid', color: '#6366f1' },
          { index: 3, label: 'high', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'mid sees 1 at index 3 — advance again to 4. Now mid (4) has passed high (3): the unknown region is empty. Every element is a 0, a 1, or a 2 that is already locked in.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
        ],
      },
    ],
    caption:
      'Final: [0, 0, 1, 1, 2, 2]. Each element was examined once and swapped at most once — O(n) time and O(1) extra memory, no comparison sort needed. That is the whole Dutch national flag trick.',
  },
];
