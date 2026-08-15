import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: -1 },
          { value: 0 },
          { value: 3 },
          { value: 5 },
          { value: 9 },
          { value: 12 },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#6366f1' },
          { index: 2, label: 'mid', color: '#ec4899' },
          { index: 5, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Target 9. The live range is [0, 5]. We only read the middle — index 2, value 3. One comparison decides which half dies.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3, state: 'done' },
          { value: 5 },
          { value: 9 },
          { value: 12 },
        ],
        pointers: [
          { index: 3, label: 'lo', color: '#6366f1' },
          { index: 4, label: 'mid', color: '#ec4899' },
          { index: 5, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      '3 < 9, so the target must be to the right — everything ≤ index 2 is provably too small and dies (greyed). New range [3, 5], new midpoint index 4, value 9.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3, state: 'done' },
          { value: 5 },
          { value: 9, state: 'active' },
          { value: 12 },
        ],
        pointers: [
          { index: 3, label: 'lo', color: '#6366f1' },
          { index: 4, label: 'mid', color: '#ec4899' },
          { index: 5, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      '9 === 9 — found at index 4 after just two comparisons. The values at indices 3 and 5 were never even examined.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3, state: 'done' },
          { value: 5 },
          { value: 9, state: 'done' },
          { value: 12 },
        ],
      },
    ],
    caption:
      'The greyed half [-1, 0, 3] died in one step; [5, 12] was never touched. Each comparison halves the live range — that is the O(log n) guarantee.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1 },
          { value: 0 },
          { value: 3 },
          { value: 5 },
          { value: 9 },
          { value: 12 },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#6366f1' },
          { index: 2, label: 'mid', color: '#ec4899' },
          { index: 5, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Same array, new target 2. Nothing has been examined yet: range [0, 5], midpoint index 2, value 3.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1 },
          { value: 0 },
          { value: 3, state: 'done' },
          { value: 5, state: 'done' },
          { value: 9, state: 'done' },
          { value: 12, state: 'done' },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#6366f1' },
          { index: 0, label: 'mid', color: '#ec4899' },
          { index: 1, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      '3 > 2, so the target must be left of index 2 — the whole right side (including mid) dies at once. New range [0, 1], midpoint index 0, value -1.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1, state: 'done' },
          { value: 0, state: 'active' },
          { value: 3, state: 'done' },
          { value: 5, state: 'done' },
          { value: 9, state: 'done' },
          { value: 12, state: 'done' },
        ],
        pointers: [
          { index: 1, label: 'lo', color: '#6366f1' },
          { index: 1, label: 'mid', color: '#ec4899' },
          { index: 1, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      '-1 < 2, so everything at or left of index 0 dies. Range collapses to [1, 1], midpoint index 1, value 0.',
  },
  {
    rows: [
      {
        cells: [
          { value: -1, state: 'done' },
          { value: 0, state: 'done' },
          { value: 3, state: 'done' },
          { value: 5, state: 'done' },
          { value: 9, state: 'done' },
          { value: 12, state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'lo', color: '#6366f1' },
          { index: 1, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      '0 < 2, so index 1 dies too. Now lo = 2 sits past hi = 1 — the live range is empty, which proves 2 is absent. Return -1. Three comparisons, not six.',
  },
];
