import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: '∅', state: 'active' }],
        pointers: [{ index: 0, label: 'prefix', color: '#6366f1' }],
      },
    ],
    caption:
      'Building every permutation of [1, 2, 3]. The recursion starts at the empty prefix. One branch will be explored fully before we come back — this is choose, try, then un-choose.',
  },
  {
    rows: [
      { cells: [{ value: '∅', state: 'done' }] },
      {
        cells: [{ value: '1', state: 'active' }, { value: '2' }, { value: '3' }],
        pointers: [{ index: 0, label: 'try', color: '#f59e0b' }],
      },
    ],
    caption:
      'First decision level: append 1, 2, or 3 — all unused, so none are pruned. We commit to 1 first; 2 and 3 wait their turn. Depth first means 1 is explored to the bottom before we return to 2.',
  },
  {
    rows: [
      { cells: [{ value: '∅', state: 'done' }] },
      { cells: [{ value: '1', state: 'done' }, { value: '2' }, { value: '3' }] },
      {
        cells: [{ value: '✗' }, { value: '12', state: 'active' }, { value: '13' }],
        pointers: [{ index: 1, label: 'try', color: '#f59e0b' }],
      },
    ],
    caption:
      'Prefix [1]. Before appending 2, the loop tries appending 1 itself — already used, so that whole branch is pruned (the ✗) and never recursed into. Then 2 and 3 are allowed; we explore [1,2] next.',
  },
  {
    rows: [
      { cells: [{ value: '∅', state: 'done' }] },
      { cells: [{ value: '1', state: 'done' }, { value: '2' }, { value: '3' }] },
      { cells: [{ value: '✗' }, { value: '12', state: 'done' }, { value: '13', state: 'done' }] },
      {
        cells: [
          { value: '123', state: 'active' },
          { value: '132', state: 'active' },
        ],
      },
    ],
    caption:
      'From [1,2] the only unused value is 3 → the leaf [1,2,3] is accepted. Its sibling [1,3] takes 2 → [1,3,2] accepted. The prefix reached length n, so the recursion stops — the base case that closes a branch.',
  },
  {
    rows: [
      { cells: [{ value: '∅', state: 'done' }] },
      {
        cells: [
          { value: '1', state: 'done' },
          { value: '2', state: 'done' },
          { value: '3', state: 'done' },
        ],
      },
      {
        cells: [
          { value: '123', state: 'done' },
          { value: '132', state: 'done' },
          { value: '213', state: 'done' },
          { value: '231', state: 'done' },
          { value: '312', state: 'done' },
          { value: '321', state: 'done' },
        ],
      },
    ],
    caption:
      'Every branch drained: six accepted leaves — exactly 3! permutations. The used-check pruned all six attempts to reuse an element (one per node), keeping the count precise. Choose, try, un-choose, with cuts before wasted recursion.',
  },
];
