import { ITokenParser } from "./token-parsers/parser";
import NumberParser from './token-parsers/number-parser/number-parser';

class LexerAnalyzer {
  parsers: Array<ITokenParser> = [
    new NumberParser()
  ];
}
