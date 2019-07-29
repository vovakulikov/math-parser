import LexerAnalyzer from "./lexical-analyzer";
import { TokenType } from "./token";

describe('Lexical analyzer', () => {
  let lexParser: LexerAnalyzer;

  beforeAll(() => {
    lexParser = new LexerAnalyzer();
  });

  test('should correct parse simple string', () => {
    const result = lexParser.parse('1.2223 + 2');
    const expectResult = [
      {
        type: TokenType.number,
        value: 1.2223,
        startPosition: 0,
        endPosition: 6
      },
      {
        type: TokenType.operator,
        value: '+',
        startPosition: 7,
        endPosition: 8
      },
      {
        type: TokenType.number,
        value: 2,
        startPosition: 9,
        endPosition: 10
      },
    ];

    expect(result).toBeTruthy();
    expect(result).toEqual(expectResult);
  });

  test('should correct parse simple with parenthesis operator and identifier', () => {
    const result = lexParser.parse('(1.2 + 2) * var1 + _var3');
    const expectResult = [
      {
        type: TokenType.leftParenthesis,
        value: '(',
        startPosition: 0,
        endPosition: 1
      },
      {
        type: TokenType.number,
        value: 1.2,
        startPosition: 1,
        endPosition: 4
      },
      {
        type: TokenType.operator,
        value: '+',
        startPosition: 5,
        endPosition: 6
      },
      {
        type: TokenType.number,
        value: 2,
        startPosition: 7,
        endPosition: 8
      },
      {
        type: TokenType.rightParenthesis,
        value: ')',
        startPosition: 8,
        endPosition: 9
      },
      {
        type: TokenType.operator,
        value: '*',
        startPosition: 10,
        endPosition: 11
      },
      {
        type: TokenType.identifier,
        value: 'var1',
        startPosition: 12,
        endPosition: 16
      },
      {
        type: TokenType.operator,
        value: '+',
        startPosition: 17,
        endPosition: 18
      },
      {
        type: TokenType.identifier,
        value: '_var3',
        startPosition: 19,
        endPosition: 24
      },
    ];

    expect(result).toBeTruthy();
    expect(result).toEqual(expectResult);
  });
});
