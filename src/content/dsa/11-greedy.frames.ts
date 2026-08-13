import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'active' },
          { value: 3 },
          { value: 1 },
          { value: 1 },
          { value: 4 },
        ],
        pointers: [
          { index: 0, label: 'i', color: '#6366f1' },
          { index: 2, label: 'reach', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Jump Game. Standing at i = 0 with a jump of 2, the frontier of reachable indexes extends to index 2. The greedy rule: never hold onto a single path, only the farthest index you could still land on.',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 3, state: 'active' },
          { value: 1 },
          { value: 1 },
          { value: 4 },
        ],
        pointers: [
          { index: 1, label: 'i', color: '#6366f1' },
          { index: 4, label: 'reach', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Step to i = 1. reach = max(2, 1 + 3) = 4 — the frontier jumps straight to the last index. Only the maximum matters; the individual hops are forgotten the moment they are made.',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 1, state: 'active' },
          { value: 1 },
          { value: 4 },
        ],
        pointers: [
          { index: 2, label: 'i', color: '#6366f1' },
          { index: 4, label: 'reach', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'i = 2: reach was already 4, and 2 + 1 lands at index 3 — still inside the frontier. No update needed; the marker simply holds its ground.',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'active' },
          { value: 4 },
        ],
        pointers: [
          { index: 3, label: 'i', color: '#6366f1' },
          { index: 4, label: 'reach', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'i = 3: still below the frontier, so the walk continues. The invariant doing the work: as long as i never passes reach, some landing path exists — reach itself is always reachable.',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 4, state: 'done' },
        ],
        pointers: [{ index: 4, label: 'i', color: '#10b981' }],
      },
    ],
    caption:
      'i reaches the last index while the frontier has covered it all along — reachable, so the answer is true. Every step made the safest local decision, and no future choice could have undone it.',
  },
];
