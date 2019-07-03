
export type TokenTypeKeys = keyof typeof TokenType;
export enum TokenType {
  number = 'number',
  keyword = 'keyword',
  operator = 'operator',
  function = 'function',
  bracket = 'bracket',
  identifier = 'identifier',
}

export interface IToken<T = string> {
  type: TokenType;
  value: T;
  startPosition: number;
  endPosition: number;
}
