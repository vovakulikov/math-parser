import IdentifierParser from './identifier-parser';
import { ITokenParser } from "../parser";
import { TokenType } from "../../token";

describe('Pareser guard ',() => {

  let parser: ITokenParser;

  beforeAll(() => {
    parser = new IdentifierParser();
  });

  test('should correct check alphabetic character', () => {
    expect(parser.guard('a')).toBeTruthy();
  });

  test('should correct work with forbidden character "-"', () => {
    expect(parser.guard('-')).toBeFalsy();
  });

  test('should correct parse simple identifier', () => {
    const token = parser.invoke(0, 'my_first_var');

    expect(token).not.toBeNull();
    expect(token && token.value).toMatch(/my_first_var/);
    expect(token && token.type).toEqual(TokenType.identifier);
  });


  test('should correct parse function identifier', () => {
    const token = parser.invoke(0, 'sin');

    expect(token).not.toBeNull();
    expect(token && token.value).toMatch(/sin/);
    expect(token && token.type).toEqual(TokenType.function);
  });

  test('should correct parse keyword identifier', () => {
    const token = parser.invoke(0, 'let');

    expect(token).not.toBeNull();
    expect(token && token.value).toMatch(/let/);
    expect(token && token.type).toEqual(TokenType.keyword);
  });
});
