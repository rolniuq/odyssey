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
      'Now the same graph, same starting node, but the frontier is a STACK. Mark 0 visited and push it — LIFO: the most recently pushed node is the one examined next, not the oldest.',
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
        pointers: [{ index: 1, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 0 and push its unvisited neighbors 1 and 2. The newest arrival, 1, sits on top — so the search prefers the just-found path over the sibling waiting below. Visited hygiene is unchanged: mark each neighbor at discovery.',
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
        cells: [{ value: 2 }, { value: 4 }, { value: 3, state: 'active' }],
        pointers: [{ index: 2, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 1 and push 3, 4 on top. The stack now reads [2, 4, 3] bottom to top: the dive goes into 3 next, while 2 — discovered a whole step earlier — waits below. No layer is drained before going deeper; that is the depth-first difference.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'active' },
          { value: 3, state: 'done' },
          { value: 4, state: 'active' },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [{ value: 2 }, { value: 4, state: 'active' }],
        pointers: [{ index: 1, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 3 — a leaf with no unvisited neighbors, so nothing is pushed and the stack shrinks. The dive has bottomed out; the next node out is the one just above it in the stack.',
  },
  {
    rows: [
      {
        cells: [
          { value: 0, state: 'done' },
          { value: 1, state: 'done' },
          { value: 2, state: 'active' },
          { value: 3, state: 'done' },
          { value: 4, state: 'done' },
          { value: 5 },
          { value: 6 },
        ],
      },
      {
        cells: [{ value: 2, state: 'active' }],
        pointers: [{ index: 0, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 4, also a leaf. With the first branch exhausted, the stack unwinds back to 2 — the sibling waiting since the very first pop. Backtracking is just the stack popping its way back up.',
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
        cells: [{ value: 6 }, { value: 5, state: 'active' }],
        pointers: [{ index: 1, label: 'top', color: '#f59e0b' }],
      },
    ],
    caption:
      'Pop 2 and push its neighbors 5 and 6, 5 on top. The second branch descends exactly like the first: newest path first, straight down, no layer turns.',
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
      'Pop 5 and 6 — leaves — and the stack empties. DFS order: 0, 1, 3, 4, 2, 5, 6. Same graph, same visited rule, and the only swap from BFS was queue → stack: BFS drained the 0-wave before peeking deeper; DFS dove to the bottom of one branch before ever turning back.',
  },
];
