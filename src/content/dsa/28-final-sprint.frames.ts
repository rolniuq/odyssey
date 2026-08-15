import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }],
        pointers: [{ index: 0, label: 'scan', color: '#6366f1' }],
      },
      {
        cells: [{ value: '1:0' }, { value: '2:0' }, { value: '3:0' }],
      },
    ],
    caption:
      'Top K Frequent Elements: nums = [1,1,1,2,2,3], k = 2. The plan has two passes. Pass one is pure hash-map counting (Day 1): scan the array and tally every value in O(1) per element, O(n) total. The row below is the tally, empty so far. Pass two turns those counts into the top k.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2 },
          { value: 2 },
          { value: 3 },
        ],
        pointers: [{ index: 2, label: 'scan', color: '#6366f1' }],
      },
      {
        cells: [{ value: '1:3', state: 'active' }, { value: '2:0' }, { value: '3:0' }],
      },
    ],
    caption:
      'Three 1s have been scanned, so the tally reads 1:3. A hash map counts frequencies in O(1) per element no matter how long the array is — the cost of the whole first pass is exactly O(n), one update per element.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3 },
        ],
        pointers: [{ index: 4, label: 'scan', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '1:3', state: 'done' },
          { value: '2:2', state: 'active' },
          { value: '3:0' },
        ],
      },
    ],
    caption:
      'Both 2s are in, so the tally reads 2:2. Counting is done in a single left-to-right pass; nothing about ordering matters yet — that is the whole point of a hash map, it tallies regardless of where the values sit.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
        pointers: [{ index: 5, label: 'scan', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '1:3', state: 'done' },
          { value: '2:2', state: 'done' },
          { value: '3:1', state: 'active' },
        ],
      },
    ],
    caption:
      'The lone 3 completes the tally: 1:3, 2:2, 3:1. The first pass is over — every element touched exactly once. Frequencies are the raw material; the only remaining question is how to extract the k largest of them.',
  },
  {
    rows: [
      {
        cells: [
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
        ],
      },
      {
        cells: [
          { value: '1:3', state: 'done' },
          { value: '2:2', state: 'done' },
          { value: '3:1', state: 'done' },
        ],
        pointers: [
          { index: 0, label: 'top', color: '#10b981' },
          { index: 1, label: 'top', color: '#10b981' },
        ],
      },
    ],
    caption:
      'Pass two picks the k largest counts: 3 beats 2 beats 1, so the top 2 are 1 and 2 → [1, 2]. Sorting the pairs is O(m log m) where m is the number of distinct values — or use a bucket/heap for O(n). Either way, counting first, selecting second; never search for "most frequent" without a count.',
  },
];
