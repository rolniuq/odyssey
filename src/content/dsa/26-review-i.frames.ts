import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [
          { value: 'A' },
          { value: 'D' },
          { value: 'O' },
          { value: 'B' },
          { value: 'E' },
          { value: 'C' },
          { value: 'O' },
          { value: 'D' },
          { value: 'E' },
          { value: 'B' },
          { value: 'A' },
          { value: 'N' },
          { value: 'C' },
        ],
        pointers: [
          { index: 0, label: 'left', color: '#6366f1' },
          { index: 0, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      's = "ADOBECODEBANC", t = "ABC". Minimum Window Substring asks for the shortest contiguous run of s that contains every letter of t. Two pointers own the window: the right edge grows it until every needed letter is inside, then the left edge retracts it while it stays valid. Both start at index 0 — the window is empty.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'A', state: 'active' },
          { value: 'D', state: 'active' },
          { value: 'O', state: 'active' },
          { value: 'B', state: 'active' },
          { value: 'E', state: 'active' },
          { value: 'C', state: 'active' },
          { value: 'O' },
          { value: 'D' },
          { value: 'E' },
          { value: 'B' },
          { value: 'A' },
          { value: 'N' },
          { value: 'C' },
        ],
        pointers: [
          { index: 0, label: 'left', color: '#6366f1' },
          { index: 5, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'The right edge slides to index 5, and the window "ADOBEC" now holds one A, one B, and one C — every letter of t is covered, so the window is valid. Record the candidate: length 6. Time to shrink the left edge and hunt for something shorter.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'A' },
          { value: 'D', state: 'active' },
          { value: 'O', state: 'active' },
          { value: 'B', state: 'active' },
          { value: 'E', state: 'active' },
          { value: 'C', state: 'active' },
          { value: 'O' },
          { value: 'D' },
          { value: 'E' },
          { value: 'B' },
          { value: 'A' },
          { value: 'N' },
          { value: 'C' },
        ],
        pointers: [
          { index: 1, label: 'left', color: '#6366f1' },
          { index: 5, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Shrink: the left edge drops the A, leaving "DOBEC". That window no longer contains an A, so it is invalid — the left edge must stop. The push-pull rule: grow the right edge until valid, shrink the left edge while valid, and never let the window go invalid while shrinking.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'A' },
          { value: 'D' },
          { value: 'O' },
          { value: 'B' },
          { value: 'E' },
          { value: 'C', state: 'active' },
          { value: 'O', state: 'active' },
          { value: 'D', state: 'active' },
          { value: 'E', state: 'active' },
          { value: 'B', state: 'active' },
          { value: 'A', state: 'active' },
          { value: 'N' },
          { value: 'C' },
        ],
        pointers: [
          { index: 5, label: 'left', color: '#6366f1' },
          { index: 10, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Growth resumes: the right edge extends to index 10, where a fresh A restores validity — "CODEBA" still covers A, B, C. Shrinking the left edge as far as it will go lands at index 5 for a length-6 window, a tie, not a new best. The next shrink loses the C, so growth starts again.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'A' },
          { value: 'D' },
          { value: 'O' },
          { value: 'B' },
          { value: 'E' },
          { value: 'C' },
          { value: 'O' },
          { value: 'D' },
          { value: 'E' },
          { value: 'B', state: 'active' },
          { value: 'A', state: 'active' },
          { value: 'N', state: 'active' },
          { value: 'C', state: 'active' },
        ],
        pointers: [
          { index: 9, label: 'left', color: '#6366f1' },
          { index: 12, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'One final round: the right edge reaches the last C at index 12, then the left edge retracts while the window stays valid. It stops at index 9: "BANC" — length 4 — a new best. Every letter of t sits inside, and no shorter window can survive the shrink rule.',
  },
  {
    rows: [
      {
        cells: [
          { value: 'A' },
          { value: 'D' },
          { value: 'O' },
          { value: 'B' },
          { value: 'E' },
          { value: 'C' },
          { value: 'O' },
          { value: 'D' },
          { value: 'E' },
          { value: 'B', state: 'done' },
          { value: 'A', state: 'done' },
          { value: 'N', state: 'done' },
          { value: 'C', state: 'done' },
        ],
        pointers: [
          { index: 9, label: 'left', color: '#6366f1' },
          { index: 12, label: 'right', color: '#f59e0b' },
        ],
      },
    ],
    caption:
      'Answer: "BANC". Each index is pushed by the right edge once and popped by the left edge once, so the whole hunt is two O(n) passes — no nested scan, no backtracking. That linear push-pull is the sliding-window trick, and it is exactly the two-pointer discipline from Day 2 stretched into a moving window.',
  },
];
