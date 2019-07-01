export const enum TokenType {
  number,
  keyword,
  operator,
  function,
  bracket,
}

export interface IToken<T = string> {
  type: TokenType;
  value: T;
  startPosition: number;
  endPosition: number;
}
