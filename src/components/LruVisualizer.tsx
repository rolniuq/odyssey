import { useEffect, useState } from 'react';

/**
 * Animated, step-through diagram of an LRU cache with capacity 2, running the
 * classic LeetCode operation sequence:
 *
 *   put(1,1) put(2,2) get(1) put(3,3) get(2) put(4,4) get(3) get(4)
 *
 * The generic array visualizer cannot express two coupled structures, so this
 * SVG draws both halves of the invariant side by side: the hash map (key →
 * value) above and the doubly linked list (LRU on the left, MRU on the right)
 * below. Each step shows which node is touched, which node is evicted, and the
 * returned value.
 */

type CellState = 'idle' | 'active' | 'done';

interface LruMapEntry {
  key: number;
  value: number;
  state: CellState;
}

interface LruListNode {
  key: number;
  state: CellState;
}

interface LruStep {
  action: string;
  result: string;
  caption: string;
  map: LruMapEntry[];
  list: LruListNode[];
  evicted?: number;
}

const STEPS: LruStep[] = [
  {
    action: 'LRUCache(2)',
    result: '—',
    caption:
      'An LRU cache is two structures sharing one invariant. The hash map stores key → node for O(1) lookups; the doubly linked list keeps recency order, least-recent on the left, most-recent on the right. Capacity 2 means at most two keys at once.',
    map: [],
    list: [],
  },
  {
    action: 'put(1, 1)',
    result: 'null',
    caption:
      'put(1, 1) inserts a new node at the most-recent end of the list (the tail) and records key 1 → that node in the map. With a single entry, LRU and MRU are the same node.',
    map: [{ key: 1, value: 1, state: 'active' }],
    list: [{ key: 1, state: 'active' }],
  },
  {
    action: 'put(2, 2)',
    result: 'null',
    caption:
      'put(2, 2) appends 2 at the tail. Recency order: 1 (least) → 2 (most). Capacity 2 is now full — the next insert must evict.',
    map: [
      { key: 1, value: 1, state: 'idle' },
      { key: 2, value: 2, state: 'active' },
    ],
    list: [
      { key: 1, state: 'idle' },
      { key: 2, state: 'active' },
    ],
  },
  {
    action: 'get(1)',
    result: '1',
    caption:
      'get(1) finds key 1 in the map in O(1) and moves its node to the tail. Reading refreshes recency, so 2 becomes the least-recent. Output: 1.',
    map: [
      { key: 1, value: 1, state: 'active' },
      { key: 2, value: 2, state: 'idle' },
    ],
    list: [
      { key: 2, state: 'idle' },
      { key: 1, state: 'active' },
    ],
  },
  {
    action: 'put(3, 3)',
    result: 'null',
    caption:
      'put(3, 3) finds the cache full, so it evicts the least-recent node — 2 — from the head, drops it from the map, and appends 3. Map: 1 and 3; list: 1 → 3.',
    evicted: 2,
    map: [
      { key: 1, value: 1, state: 'idle' },
      { key: 3, value: 3, state: 'active' },
    ],
    list: [
      { key: 1, state: 'idle' },
      { key: 3, state: 'active' },
    ],
  },
  {
    action: 'get(2)',
    result: '-1',
    caption:
      'get(2) misses: key 2 was evicted and is absent from the map, so it returns −1. A miss changes no ordering — the list stays 1 → 3.',
    map: [
      { key: 1, value: 1, state: 'idle' },
      { key: 3, value: 3, state: 'idle' },
    ],
    list: [
      { key: 1, state: 'idle' },
      { key: 3, state: 'idle' },
    ],
  },
  {
    action: 'put(4, 4)',
    result: 'null',
    caption:
      'put(4, 4) needs room again: it evicts the least-recent 1 and appends 4. Map: 3 and 4; list: 3 → 4. Every eviction is a constant number of pointer changes.',
    evicted: 1,
    map: [
      { key: 3, value: 3, state: 'idle' },
      { key: 4, value: 4, state: 'active' },
    ],
    list: [
      { key: 3, state: 'idle' },
      { key: 4, state: 'active' },
    ],
  },
  {
    action: 'get(3)',
    result: '3',
    caption:
      'get(3) hits, moving 3 to the most-recent tail: the list becomes 4 → 3. Output: 3. Each hit keeps a hot key alive and pushes its cooler neighbor toward eviction.',
    map: [
      { key: 3, value: 3, state: 'active' },
      { key: 4, value: 4, state: 'idle' },
    ],
    list: [
      { key: 4, state: 'idle' },
      { key: 3, state: 'active' },
    ],
  },
  {
    action: 'get(4)',
    result: '4',
    caption:
      'get(4) hits, moving 4 to the tail: list becomes 3 → 4. Output for the eight ops shown: [null, null, 1, null, −1, null, 3, 4] — every operation O(1).',
    map: [
      { key: 3, value: 3, state: 'idle' },
      { key: 4, value: 4, state: 'active' },
    ],
    list: [
      { key: 3, state: 'idle' },
      { key: 4, state: 'active' },
    ],
  },
];

const W = 760;
const H = 320;
const NODE_W = 52;
const NODE_H = 40;
const NODE_Y = 132;
const NODE_GAP = 96;
const ARROW_Y_TOP = 118;
const ARROW_Y_BOTTOM = 184;
const MAP_Y = 30;
const MAP_H = 42;
const SLOT_X = [40, 230];

