import { ITokenParser } from "../parser";
import { IToken, TokenType } from "../../token";

class ParenthesisParser implements ITokenParser<string> {
  guard(character: string) {
    return character === ')' || character === '(';
  }

  invoke(startPosition: number, source: string): IToken {
    const value = source.slice(startPosition, startPosition + 1);

    return {
      value: value,
      startPosition: startPosition,
      endPosition: startPosition + 1,
      type: value === '(' ? TokenType.leftParenthesis : TokenType.rightParenthesis
    }
  }
}

export default ParenthesisParser;
