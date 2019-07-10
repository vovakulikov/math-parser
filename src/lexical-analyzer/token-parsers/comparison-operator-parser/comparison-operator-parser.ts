import { ITokenParser } from "../parser";
import { IToken, TokenType } from "../../token";

class ComparisonOperatorParser implements ITokenParser<string> {

  operators: { [key: string]: TokenType} = {
    '>': TokenType.greaterThan,
    '>=': TokenType.greatherThanOrEqual,
    '<': TokenType.lessThan,
    '<=': TokenType.lessThanOrEqual,
    '=': TokenType.assign,
    '==': TokenType.equal,
  };

  guard(character: string) {
    return this.operators[character] !== undefined;
  }

  invoke(startPosition: number, source: string): IToken<string> {
    let cursor = startPosition;
    let possibleToken = source[cursor];
    let tokenType = this.operators[possibleToken];

    while(this.guard(possibleToken)) {
      cursor++;
      possibleToken += source[cursor];
      tokenType = this.operators[possibleToken];
    }

    return {
      type: tokenType,
      value: possibleToken,
      startPosition: startPosition,
      endPosition: startPosition + possibleToken.length
    }

  }
}

export default ComparisonOperatorParser;
