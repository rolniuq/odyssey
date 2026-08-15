import { useEffect, useState } from 'react';

export interface VisualizerCell {
  value: string | number;
  state?: 'idle' | 'active' | 'done';
}

export interface VisualizerPointer {
  index: number;
  label: string;
  color: string;
}

export interface VisualizerRow {
  cells: VisualizerCell[];
  pointers?: VisualizerPointer[];
}

export interface VisualizerFrame {
  rows: VisualizerRow[];
  caption: string;
}

interface DsaVisualizerProps {
  title: string;
  frames: VisualizerFrame[];
}

const CELL_STATE: Record<string, string> = {
  idle: 'border-slate-200 bg-slate-100 text-slate-700',
  active: 'border-indigo-600 bg-indigo-600 text-white shadow-md',
  done: 'border-emerald-300 bg-emerald-100 text-emerald-800',
};

export default function DsaVisualizer({ title, frames }: DsaVisualizerProps) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrame((f) => {
        if (f >= frames.length - 1) {
          setPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  function select(i: number) {
    setFrame(i);
    setPlaying(false);
  }

  const current = frames[frame];

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => select(0)}
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
            onClick={() => setFrame((f) => Math.min(f + 1, frames.length - 1))}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Step →
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4">
        {current.rows.map((row, r) => (
          <div key={r} className="relative pt-6">
            <div className="flex justify-center gap-1">
              {row.cells.map((cell, c) => (
                <div
                  key={c}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-sm font-semibold transition ${CELL_STATE[cell.state ?? 'idle']}`}
                >
                  {cell.value}
                </div>
              ))}
            </div>
            {row.pointers?.map((p, pi) => (
              <div
                key={pi}
                className="pointer-events-none absolute top-0"
                style={{
                  left: `${((p.index + 0.5) / row.cells.length) * 100}%`,
                  transform: 'translateX(-50%)',
                  color: p.color,
                }}
              >
                <span className="text-[10px] font-bold tracking-wide uppercase">{p.label}</span>
                <div className="mx-auto h-4 w-px bg-current" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="min-h-[3.5rem] border-t border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-indigo-600">
            Step {frame + 1} / {frames.length}:
          </span>{' '}
          {current.caption}
        </p>
      </div>
    </figure>
  );
}
