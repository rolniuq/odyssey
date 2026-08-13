import { useEffect, useRef, useState } from 'react';

export interface ProblemTestCase {
  input: unknown[];
  expected: unknown;
}

export interface CodeRunnerProblem {
  title: string;
  leetcodeId: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  starterCode: string;
  testCases: ProblemTestCase[];
}

interface CodeRunnerProps {
  problem: CodeRunnerProblem;
}

interface TestResult {
  pass: boolean;
  got: unknown;
  expected: unknown;
  error: string | null;
}

// The worker under test: defines `solution` from user code, runs every test case in a
// try/catch, deep-compares against the expected value, and reports back. Runs in a
// Blob worker so a busy loop in user code never blocks the page UI.
const WORKER_SOURCE = [
  'function deepEqual(a, b) {',
  '  if (a === b) return true;',
  '  if (typeof a !== typeof b) return false;',
  '  if (a === null || b === null) return a === b;',
  "  if (typeof a !== 'object') return false;",
  '  const aArr = Array.isArray(a);',
  '  const bArr = Array.isArray(b);',
  '  if (aArr !== bArr) return false;',
  '  if (aArr) {',
  '    if (a.length !== b.length) return false;',
  '    for (let i = 0; i < a.length; i++) {',
  '      if (!deepEqual(a[i], b[i])) return false;',
  '    }',
  '    return true;',
  '  }',
  '  const aKeys = Object.keys(a);',
  '  const bKeys = Object.keys(b);',
  '  if (aKeys.length !== bKeys.length) return false;',
  '  for (const k of aKeys) {',
  '    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;',
  '    if (!deepEqual(a[k], b[k])) return false;',
  '  }',
  '  return true;',
  '}',
  '',
  'self.onmessage = function (event) {',
  '  var msg = event.data;',
  '  var solution;',
  '  try {',
  "    var factory = new Function(msg.code + '\\nreturn solution;');",
  '    solution = factory();',
  "    if (typeof solution !== 'function') {",
  "      throw new Error('Define a function named solution, e.g. function solution(nums, target) { ... }');",
  '    }',
  '  } catch (err) {',
  "    self.postMessage({ kind: 'error', error: String(err && err.message ? err.message : err) });",
  '    return;',
  '  }',
  '  var results = [];',
  '  var start = Date.now();',
  '  for (var i = 0; i < msg.testCases.length; i++) {',
  '    var tc = msg.testCases[i];',
  '    try {',
  '      var got = solution.apply(null, tc.input);',
  '      results.push({ pass: deepEqual(got, tc.expected), got: got, expected: tc.expected, error: null });',
  '    } catch (err) {',
  '      results.push({',
  '        pass: false,',
  '        got: undefined,',
  '        expected: tc.expected,',
  '        error: String(err && err.message ? err.message : err),',
  '      });',
  '    }',
  '  }',
  '  self.postMessage({ kind: "done", results: results, ms: Date.now() - start });',
  '};',
].join('\n');

const DIFFICULTY_BADGE: Record<CodeRunnerProblem['difficulty'], string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

function fmt(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function leetcodeUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `https://leetcode.com/problems/${slug}/`;
}

export default function CodeRunner({ problem }: CodeRunnerProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  function getWorker(): Worker {
    if (workerRef.current) return workerRef.current;
    const blob = new Blob([WORKER_SOURCE], { type: 'text/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;
    return worker;
  }

  function run() {
    setRunning(true);
    setSyntaxError(null);
    const worker = getWorker();
    worker.onmessage = (event) => {
      setRunning(false);
      if (event.data.kind === 'error') {
        setResults(null);
        setSyntaxError(event.data.error);
      } else {
        setResults(event.data.results);
      }
    };
    worker.postMessage({ code, testCases: problem.testCases });
  }

  function reset() {
    setCode(problem.starterCode);
    setResults(null);
    setSyntaxError(null);
  }

  const passed = results?.filter((r) => r.pass).length ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">{problem.title}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_BADGE[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">#{problem.leetcodeId}</span>
          {results && (
            <span
              className={`text-xs font-semibold ${
                passed === problem.testCases.length ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {passed}/{problem.testCases.length} tests
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <pre className="max-h-40 overflow-auto rounded-xl bg-slate-50 p-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-600">
          {problem.prompt}
        </pre>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="h-44 w-full rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
          <a
            href={leetcodeUrl(problem.title)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Open on LeetCode ↗
          </a>
        </div>

        {syntaxError && (
          <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
            <p className="font-semibold">Could not load your code:</p>
            <p className="mt-1 font-mono leading-relaxed">{syntaxError}</p>
          </div>
        )}

        {results && !syntaxError && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex flex-wrap items-start gap-3 rounded-xl border p-3 text-sm ${
                  r.pass
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                <span className="font-semibold">Test {i + 1}</span>
                <span className={r.pass ? '' : 'font-medium'}>
                  {r.pass ? '✓ passed' : '✗ failed'}
                  {r.error ? ` — ${r.error}` : ''}
                </span>
                <span className="w-full font-mono text-xs leading-relaxed">
                  got {fmt(r.got)} · expected {fmt(r.expected)}
                </span>
              </div>
            ))}
            <p className="text-xs text-slate-400">
              Ran in the page&apos;s own sandbox — view the full test set on LeetCode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
