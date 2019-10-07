import SyntaxAnalyzer  from "./syntax-analyzer";
import { BOF, createNonTerminal, createTerminal, EOF } from "./types";
import parseStringToGrammar from './parse-string-to-grammar-rule';
import createPrecedenceMatrix, { Relation } from "./create-precedence-matrix";

describe('syntax analyzer', () => {

  function buildMapFromObject<K, V>(object: { [key: string]: V}): Map<string, V> {
    const map = new Map();

    for (let key in object) {
      map.set(key, object[key]);
    }

    return map;
  }

  let syntaxAnalyzer: SyntaxAnalyzer;

  beforeAll(() => {
    const terminals = new Set(['-', '&', '^', '(', ')', 'p']);
    const nonTerminals = new Set(['S','B','T','J',]);
    const grammarString = `
      S => - B
      B => T | B & T
      T => J | T ^ J
      J => ( B ) | p
`;

    syntaxAnalyzer = new SyntaxAnalyzer(parseStringToGrammar({ terminals, nonTerminals, grammarString}));
  });

  test('should correct parse grammar string to vocabulary', () => {

    expect(syntaxAnalyzer.rules).toEqual([
      {
        left: createNonTerminal('S'),
        right: [
          [ createTerminal('-'), createNonTerminal('B') ]
        ]
      },
      {
        left: createNonTerminal('B'),
        right: [
          [ createNonTerminal('T') ],
          [ createNonTerminal('B'),  createTerminal('&'), createNonTerminal('T') ]]
      },
      {
        left: createNonTerminal('T'),
        right: [
          [ createNonTerminal('J') ],
          [ createNonTerminal('T'), createTerminal('^'), createNonTerminal('J') ]
        ]
      },
      {
        left: createNonTerminal('J'),
        right: [
          [ createTerminal('('), createNonTerminal('B'), createTerminal(')') ],
          [ createTerminal('p') ]
        ]
      }
    ]);

  });

  test('should correct find corner terminal sets', () => {
    const cornerTerminals = syntaxAnalyzer.getCornerTerminalSets();
    const expectedTerminals = buildMapFromObject({
      'S': {
        rightElements: [
          createTerminal('-'),
          createTerminal('&'),
          createTerminal('^'),
          createTerminal(')'),
          createTerminal('p'),
        ],
        leftElements: [
          createTerminal('-')
        ],
      },
      'B': {
        rightElements: [
          createTerminal('&'),
          createTerminal('^'),
          createTerminal(')'),
          createTerminal('p'),
        ],
        leftElements: [
          createTerminal('&'),
          createTerminal('^'),
          createTerminal('('),
          createTerminal('p'),
        ],
      },
      'T': {
        rightElements: [
          createTerminal('^'),
          createTerminal(')'),
          createTerminal('p'),
        ],
        leftElements: [
          createTerminal('^'),
          createTerminal('('),
          createTerminal('p'),
        ],
      },
      'J': {
        rightElements: [
          createTerminal(')'),
          createTerminal('p'),
        ],
        leftElements: [
          createTerminal('('),
          createTerminal('p'),
        ],
      }
    });

    expect(cornerTerminals).includeSameCornerTerminals(expectedTerminals);
  });


  test('should correct build precedence matrix for current grammar', () => {
    const terminals = [
      createTerminal('-'),
      createTerminal('&'),
      createTerminal('^'),
      createTerminal(')'),
      createTerminal('('),
      createTerminal('p'),
    ];
    const cornerTerminals = syntaxAnalyzer.getCornerTerminalSets();

    const expectedMatrix = {
      [BOF.value] : {
        '-': Relation.Prev,
        '&': Relation.None,
        '^': Relation.None,
        '(': Relation.Prev,
        ')': Relation.None,
        'p': Relation.Prev,
      },
      '-': {
        '-': Relation.None,
        '&': Relation.Prev,
        '^': Relation.Prev,
        '(': Relation.Prev,
        ')': Relation.None,
        'p': Relation.Prev,
        [EOF.value]: Relation.Next,
      },
      '&': {
        '-': Relation.None,
        '&': Relation.Next,
        '^': Relation.Prev,
        '(': Relation.Prev,
        ')': Relation.Next,
        'p': Relation.Prev,
        [EOF.value]: Relation.Next,
      },
      '^': {
        '-': Relation.None,
        '&': Relation.Next,
        '^': Relation.Next,
        '(': Relation.Prev,
        ')': Relation.Next,
        'p': Relation.Prev,
        [EOF.value]: Relation.Next,
      },
      '(': {
        '-': Relation.None,
        '&': Relation.Prev,
        '^': Relation.Prev,
        '(': Relation.Prev,
        ')': Relation.Base,
        'p': Relation.Prev,
      },
      ')': {
        '-': Relation.None,
        '&': Relation.Next,
        '^': Relation.Next,
        '(': Relation.None,
        ')': Relation.Next,
        'p': Relation.None,
        [EOF.value]: Relation.Next,
      },
      'p': {
        '-': Relation.None,
        '&': Relation.Next,
        '^': Relation.Next,
        '(': Relation.None,
        ')': Relation.Next,
        'p': Relation.None,
        [EOF.value]: Relation.Next,
      },
    };
    const matrix = createPrecedenceMatrix(terminals, syntaxAnalyzer.rules, cornerTerminals);

    expect(matrix).toEqual(expectedMatrix);
  })

});