const STATE: Record<CellState, { fill: string; stroke: string; text: string }> = {
  idle: { fill: '#f8fafc', stroke: '#cbd5e1', text: '#334155' },
  active: { fill: '#6366f1', stroke: '#4f46e5', text: '#ffffff' },
  done: { fill: '#ecfdf5', stroke: '#34d399', text: '#065f46' },
};

export default function LruVisualizer() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrame((f) => {
        if (f >= STEPS.length - 1) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 1600);
    return () => window.clearInterval(id);
  }, [playing]);

  const step = STEPS[frame];
  const n = step.list.length;
  const totalW = n > 0 ? n * NODE_W + (n - 1) * NODE_GAP : 0;
  const startX = n > 0 ? (W - totalW) / 2 : W / 2;

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">
          LRU Cache: hash map + doubly linked list
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setFrame(0);
              setPlaying(false);
            }}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => Math.max(f - 1, 0))}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            ← Step
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {playing ? 'Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={() => setFrame((f) => Math.min(f + 1, STEPS.length - 1))}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Step →
          </button>
        </div>
      </div>

      <div className="p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          <defs>
            <marker
              id="arrowNext"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker
              id="arrowPrev"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 10 0 L 0 5 L 10 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          <text x={40} y={16} fontSize={11} fontWeight={600} fill="#64748b">
            hash map (key → value)
          </text>

          {step.map.length === 0 && (
            <text x={40} y={MAP_Y + 26} fontSize={13} fill="#94a3b8">
              empty
            </text>
          )}
          {step.map.map((entry, i) => {
            const s = STATE[entry.state];
            const x = SLOT_X[i];
            return (
              <g key={entry.key}>
                <rect
                  x={x}
                  y={MAP_Y}
                  width={46}
                  height={MAP_H}
                  rx={8}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={2}
                />
                <text
                  x={x + 23}
                  y={MAP_Y + 27}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill={s.text}
                >
                  {entry.key}
                </text>
                <text x={x + 55} y={MAP_Y + 27} textAnchor="middle" fontSize={14} fill="#94a3b8">
                  →
                </text>
                <rect
                  x={x + 64}
                  y={MAP_Y}
                  width={86}
                  height={MAP_H}
                  rx={8}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={2}
                />
                <text
                  x={x + 107}
                  y={MAP_Y + 27}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill={s.text}
                >
                  {entry.value}
                </text>
              </g>
            );
          })}

          <text x={40} y={96} fontSize={11} fontWeight={600} fill="#64748b">
            doubly linked list — LRU left · MRU right
          </text>

          {n === 0 && (
            <text x={W / 2} y={NODE_Y + 26} textAnchor="middle" fontSize={13} fill="#94a3b8">
              no nodes yet
            </text>
          )}

          {n >= 1 && (
            <text
              x={startX + NODE_W / 2}
              y={110}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#f59e0b"
            >
              {n === 1 ? 'LRU · MRU' : 'LRU'}
            </text>
          )}
          {n >= 2 && (
            <text
              x={startX + (n - 1) * (NODE_W + NODE_GAP) + NODE_W / 2}
              y={110}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="#6366f1"
            >
              MRU
            </text>
          )}

          {step.list.map((node, i) => {
            const x = startX + i * (NODE_W + NODE_GAP);
            const s = STATE[node.state];
            return (
              <g key={node.key}>
                <rect
                  x={x}
                  y={NODE_Y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={2}
                />
                <text
                  x={x + NODE_W / 2}
                  y={NODE_Y + 26}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill={s.text}
                >
                  {node.key}
                </text>
              </g>
            );
          })}

          {n >= 2 &&
            Array.from({ length: n - 1 }, (_, i) => {
              const x0 = startX + i * (NODE_W + NODE_GAP);
              const x1 = x0 + NODE_W + NODE_GAP;
              return (
                <g key={i}>
                  <line
                    x1={x0 + NODE_W}
                    y1={ARROW_Y_TOP}
                    x2={x1}
                    y2={ARROW_Y_TOP}
                    stroke="#94a3b8"
                    strokeWidth={2}
                    markerEnd="url(#arrowNext)"
                  />
                  <line
                    x1={x1}
                    y1={ARROW_Y_BOTTOM}
                    x2={x0 + NODE_W}
                    y2={ARROW_Y_BOTTOM}
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    markerEnd="url(#arrowPrev)"
                  />
                </g>
              );
            })}

          {step.evicted !== undefined && (
            <g>
              <rect
                x={600}
                y={248}
                width={132}
                height={30}
                rx={8}
                fill="#fff1f2"
                stroke="#fda4af"
                strokeWidth={1.5}
              />
              <text
                x={666}
                y={268}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="#be123c"
              >
                evicts key {step.evicted}
              </text>
            </g>
          )}

          <text x={40} y={268} fontSize={13} fontWeight={600} fill="#334155">
            {step.action}
          </text>
          <text x={W - 40} y={268} textAnchor="end" fontSize={13} fontWeight={600} fill="#6366f1">
            → {step.result}
          </text>
        </svg>
      </div>

      <div className="min-h-[3.5rem] border-t border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-indigo-600">
            Step {frame + 1} / {STEPS.length}:
          </span>{' '}
          {step.caption}
        </p>
      </div>
    </figure>
  );
}
