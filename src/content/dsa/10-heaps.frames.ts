import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [
      {
        cells: [{ value: 3, state: 'active' }],
        pointers: [{ index: 0, label: 'root', color: '#6366f1' }],
      },
    ],
    caption:
      'Scan starts. k = 3, so the heap wants to hold the 3 largest values seen. Push 3: the heap is [3] — with one member, the root is just 3.',
  },
  {
    rows: [
      {
        cells: [{ value: 2, state: 'active' }, { value: 3 }],
        pointers: [{ index: 0, label: 'root', color: '#6366f1' }],
      },
    ],
    caption:
      'Insert 2. It lands as a leaf, then sifts up because 2 < 3 — parents must be no larger than children in a min-heap. Heap: [2, 3].',
  },
  {
    rows: [
      {
        cells: [{ value: 1, state: 'active' }, { value: 3 }, { value: 2 }],
        pointers: [{ index: 0, label: 'root', color: '#f59e0b' }],
      },
    ],
    caption:
      'Insert 1 — it bubbles to the root. The heap now has size k = 3: a trophy case holding the three largest values seen (1, 2, 3). Who is the current 3rd-largest? The root: 1.',
  },
  {
    rows: [
      {
        cells: [{ value: 2, state: 'active' }, { value: 3 }, { value: 5 }],
        pointers: [{ index: 0, label: 'root', color: '#6366f1' }],
      },
    ],
    caption:
      'Insert 5: it enters the top-3 candidate set, the heap swells to size 4 and must evict the root — the weakest of the current best, 1. Sift down leaves [2, 3, 5]. 3rd-largest is now 2.',
  },
  {
    rows: [
      {
        cells: [{ value: 3, state: 'active' }, { value: 5 }, { value: 6 }],
        pointers: [{ index: 0, label: 'root', color: '#6366f1' }],
      },
    ],
    caption:
      'Insert 6, evict the root 2. Heap: [3, 5, 6] — still exactly the three largest values met so far, and the root (3) stays the current 3rd-largest.',
  },
  {
    rows: [
      {
        cells: [{ value: 4, state: 'active' }, { value: 5 }, { value: 6 }],
        pointers: [{ index: 0, label: 'root', color: '#10b981' }],
      },
    ],
    caption:
      'Insert 4: it bubbles into [3, 4, 6, 5], then the size-overflow evicts 3, leaving [4, 5, 6]. The scan is done — the root 4 is the 3rd-largest of all six values. No full sort ever ran.',
  },
];
