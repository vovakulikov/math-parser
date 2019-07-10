import { ITokenParser } from "./token-parsers/parser";
import { IToken } from "./token";
import NumberParser from './token-parsers/number-parser/number-parser';
import ArithmeticOperatorParser from "./token-parsers/arithmetic-operator-parser/arithmetic-operator-parser";
import IdentifierParser from "./token-parsers/identifier-parser/identifier-parser";
import ComparisonOperatorParser from "./token-parsers/comparison-operator-parser/comparison-operator-parser";
import ParenthesisParser from "./token-parsers/parenthesis-parser/parenthesis-parser";

class LexerAnalyzer {
  parsers: Array<ITokenParser<string | number>> = [
    new IdentifierParser(),
    new NumberParser(),
    new ArithmeticOperatorParser(),
    new ComparisonOperatorParser(),
    new ParenthesisParser(),
  ];

  parse(source: string): Array<IToken<string | number>> {
    const tokens = [];
    let cursor = 0;

    while (source[cursor] !== undefined) {
      for (let i = 0; i < this.parsers.length; i++) {
        const parser = this.parsers[i];

        try {
          if (parser.guard(source[cursor])) {
            const token = parser.invoke(cursor, source);

            if (token !== null) {
              cursor = token.endPosition + 1;
              tokens.push(token);
            } else {
              // TODO Add better error throw
              LexerAnalyzer.throwParseError();
            }
          }
        } catch (e) {
          console.error('Lexical error', e);
        }
      }
    }

    return tokens;
  }

  static throwParseError() {
    throw Error();
  }
}
