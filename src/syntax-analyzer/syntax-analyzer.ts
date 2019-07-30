
enum TypeSymbol {
  Terminal,
  NonTerminal,
}

type RawGrammar = {
  [key: string]: Array<string>
}

type Vocabulary = Array<ReturnType<typeof VT> | ReturnType<typeof VN>>;
type Grammar = Map<ReturnType<typeof VN>, Array<Array<Vocabulary>>>;


// Terminal symbol
const VT = (value: string) => ({ type: TypeSymbol.Terminal, value });

// Non-terminal symbols
const VN = (value: string) => ({ type: TypeSymbol.NonTerminal, value });

const grammar = {
  'S': ['- B'],
  'B': ['T', 'B & T'],
  'T': ['J', 'T ^ J'],
  'J': ['( B )', 'p']
};

class SyntaxAnalyzer {

  vt: Set<string> = new Set();
  vn: Set<string> = new Set();

  rules: Grammar = new Map();


  constructor(vt: Set<string>, vn: Set<string>, rawRules: RawGrammar, finalNT: string) {
    this.vt = vt;
    this.vn = vn;
  }
}
