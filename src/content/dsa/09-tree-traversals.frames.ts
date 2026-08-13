import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 3, state: 'active' }],
        pointers: [{ index: 0, label: 'queue', color: '#6366f1' }],
      },
      {
        cells: [{ value: 9 }, { value: 20 }],
      },
      {
        cells: [{ value: 15 }, { value: 7 }],
      },
    ],
    caption:
      'Level order starts with the root 3 alone in the queue. Snapshot its length — 1 — that one pop will be the entire first level.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [
          { value: 9, state: 'active' },
          { value: 20, state: 'active' },
        ],
        pointers: [{ index: 0, label: 'front', color: '#6366f1' }],
      },
      {
        cells: [{ value: 15 }, { value: 7 }],
      },
    ],
    caption:
      'Pop 3, record it to level [3], then push its children: the queue is now [9, 20] — the whole next level, nothing deeper mixed in.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [
          { value: 9, state: 'done' },
          { value: 20, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 15, state: 'active' },
          { value: 7, state: 'active' },
        ],
        pointers: [{ index: 0, label: 'front', color: '#f59e0b' }],
      },
    ],
    caption:
      'Snapshot reveals queue = [9, 20]: those are the second level. Pop 9 (no children) and 20 (enqueues 15, 7) — the queue now holds only the third level.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'done' }],
      },
      {
        cells: [
          { value: 9, state: 'done' },
          { value: 20, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 15, state: 'done' },
          { value: 7, state: 'done' },
        ],
      },
    ],
    caption:
      'Pop 15 and 7 — they reveal no children, the queue empties, and the walk is over. Output [[3], [9, 20], [15, 7]]: each inner array is exactly one drained level.',
  },
];
