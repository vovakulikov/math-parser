
export type TokenTypeKeys = keyof typeof TokenType;
export enum TokenType {
  number = 'number',
  keyword = 'keyword',
  operator = 'operator',
  function = 'function',
  identifier = 'identifier',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  lessThan = 'lessThan',
  rightParenthesis = 'rightParenthesis',
  leftParenthesis = 'leftParenthesis',
  lessThanOrEqual = 'lessThanOrEqual',
  assign = 'assign',
  equal = 'equal',
}

export interface IToken<T = string> {
  type: TokenType;
  value: T;
  startPosition: number;
  endPosition: number;
}
