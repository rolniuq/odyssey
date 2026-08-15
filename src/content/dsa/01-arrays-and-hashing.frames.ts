import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 2 }, { value: 7 }, { value: 11 }, { value: 15 }],
        pointers: [{ index: 0, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'Target 9. The top row is the input; the bottom row is the hash map, still empty. The map only ever remembers the past — everything to the left of i.',
  },
  {
    rows: [
      {
        cells: [{ value: 2, state: 'active' }, { value: 7 }, { value: 11 }, { value: 15 }],
        pointers: [{ index: 0, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [{ value: '2→0', state: 'done' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'i=0, value 2. Its complement is 9−2=7 — not on the board yet. So we store 2→0: the value 2 gets a peg remembering index 0. One cell fills.',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'active' },
          { value: 11 },
          { value: 15 },
        ],
        pointers: [{ index: 1, label: 'i', color: '#6366f1' }],
      },
      {
        cells: [{ value: '2→0', state: 'active' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'i=1, value 7. Complement is 9−7=2 — and the board already holds 2→0. One poke finds the pair: answer [0, 1].',
  },
  {
    rows: [
      {
        cells: [
          { value: 2, state: 'done' },
          { value: 7, state: 'done' },
          { value: 11 },
          { value: 15 },
        ],
      },
      {
        cells: [{ value: '2→0', state: 'done' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'Two elements, two pokes — done. The remaining 11 and 15 were never re-scanned, because every earlier value already answered the "have I seen this?" question the moment it was stored. That is the O(n) payoff over the nested loop.',
  },
];
