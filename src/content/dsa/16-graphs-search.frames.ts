import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'active' },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
        pointers: [{ index: 0, label: 'start', color: '#6366f1' }],
      },
      { cells: [{ value: 0, state: 'active' }] },
    ],
    caption:
      'BFS begins at a single node. Mark 0 as visited and drop it into a queue — the frontier of nodes that are "seen and waiting to be explored". Everything else is untouched gray.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'active' },
          { value: 2, state: 'active' },
          { value: 3 },
          { value: 4 },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [{ value: 1, state: 'active' }, { value: 2 }],
        pointers: [{ index: 0, label: 'next out', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 0 off the front. Each unvisited neighbor, 1 and 2, gets its visited mark NOW (so nobody queues it twice) and is pushed onto the back of the queue. Frontier: [1, 2].',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'active' },
          { value: 3, state: 'active' },
          { value: 4, state: 'active' },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [{ value: 2, state: 'active' }, { value: 3 }, { value: 4 }],
        pointers: [{ index: 0, label: 'next out', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 1. Neighbors 3 and 4 join the back of the queue; the mark-on-discovery rule is exactly why 0, already done, is never re-added. BFS explores in layers — the frontier holds the current wave.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'active' },
          { value: 4, state: 'active' },
          { value: 5, state: 'active' },
          { value: 6, state: 'active' },
        ],
      },
      {
        cells: [{ value: 3, state: 'active' }, { value: 4 }, { value: 5 }, { value: 6 }],
        pointers: [{ index: 0, label: 'next out', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 2 and discover 5, 6. The whole queue is now one layer: every node at distance 2 from the start. Because the queue drains oldest-first, this entire wave finishes before anything at distance 3 is looked at.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'active' },
          { value: 6, state: 'active' },
        ],
      },
      {
        cells: [{ value: 5, state: 'active' }, { value: 6 }],
        pointers: [{ index: 0, label: 'next out', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 3 and 4: neither has an unvisited neighbor, so each is simply finished without adding anything. Leaf layers add nothing — the frontier shrinks as the spread exhausts itself.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5, state: 'done' },
          { value: 6, state: 'done' },
        ],
      },
      { cells: [{ value: '∅', state: 'done' }] },
    ],
    caption:
      'Pop 5 and 6 — the last of the wave — and the queue empties. BFS order: 0, 1, 2, 3, 4, 5, 6. Nodes came out in non-decreasing distance from 0, the property that later hands BFS its shortest-path promises.',
  },
];
