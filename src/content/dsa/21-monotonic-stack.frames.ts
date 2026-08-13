import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 73 },
          { value: 74 },
          { value: 75 },
          { value: 71 },
          { value: 69 },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 0, label: 'day', color: '#6366f1' }],
      },
    ],
    caption:
      'Daily Temperatures: for each day, how many days until a warmer one? The stack trick keeps days waiting in order, from hottest on the bottom to coldest on the top. Day 0 is 73°, the stack is empty, and nothing has been answered yet.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'active' },
          { value: 74 },
          { value: 75 },
          { value: 71 },
          { value: 69 },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 0, label: 'day', color: '#6366f1' }],
      },
      { cells: [{ value: 73, state: 'active' }] },
    ],
    caption:
      'Push day 0 (73°). The stack holds days that are still waiting for a warmer day. Nothing pops, because no warmer day has arrived yet — the stack only stores the day index, but we read its temperature to compare.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'active' },
          { value: 75 },
          { value: 71 },
          { value: 69 },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 1, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 1 is 74° — warmer than the 73° on top of the stack. Pop day 0 and record answer[0] = 1 − 0 = 1: just one day until warmer weather. Then push day 1. The stack always reads decreasing, 73° then 74° never both at once.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'active' },
          { value: 71 },
          { value: 69 },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 2, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 74, state: 'done' },
          { value: 75, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 2 is 75° — warmer than the 74° on top. Pop day 1, answer[1] = 2 − 1 = 1, and push day 2. Warm days answer the colder days below them the moment they appear.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'active' },
          { value: 69 },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 3, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 75, state: 'done' },
          { value: 71, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 3 is 71° — cooler than the 75° on top, so nothing pops. Push day 3. The stack stays strictly decreasing from bottom to top: 75°, 71°. Cool days simply wait their turn.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'active' },
          { value: 72 },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 4, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 4 is 69° — cooler again, so push. Stack: 75°, 71°, 69°. Three days are now waiting. Each one is pushed exactly once, which is the guarantee that makes the whole walk linear.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'done' },
          { value: 72, state: 'active' },
          { value: 76 },
          { value: 73 },
        ],
        pointers: [{ index: 5, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'done' },
          { value: 72, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 5 is 72° — warmer than the 69° and 71° on top. Pop 69°, answer[4] = 5 − 4 = 1, then pop 71°, answer[3] = 5 − 3 = 2. Both waited until day 5. 72° is not warmer than 75°, so 75° stays and 72° is pushed on top.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'done' },
          { value: 72, state: 'done' },
          { value: 76, state: 'active' },
          { value: 73 },
        ],
        pointers: [{ index: 6, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 75, state: 'done' },
          { value: 72, state: 'done' },
          { value: 76, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 6 is 76° — warmer than the 72° on top (answer[5] = 6 − 5 = 1) and the 75° beneath it (answer[2] = 6 − 2 = 4). Day 2 waited four days for 76°. Then push day 6. One new day answered three stale ones.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'done' },
          { value: 72, state: 'done' },
          { value: 76, state: 'done' },
          { value: 73, state: 'active' },
        ],
        pointers: [{ index: 7, label: 'day', color: '#6366f1' }],
      },
      {
        cells: [
          { value: 76, state: 'done' },
          { value: 73, state: 'active' },
        ],
      },
    ],
    caption:
      'Day 7 is 73° — cooler than the 76° on top, so nothing pops; push it. The array is exhausted. Days 6 and 7 are still on the stack, which means no warmer day ever followed them.',
  },
  {
    rows: [
      {
        cells: [
          { value: 73, state: 'done' },
          { value: 74, state: 'done' },
          { value: 75, state: 'done' },
          { value: 71, state: 'done' },
          { value: 69, state: 'done' },
          { value: 72, state: 'done' },
          { value: 76, state: 'done' },
          { value: 73, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 76, state: 'done' },
          { value: 73, state: 'done' },
        ],
      },
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 4, state: 'done' },
          { value: 2, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 0, state: 'done' },
          { value: 0, state: 'done' },
        ],
      },
    ],
    caption:
      'Whatever is still on the stack waits forever, so answer[6] = 0 and answer[7] = 0. Final: [1, 1, 4, 2, 1, 1, 0, 0]. Every day was pushed once and popped once — O(n) time, no nested loop.',
  },
];
