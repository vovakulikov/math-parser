import { ITokenParser } from "../parser";
import { IToken, TokenType } from "../../token";

class ArithmeticOperatorParser implements ITokenParser {

  private operators = ['+', '*', '/', '-', '^'];

  guard(character: string) { return this.operators.indexOf(character) !== -1; }

  invoke(startPosition: number, source: string): IToken {
    return {
      type: TokenType.operator,
      value: source.slice(startPosition, startPosition + 1),
      startPosition,
      endPosition: startPosition + 1
    };
  }
}

export default ArithmeticOperatorParser;
