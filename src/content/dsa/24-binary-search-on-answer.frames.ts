import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#10b981' },
          { index: 10, label: 'hi', color: '#f59e0b' },
          { index: 5, label: 'mid', color: '#6366f1' },
        ],
      },
    ],
    caption:
      'Binary search on the answer, not the array. Koko eats piles [3, 6, 7, 11] and has h = 8 hours. The unknown speed k runs from 1 to 11 (the biggest pile). Feasible(k) means sum(ceil(pile / k)) ≤ 8 — monotone: faster never hurts.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6, state: 'active' },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#10b981' },
          { index: 5, label: 'hi', color: '#f59e0b' },
          { index: 5, label: 'mid', color: '#6366f1' },
        ],
      },
    ],
    caption:
      'mid = 6. Hours: 1 + 1 + 2 + 2 = 6 ≤ 8 → feasible. If 6 works, every faster speed works too, so nothing above 6 can be the minimal answer. hi drops to 6.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3, state: 'active' },
          { value: 4 },
          { value: 5 },
          { value: 6, state: 'done' },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 0, label: 'lo', color: '#10b981' },
          { index: 5, label: 'hi', color: '#f59e0b' },
          { index: 2, label: 'mid', color: '#6366f1' },
        ],
      },
    ],
    caption:
      'mid = 3. Hours: 1 + 2 + 3 + 4 = 10 > 8 → too slow, infeasible. Any slower speed is also infeasible, so the answer must be above 3. lo rises to 4.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5, state: 'active' },
          { value: 6, state: 'done' },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 3, label: 'lo', color: '#10b981' },
          { index: 5, label: 'hi', color: '#f59e0b' },
          { index: 4, label: 'mid', color: '#6366f1' },
        ],
      },
    ],
    caption:
      'mid = 5. Hours: 1 + 2 + 2 + 3 = 8 ≤ 8 → feasible. hi drops to 5. The candidate range is now just speeds 4 and 5.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4, state: 'active' },
          { value: 5, state: 'done' },
          { value: 6, state: 'done' },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 3, label: 'lo', color: '#10b981' },
          { index: 4, label: 'hi', color: '#f59e0b' },
          { index: 3, label: 'mid', color: '#6366f1' },
        ],
      },
    ],
    caption:
      'mid = 4. Hours: 1 + 2 + 2 + 3 = 8 ≤ 8 → feasible. hi drops to 4. Speed 5, already confirmed feasible, is now ruled out as not minimal.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 6, state: 'done' },
          { value: 7 },
          { value: 8 },
          { value: 9 },
          { value: 10 },
          { value: 11 },
        ],
        pointers: [
          { index: 3, label: 'lo', color: '#10b981' },
          { index: 3, label: 'hi', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'lo and hi meet at 4 — the smallest speed that finishes in 8 hours. The answer is 4. Each check halved the range, so the whole search cost O(log(max pile)) feasibility tests, each O(n) to compute.',
  },
];
