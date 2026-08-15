import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
        pointers: [{ index: 0, label: 'curr', color: '#6366f1' }],
      },
    ],
    caption:
      'The list 1 -> 2 -> 3 -> 4 -> 5 lives as scattered nodes. curr = head (1), prev = null. Step 1: save next = 2, or the rest of the list becomes unreachable.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ],
        pointers: [
          { index: 0, label: 'prev', color: '#6366f1' },
          { index: 1, label: 'curr', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'curr.next -> prev: node 1 now points to null — it is the new tail. The trio slides: prev = 1, curr = 2. The arrow toward 3 was saved before flipping, so the walk continues.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ],
        pointers: [
          { index: 1, label: 'prev', color: '#6366f1' },
          { index: 2, label: 'curr', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'curr.next -> prev: node 2 points back at 1. Running stitch: 2 -> 1 -> null. Slide again: prev = 2, curr = 3.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 4 },
          { value: 5 },
        ],
        pointers: [
          { index: 2, label: 'prev', color: '#6366f1' },
          { index: 3, label: 'curr', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Node 4 points back at 3; the prefix 3 -> 2 -> 1 is frozen. Only three local variables move — O(1) extra space whatever the size.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5 },
        ],
        pointers: [
          { index: 3, label: 'prev', color: '#6366f1' },
          { index: 4, label: 'curr', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Last step: node 5.next -> 4. prev = 5, curr = null — the walker ran off the end, which is exactly how we know we are done.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
        ],
        pointers: [{ index: 4, label: 'new head', color: '#10b981' }],
      },
    ],
    caption:
      'The final list reads 5 -> 4 -> 3 -> 2 -> 1. One pass, three pointers, no extra arrays: O(n) time, O(1) space, and no node value was ever moved.',
  },
];
