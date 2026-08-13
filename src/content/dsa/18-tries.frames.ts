import type { VisualizerFrame } from '../../components/DsaVisualizer';

export const frames: VisualizerFrame[] = [
  {
    rows: [{ cells: [{ value: 'root', state: 'done' }] }],
    caption:
      'A trie is born as a single root: no words, no children. When "cat" is inserted, the walk starts at the root and looks for a child labeled c. There is none, so one will be created.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'done' }] },
      { cells: [{ value: 'c', state: 'done' }] },
      { cells: [{ value: 'a', state: 'active' }] },
    ],
    caption:
      'The c child is born, then the walk descends into it and looks for a child a — also missing, so a is created as well. The trie so far is the single path root → c → a, one node per letter.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'done' }] },
      { cells: [{ value: 'c', state: 'done' }] },
      { cells: [{ value: 'a', state: 'done' }] },
      { cells: [{ value: 't', state: 'done' }] },
    ],
    caption:
      'The final letter t is created, and because "cat" is complete, t gets the word-end mark — shown green. The path root → c → a → t now spells a stored word; the path root → c → a spells "ca", a live prefix.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'done' }] },
      { cells: [{ value: 'c', state: 'done' }] },
      { cells: [{ value: 'a', state: 'done' }] },
      {
        cells: [
          { value: 't', state: 'done' },
          { value: 'r', state: 'active' },
        ],
      },
      { cells: [{ value: 'e', state: 'done' }] },
    ],
    caption:
      'Inserting "care": the walk follows the existing root → c → a spine without creating a thing, then branches — r is a new child of a, and e is a new child of r, marked as the end of "care". Two stored words now share the "ca" spine and only diverge at their final letters.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'active' }] },
      { cells: [{ value: 'c', state: 'active' }] },
      { cells: [{ value: 'a', state: 'active' }] },
      { cells: [{ value: 't', state: 'active' }, { value: 'r' }] },
      { cells: [{ value: 'e', state: 'done' }] },
    ],
    caption:
      'search("cat") follows the lit path root → c → a → t, one child per letter. Every step exists, and the terminal node t carries the word-end mark: the whole word "cat" is present, so search returns true.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'active' }] },
      { cells: [{ value: 'c', state: 'active' }] },
      { cells: [{ value: 'a', state: 'active' }] },
      { cells: [{ value: 't' }, { value: 'r', state: 'active' }] },
      { cells: [{ value: 'e', state: 'done' }] },
    ],
    caption:
      'search("car") walks the same spine then to r. The node r exists — but it carries no word-end mark ("care" ends at e, not at r). So "car" is only a prefix: search returns false, while startsWith("car") returns true. One flag, and the two questions split.',
  },
  {
    rows: [
      { cells: [{ value: 'root', state: 'done' }] },
      { cells: [{ value: 'c', state: 'done' }] },
      { cells: [{ value: 'a', state: 'active' }] },
      { cells: [{ value: 't' }, { value: 'r' }] },
    ],
    caption:
      'search("cap") dies one step earlier: at the node a there is no child labeled p — the trie has no entry under that letter. The lookup simply ends, and both search("cap") and startsWith("cap") return false. Missing child, short answer, no scan of the whole vocabulary.',
  },
];
