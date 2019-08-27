import memo from './memo';

enum TypeSymbol {
  Terminal,
  NonTerminal,
}

type Vocabulary = ReturnType<typeof VT> | ReturnType<typeof VN>;

type Rule = {
  left: ReturnType<typeof VN>,
  right: Array<Array<Vocabulary>>
}

type Grammar = Array<Rule>;

// Terminal symbol
export const VT = (value: string) => ({ type: TypeSymbol.Terminal, value });

// Non-terminal symbols
export const VN = (value: string) => ({ type: TypeSymbol.NonTerminal, value });

const  grammarString = `
S => -B
B => T | B & T
T => J | T ^ J
J => ( B ) | p
`;

type AnalyzerOptions = {
  vt: Set<string>,
  vn: Set<string>,
  rawRules: string,
}

type CornersTerminals = {
  [key: string]: {
    leftElements: Array<Vocabulary>,
    rightElements: Array<Vocabulary>,
  }
}

class SyntaxAnalyzer {

  vt: Set<string> = new Set();
  vn: Set<string> = new Set();

  rules: Grammar = [];


  constructor(options: AnalyzerOptions) {
    this.vt = options.vt;
    this.vn = options.vn;

    this.rules = this.parseGrammar(options.rawRules, this.vt, this.vn);
  }


  // TODO Move this to separate function or service
  parseGrammar(rules: string, vt: Set<string>, vn: Set<string>): Grammar {
    return rules
      .split('\n')
      .filter(str => str.trim().length)
      .map((rule) => this.parseGrammarRule(rule, vt, vn));
  }


  private parseGrammarRule(rule: string, vt: Set<string>, vn: Set<string>): Rule {
    const [left, right] = rule.trim().split('=>');
    const rules = right.trim().split('|')
      .map((rule) => {
        // Split by space (grammar string should has lexems separeted by space)
        return rule.trim()
          .split(' ')
          .map((lex) => {

            if (vt.has(lex)) {
              return VT(lex);
            }

            if (vn.has(lex)) {
              return VN(lex);
            }

            throw Error('Unsupported lex in grammar string');
          });
      });

    return { left: VN(left.trim()), right: rules };
  }


  getCornerTerminalSets(): CornersTerminals {
    const resultSets: CornersTerminals = {};

    for (let i = 0; i < this.rules.length; i++) {
      const currentProcessedElement = this.rules[i].left;

      resultSets[currentProcessedElement.value] = {
        leftElements: [...this.getLeftSet(currentProcessedElement).values()],
        rightElements: [...this.getRightSet(currentProcessedElement).values()],
      }
    }

    return resultSets;
  }
  // Get all left corner terminal symbols at grammar
  // Memo just need for escape search sets element at grammar what we already searched
  // This is Lt(U) set if speak by academic language
  private getLeftSet = memo<Map<String, Vocabulary>, ReturnType<typeof VN>>((element: ReturnType<typeof VN>) => {
    const rule = this.rules.find((rule) => rule.left.value == element.value);
    let leftElements = new Map<String, Vocabulary>();

    if (rule == null) {
      // TODO Added custom error of none find element of rule
      throw Error();
    }

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      const leftElement = currentRule[0];

      if (this.vn.has(leftElement.value)) {
        // Get left element of rule

        const innerElements = leftElement.value !== rule.left.value
          ? this.getLeftSet(leftElement)
          : [];

        const nextTerminal = currentRule
          .find((symbol) => this.vt.has(symbol.value));

        if (nextTerminal != null && !leftElements.has(nextTerminal.value)) {
          leftElements.set(nextTerminal.value, nextTerminal);
        }

        // Add inner elements into result array
        leftElements = new Map<String, Vocabulary>([...leftElements, ...innerElements]);
      } else {
        leftElements.set(leftElement.value, leftElement);
      }
    }

    return leftElements;
  }, { keySelector: (element: Array<ReturnType<typeof VN>>) => element[0].value});

  private getRightSet = memo<Map<String, Vocabulary>, ReturnType<typeof VN>>((element: ReturnType<typeof VN>) => {
    const rule = this.rules.find((rule) => rule.left.value === element.value);
    let rightElements = new Map<String, Vocabulary>();

    if (rule == null) {
      // TODO Added custom error of none find element of rule
      throw Error();
    }

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      // Get right element of rule
      const rightElement = currentRule[currentRule.length - 1];

      if (this.vn.has(rightElement.value)) {
        // Just
        const innerElements = rightElement.value !== rule.left.value
          ? this.getRightSet(rightElement)
          : new Map();
        const nextTerminal = currentRule
          .reverse()
          .find((symbol) => this.vt.has(symbol.value));

        if (nextTerminal != null && !rightElements.has(nextTerminal.value)) {
          rightElements.set(nextTerminal.value, nextTerminal);
        }

        // Add inner elements into result array
        rightElements = new Map([...rightElements, ...innerElements])
      } else {
        rightElements.set(rightElement.value, rightElement);
      }
    }

    return rightElements;
  }, { keySelector: (element: Array<ReturnType<typeof VN>>) => element[0].value});

}

export default SyntaxAnalyzer;
