import { ITokenParser } from "../parser";
import { IToken, TokenType } from "../../token";

class ArithmeticOperatorParser implements ITokenParser<string> {

  private operators = ['+', '*', '/', '-', '^'];

  guard(character: string) { return this.operators.indexOf(character) !== -1; }

  invoke(startPosition: number, source: string): IToken {
    const token = source.slice(startPosition, startPosition + 1);

    return {
      type: TokenType.operator,
      value: token,
      startPosition,
      endPosition: startPosition + token.length
    };
  }
}

export default ArithmeticOperatorParser;
