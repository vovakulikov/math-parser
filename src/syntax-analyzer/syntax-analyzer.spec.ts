import SyntaxAnalyzer  from "./syntax-analyzer";
import { NonTerminal, Terminal } from "./types";
import parseStringToGrammar from './parse-string-to-grammar-rule';

describe('syntax analyzer', () => {

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
        left: NonTerminal('S'),
        right: [
          [ Terminal('-'), NonTerminal('B') ]
        ]
      },
      {
        left: NonTerminal('B'),
        right: [
          [ NonTerminal('T') ],
          [ NonTerminal('B'),  Terminal('&'), NonTerminal('T') ]]
      },
      {
        left: NonTerminal('T'),
        right: [
          [ NonTerminal('J') ],
          [ NonTerminal('T'), Terminal('^'), NonTerminal('J') ]
        ]
      },
      {
        left: NonTerminal('J'),
        right: [
          [ Terminal('('), NonTerminal('B'), Terminal(')') ],
          [ Terminal('p') ]
        ]
      }
    ]);

  });

  test('should correct find corner terminal sets', () => {
    const cornerTerminals = syntaxAnalyzer.getCornerTerminalSets();

    console.log(cornerTerminals);
    expect(cornerTerminals).toBeTruthy();
  });

});
