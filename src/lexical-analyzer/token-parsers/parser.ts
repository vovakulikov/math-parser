import { IToken } from "../token";

export interface ITokenParser<T = string> {
  guard(character: T): boolean;
  invoke(startPosition: number, source: T): IToken | null;
}
