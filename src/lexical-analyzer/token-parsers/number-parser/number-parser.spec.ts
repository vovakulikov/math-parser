import NumberParser, { NumberParserError } from './number-parser';

describe('Number parser', () => {
  let parser: NumberParser;

  beforeAll(() => {
    parser = new NumberParser()
  });

  describe('guard', () => {
    test('should correct parse number character', () => {
      expect(parser.guard('3')).toBeTruthy();
    });

    test('should not parse none number character', () => {
      expect(parser.guard('a')).toBeFalsy();
    });
  });

  test('should parse simple number', () => {
    const token = parser.invoke(0, '123');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(123);
  });

  test('should parse float number', () => {
    const token = parser.invoke(0, '123.22');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(123.22);
  });

  test('should parse float number with space after', () => {
    const token = parser.invoke(0, '123.22 ');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(123.22);
  });

  test('should parse float number with space after', () => {
    const token = parser.invoke(0, '123.22 ');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(123.22);
  });

  test('should parse number with exponent', () => {
    const token = parser.invoke(0, '1e1');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(1e1);
  });

  test('should parse float number with exponent', () => {
    const token = parser.invoke(0, '1.12e1');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(1.12e1);
  });

  test('should parse float number with sign exponent', () => {
    const token = parser.invoke(0, '1.12e-1');

    expect(token).toBeTruthy();
    expect(token && token.value).toEqual(1.12e-1);
  });

  describe('should fail parse', () => {

    test('on uncorrect exponent number', () => {
      expect(() => parser.invoke(0, '1.12e'))
         .toThrowError(NumberParserError);
      expect(() => parser.invoke(0, '1.12e'))
        .toThrowError(NumberParserError);
    });
  });

});
