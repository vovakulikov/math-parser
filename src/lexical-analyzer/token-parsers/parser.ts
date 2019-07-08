import { IToken } from "../token";

export interface ITokenParser<K = string, T = string> {
  guard(character: T): boolean;
  invoke(startPosition: number, source: T): IToken<K> | null;
}
