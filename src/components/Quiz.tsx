import { useState } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * MCQ quiz with instant feedback.
 * Every answer (right or wrong) teaches something:
 * the explanation is written to say WHY the correct answer is correct,
 * and (when the user picks wrong) why their pick is not.
 */
export default function Quiz({ questions }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  if (!q) return null;

  const isLast = current === questions.length - 1;
  const isCorrect = picked === q.answerIndex;

  function pick(i: number) {
    if (picked !== null) return; // locked after answering
    setPicked(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setPicked(null);
  }

  function restart() {
    setCurrent(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Quiz complete
        </p>
        <p className="mt-2 text-2xl font-bold">
          {score} / {questions.length}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {score === questions.length
            ? 'Perfect. You can explain this idea to someone else now — go teach it.'
            : score >= questions.length / 2
              ? 'Good. Re-explain the wrong ones out loud before moving on — that is the Feynman way.'
              : 'Re-read the page and try again. One idea, deeply, remember.'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Retry quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Prove it to yourself
        </p>
        <p className="text-xs font-medium text-slate-400">
          {current + 1} / {questions.length}
        </p>
      </div>

      <p className="mt-3 text-lg leading-snug font-semibold">{q.question}</p>

      <div className="mt-4 space-y-2">
        {q.options.map((option, i) => {
          const isAnswer = i === q.answerIndex;
          const isPicked = i === picked;

          let cls = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700';
          if (picked !== null) {
            if (isAnswer) cls = 'border-emerald-400 bg-emerald-50 text-emerald-800';
            else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-700';
            else cls = 'border-slate-200 bg-slate-50 text-slate-400';
          }

          return (
            <button
              type="button"
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                  picked !== null && isAnswer
                    ? 'border-emerald-400 bg-emerald-500 text-white'
                    : picked !== null && isPicked
                      ? 'border-rose-400 bg-rose-500 text-white'
                      : 'border-slate-300 text-slate-500'
                }`}
              >
                {LETTERS[i]}
              </span>
              <span>{option}</span>
              {picked !== null && isAnswer && (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-auto h-5 w-5 shrink-0 text-emerald-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}
              {picked !== null && isPicked && !isAnswer && (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-auto h-5 w-5 shrink-0 text-rose-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm ${
            isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-sky-50 text-sky-900'
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? 'Correct — and why' : 'Not quite — here is the truth'}
          </p>
          <p className="mt-1 leading-relaxed">{q.explanation}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            {isLast ? 'Finish' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  );
}
