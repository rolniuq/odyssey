import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 'r' },
          { value: 'a' },
          { value: 'c' },
          { value: 'e' },
          { value: 'c' },
          { value: 'a' },
          { value: 'r' },
        ],
        pointers: [
          { index: 0, label: 'left', color: '#6366f1' },
          { index: 6, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption: 'Start: left at index 0, right at index 6. Both hold "r" — matched already.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'r', state: 'done' },
          { value: 'a' },
          { value: 'c' },
          { value: 'e' },
          { value: 'c' },
          { value: 'a' },
          { value: 'r', state: 'done' },
        ],
        pointers: [
          { index: 1, label: 'left', color: '#6366f1' },
          { index: 5, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption: 'Move both in one step: a === a — matched.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'r', state: 'done' },
          { value: 'a', state: 'done' },
          { value: 'c' },
          { value: 'e' },
          { value: 'c' },
          { value: 'a', state: 'done' },
          { value: 'r', state: 'done' },
        ],
        pointers: [
          { index: 2, label: 'left', color: '#6366f1' },
          { index: 4, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption: 'c === c — matched. The pointers are about to surround the middle e.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'r', state: 'done' },
          { value: 'a', state: 'done' },
          { value: 'c', state: 'done' },
          { value: 'e', state: 'active' },
          { value: 'c', state: 'done' },
          { value: 'a', state: 'done' },
          { value: 'r', state: 'done' },
        ],
        pointers: [
          { index: 3, label: 'left', color: '#6366f1' },
          { index: 3, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'The pointers have crossed — every mirror pair matched, so it IS a palindrome. The middle letter never needs a partner.',
  },
];
