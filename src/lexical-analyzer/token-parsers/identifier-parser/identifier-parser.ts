import { ITokenParser } from "../parser";
import { IToken, TokenType, TokenTypeKeys } from "../../token";

type identifierTypesMap = {
  [key in TokenTypeKeys]?: Array<string>;
}

class IdentifierParser implements ITokenParser {

  identifierTypes: identifierTypesMap = {
    [TokenType.keyword]: ['var', 'const', 'let'],
    [TokenType.function]: ['sin', 'cos', 'max', 'min']
  };

  guard(character: string): boolean {
    return /\w/.test(character);
  }

  // added to stack character while we must own
  invoke(startPosition: number, source: string): IToken<string> {
    let position = startPosition;

    while (/\w/.test(source[position]) && source[position] != undefined) {
      position++;
    }

    const identifier = source.slice(startPosition, position);

    return {
      type: this.getTypeByIdentifier(identifier),
      value: identifier,
      startPosition,
      endPosition: position
    };
  }

  getTypeByIdentifier(identifier: string): TokenType {
    // explicit cast from string[] to TokenTypeKeys[]
    const allTypes = <TokenTypeKeys[]>Object.keys(this.identifierTypes);
    const currentType = allTypes.find((type) => {
      const possibleIdentifiers = this.identifierTypes[type];

      return possibleIdentifiers !== undefined
        ? possibleIdentifiers.indexOf(identifier) !== -1
        : false
    });

    return currentType != undefined
      ? TokenType[currentType]
      : TokenType.identifier;
  }
}


export default IdentifierParser;
