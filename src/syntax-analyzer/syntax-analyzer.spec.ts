import SyntaxAnalyzer, { VN, VT } from "./syntax-analyzer";


describe('syntax analyzer', () => {

  let syntaxAnalyzer: SyntaxAnalyzer;

  beforeAll(() => {
    const  grammarString = `
      S => - B
      B => T | B & T
      T => J | T ^ J
      J => ( B ) | p
`;

    syntaxAnalyzer = new SyntaxAnalyzer({
      vt: new Set(['-', '&', '^', '(', ')', 'p']),
      vn: new Set(['S','B','T','J',]),
      // TODO Move this to another method or function
      rawRules: grammarString
    });

  });

  test('should correct parse grammar string to vocabulary', () => {


    expect(syntaxAnalyzer.rules).toEqual([
      {
        left: VN('S'),
        right: [
          [ VT('-'), VN('B') ]
        ]
      },
      {
        left: VN('B'),
        right: [
          [ VN('T') ],
          [ VN('B'),  VT('&'), VN('T') ]]
      },
      {
        left: VN('T'),
        right: [
          [ VN('J') ],
          [ VN('T'), VT('^'), VN('J') ]
        ]
      },
      {
        left: VN('J'),
        right: [
          [ VT('('), VN('B'), VT(')') ],
          [ VT('p') ]
        ]
      }
    ]);

  });

  test('should correct find corner terminal sets', () => {
    const cornerTerminals = syntaxAnalyzer.getCornerTerminalSets();

    console.log(cornerTerminals);
    expect(cornerTerminals).toBeTruthy();
  });

});
