import { ITokenParser } from "./token-parsers/parser";
import { IToken } from "./token";
import NumberParser from './token-parsers/number-parser/number-parser';
import ArithmeticOperatorParser from './token-parsers/arithmetic-operator-parser/arithmetic-operator-parser';
import IdentifierParser from "./token-parsers/identifier-parser/identifier-parser";
import ComparisonOperatorParser from "./token-parsers/comparison-operator-parser/comparison-operator-parser";
import ParenthesisParser from "./token-parsers/parenthesis-parser/parenthesis-parser";
import LexicalError from "./errors/lexical-error";

// TODO [VK] Try rewrite this part by combination of parsers
class LexerAnalyzer {
  parsers: Array<ITokenParser<string | number>> = [
    new NumberParser(),
    new IdentifierParser(),
    new ArithmeticOperatorParser(),
    new ComparisonOperatorParser(),
    new ParenthesisParser(),
  ];

  parse(source: string): Array<IToken<string | number>> {
    const tokens = [];
    let cursor = 0;

    try {
      while (source[cursor] !== undefined) {
        const token = this.invoke(cursor, source);

        if (token !== null) {
          cursor = token.endPosition;
          tokens.push(token);
        } else {
          cursor++;
        }
      }
    } catch (error) {
      if (error instanceof LexicalError) {
        console.error('Parse error');

        // Rethrow error to consumer code
        throw error;
      }
    }

    return tokens;
  }

  invoke(position: number, source: string): IToken<string | number> | null {
    // find a correct parser for parse next token
    for (let i = 0; i < this.parsers.length; i++) {
      const parser = this.parsers[i];

      if (parser.guard(source[position])) {
        const token = parser.invoke(position, source);

        if (token !== null) {
          return token;
        }
      }
    }

    return null;
  }
}

export default LexerAnalyzer;
