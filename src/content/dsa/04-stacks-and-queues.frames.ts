import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: '{' },
          { value: '[' },
          { value: '(' },
          { value: ')' },
          { value: ']' },
          { value: '}' },
        ],
        pointers: [{ index: 0, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      'Input "{ [ ( ) ] }" reads left to right. The bottom row is the stack — empty. Newest opener always wins the next closer: that is LIFO.',
  },
  {
    rows: [
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[' },
          { value: '(' },
          { value: ')' },
          { value: ']' },
          { value: '}' },
        ],
        pointers: [{ index: 1, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{', state: 'active' },
          { value: '' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
        pointers: [{ index: 0, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption: "'{' is an opener — push it. The top of the stack is now '{'.",
  },
  {
    rows: [
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'done' },
          { value: '(' },
          { value: ')' },
          { value: ']' },
          { value: '}' },
        ],
        pointers: [{ index: 2, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'active' },
          { value: '' },
          { value: '' },
          { value: '' },
        ],
        pointers: [{ index: 1, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      "'[' is an opener — push it. The most recent unmatched opener is now '[', the new top.",
  },
  {
    rows: [
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'done' },
          { value: '(', state: 'done' },
          { value: ')' },
          { value: ']' },
          { value: '}' },
        ],
        pointers: [{ index: 3, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'done' },
          { value: '(', state: 'active' },
          { value: '' },
          { value: '' },
        ],
        pointers: [{ index: 2, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      "'(' is an opener — push it. The stack is 3 deep; the '(' on top is the bracket the next closer must pair with.",
  },
  {
    rows: [
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'done' },
          { value: '(', state: 'done' },
          { value: ')', state: 'active' },
          { value: ']' },
          { value: '}' },
        ],
        pointers: [{ index: 4, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [
          { value: '{', state: 'done' },
          { value: '[', state: 'done' },
          { value: '(', state: 'active' },
          { value: '' },
          { value: '' },
        ],
        pointers: [{ index: 2, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      "')' is a closer. It must equal the top — and the top is '(' — a perfect pair, so pop it off. LIFO just told us the nearest unmatched opener without scanning.",
  },
  {
    rows: [
      {
        cells: [
          { value: '{', state: 'active' },
          { value: '[', state: 'done' },
          { value: '(', state: 'done' },
          { value: ')', state: 'done' },
          { value: ']', state: 'active' },
          { value: '}', state: 'done' },
        ],
        pointers: [{ index: 4, label: 'char', color: '#6366f1' }],
      },
      {
        cells: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
      },
    ],
    caption:
      "']' popped '[', '}' popped '{'. When the input ends the stack is empty — every opener found its closer, so the string is valid. An unmatched survivor would have said otherwise.",
  },
];
