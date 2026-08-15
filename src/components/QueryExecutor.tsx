import { useEffect, useState } from 'react';

/**
 * Animated, step-through diagram of how PostgreSQL handles a SQL statement
 * into a result:
 *
 *   SQL text → Parser → Planner (optimizer) → Executor → Result rows
 *
 * All five stages are real stages in PostgreSQL's pipeline. The point of the
 * animation is to build a slow mental model: the executor only runs at the very
 * end, and rows move only in the last step. It proves the idea that a query
 * does NOT "run line by line the way you type it."
 */

const STEPS = [
  {
    node: 'sql',
    label: 'SQL query',
    caption: 'Human reads: SELECT ... WHERE city = ... . Text characters, nothing more yet.',
  },
  {
    node: 'parser',
    label: 'Parser',
    caption: 'Turns the text into a structured syntax tree — it only checks the grammar.',
  },
  {
    node: 'planner',
    label: 'Planner (optimizer)',
    caption: 'Chooses the cheapest way to run it: which index to scan, which table order to join.',
  },
  {
    node: 'executor',
    label: 'Executor',
    caption: 'Finally does the work: opens tables, reads pages, applies filters, joins, sorts.',
  },
  {
    node: 'result',
    label: 'Result rows',
    caption: 'The final rows are handed back to your client, from the last buffer in RAM.',
  },
];

const W = 520;
const H = 210;

// Node positions as top-left corners. The flowing order drops left → right → down,
// like a funnel.
const NODES: Record<string, { x: number; y: number; w: number; h: number }> = {
  sql: { x: 24, y: 48, w: 92, h: 56 },
  parser: { x: 128, y: 40, w: 92, h: 56 },
  planner: { x: 232, y: 52, w: 92, h: 56 },
  executor: { x: 336, y: 72, w: 92, h: 56 },
  result: { x: 412, y: 130, w: 92, h: 56 },
};

function nodeCenter(node: string) {
  const p = NODES[node];
  return { x: p.x + p.w / 2, y: p.y + p.h / 2 };
}

function Edge({ from, to, lit }: { from: string; to: string; lit: boolean }) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  return (
    <>
      <path
        d={`M ${a.x} ${a.y} Q ${mid.x} ${a.y} ${mid.x} ${mid.y} Q ${mid.x} ${b.y} ${b.x} ${b.y}`}
        fill="none"
        strokeWidth={2}
        className={lit ? 'stroke-indigo-500' : 'stroke-slate-200 dark:stroke-slate-700'}
      />
      <text x={mid.x} y={mid.y} fontSize={10} className="fill-slate-400 dark:fill-slate-500">
        {lit ? '✓' : ''}
      </text>
    </>
  );
}

export default function QueryExecutor() {
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setActive((a) => {
        if (a >= STEPS.length - 1) {
          setPlaying(false);
          return a;
        }
        return a + 1;
      });
    }, 1600);
    return () => window.clearInterval(id);
  }, [playing]);

  function select(i: number) {
    setActive(i);
    setPlaying(false);
  }

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          The life of a query — slow motion
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => select(-1)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {playing ? 'Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          {STEPS.slice(0, -1).map((s, i) => (
            <Edge key={i} from={s.node} to={STEPS[i + 1].node} lit={i < active} />
          ))}
          {STEPS.map((s, i) => {
            const p = NODES[s.node];
            const isActive = i === active;
            const done = i <= active;
            return (
              <g key={s.node} onClick={() => select(i)} className="cursor-pointer">
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={10}
                  strokeWidth={2}
                  className={
                    isActive
                      ? 'fill-indigo-500 stroke-indigo-500'
                      : done
                        ? 'fill-indigo-50 stroke-indigo-400 dark:fill-indigo-500/20 dark:stroke-indigo-400'
                        : 'fill-slate-50 stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600'
                  }
                />
                <text
                  x={p.x + p.w / 2}
                  y={p.y + 24}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  className={isActive ? 'fill-white' : 'fill-slate-700 dark:fill-slate-200'}
                >
                  {s.label.length > 14 ? s.label.slice(0, 13) + '…' : s.label}
                </text>
                <text
                  x={p.x + p.w / 2}
                  y={p.y + 42}
                  textAnchor="middle"
                  fontSize={9}
                  className={
                    isActive
                      ? 'fill-indigo-200'
                      : done
                        ? 'fill-indigo-500'
                        : 'fill-slate-400 dark:fill-slate-500'
                  }
                >
                  {done ? 'done' : 'wait'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="min-h-[3.5rem] border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        {active < 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Press <span className="font-medium text-indigo-600 dark:text-indigo-400">Play</span> (or
            tap any box) to walk through how a query becomes rows.
          </p>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Step {active + 1} · {STEPS[active].label}:
            </span>{' '}
            {STEPS[active].caption}
          </p>
        )}
      </div>
    </figure>
  );
}
