import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 'f5' }],
        pointers: [{ index: 0, label: 'call', color: '#6366f1' }],
      },
    ],
    caption:
      'fib(5) is asked. It is not a base case, so the recursive case splits: fib(5) = fib(4) + fib(3).',
  },
  {
    rows: [
      {
        cells: [{ value: 'f5', state: 'done' }],
      },
      {
        cells: [
          { value: 'f4', state: 'active' },
          { value: 'f3', state: 'active' },
        ],
      },
    ],
    caption:
      'Two child calls are pushed. Each returns a number, but only after their own children finish — the stack is now two frames deep and growing.',
  },
  {
    rows: [
      {
        cells: [{ value: 'f5', state: 'done' }],
      },
      {
        cells: [
          { value: 'f4', state: 'done' },
          { value: 'f3', state: 'active' },
        ],
      },
      {
        cells: [
          { value: 'f3', state: 'active' },
          { value: 'f2', state: 'active' },
          { value: 'f2', state: 'active' },
          { value: 'f1', state: 'active' },
        ],
      },
    ],
    caption:
      'fib(4) splits into fib(3) + fib(2) while fib(3) splits into fib(2) + fib(1). Already the pattern is visible: the same arguments keep reappearing.',
  },
  {
    rows: [
      {
        cells: [{ value: 'f5', state: 'done' }],
      },
      {
        cells: [
          { value: 'f4', state: 'done' },
          { value: 'f3', state: 'done' },
        ],
      },
      {
        cells: [
          { value: 'f3', state: 'done' },
          { value: 'f2', state: 'done' },
          { value: 'f2', state: 'done' },
          { value: 'f1', state: 'done' },
        ],
      },
    ],
    caption:
      'Run to the bottom and fib(3) is computed twice and fib(2) three times — identical work, recomputed. This duplicated tree is the O(2^n) blowup.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0 },
          { value: 1 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 5 },
          { value: 8 },
        ],
        pointers: [{ index: 0, label: 'n=0', color: '#94a3b8' }],
      },
    ],
    caption:
      'Memoization to the rescue: record n -> value the first time it is computed. fib(3) = 2 is stored once and every later request is a lookup. Each distinct n computed exactly once: O(n).',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'done' },
          { value: 3, state: 'done' },
          { value: 5, state: 'active' },
        ],
        pointers: [{ index: 5, label: 'fib(5)', color: '#10b981' }],
      },
    ],
    caption:
      'The filled memo collapses the tree into a single left-to-right pass. fib(5) = 5, built from stored subanswers — the same principle powering Climbing Stairs.',
  },
];
