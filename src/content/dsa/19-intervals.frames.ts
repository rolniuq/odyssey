import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: '1-3' }, { value: '2-6' }, { value: '8-10' }, { value: '15-18' }],
        pointers: [{ index: 0, label: 'sweep', color: '#6366f1' }],
      },
    ],
    caption:
      'Four intervals, unsorted-looking input that still arrives in start order: 1-3, 2-6, 8-10, 15-18. The whole approach is to sort by start (already done here), then slide a single window across.',
  },
  {
    rows: [
      {
        cells: [{ value: '1-6', state: 'active' }, { value: '8-10' }, { value: '15-18' }],
        pointers: [{ index: 0, label: 'current', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '1-3', state: 'done' },
          { value: '+', state: 'done' },
          { value: '2-6', state: 'done' },
        ],
      },
    ],
    caption:
      'The window opens on 1-3. The next interval, 2-6, starts at 2 — at or before the window end 3 — so it overlaps: the window extends to max(3, 6) = 6, becoming 1-6. Two ranges folded into one.',
  },
  {
    rows: [
      {
        cells: [
          { value: '1-6', state: 'done' },
          { value: '8-10', state: 'active' },
          { value: '15-18' },
        ],
        pointers: [{ index: 1, label: 'current', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '1-6', state: 'done' },
          { value: ' -> ', state: 'done' },
          { value: '8-10', state: 'active' },
        ],
      },
    ],
    caption:
      'Next comes 8-10. It starts at 8, which is strictly past the window end 6 — no overlap, so the 1-6 window is finished and pushed into the result. A fresh window opens on 8-10.',
  },
  {
    rows: [
      {
        cells: [
          { value: '1-6', state: 'done' },
          { value: '8-10', state: 'done' },
          { value: '15-18', state: 'active' },
        ],
        pointers: [{ index: 2, label: 'current', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '8-10', state: 'done' },
          { value: ' -> ', state: 'done' },
          { value: '15-18', state: 'active' },
        ],
      },
    ],
    caption:
      '15-18 starts at 15, past the window end 10, so 8-10 closes and joins the result; the new window opens on 15-18. The sweep is one comparison per interval — no pairwise scanning of the past.',
  },
  {
    rows: [
      {
        cells: [
          { value: '1-6', state: 'done' },
          { value: '8-10', state: 'done' },
          { value: '15-18', state: 'done' },
        ],
      },
      { cells: [{ value: 'result', state: 'done' }] },
    ],
    caption:
      'The last window, 15-18, is pushed. Result: [[1-6], [8-10], [15-18]] — three intervals where four stood, each comparison local, everything after the sort linear. That is the whole merge trick.',
  },
];
