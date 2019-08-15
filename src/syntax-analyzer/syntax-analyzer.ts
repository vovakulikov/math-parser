
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
const VT = (value: string) => ({ type: TypeSymbol.Terminal, value });

// Non-terminal symbols
const VN = (value: string) => ({ type: TypeSymbol.NonTerminal, value });

const  grammarString = `
S => -B
B => T | B & T
T => J | T ^ J
J => ( B ) | p
`;

class SyntaxAnalyzer {

  vt: Set<string> = new Set();
  vn: Set<string> = new Set();

  rules: Grammar = [];

  a: number = 5;


  constructor(vt: Set<string>, vn: Set<string>, rawRules: string) {
    this.vt = vt;
    this.vn = vn;

    // this.rules = this.parseGrammar(rawRules, vt, vn);
  }

  parseGrammar(rules: string, vt: Set<string>, vn: Set<string>): Grammar {
    return rules
      .split('\n')
      .filter(str => str.length)
      .map((rule) => this.parseGrammarRule(rule, vt, vn));
  }

  parseGrammarRule(rule: string, vt: Set<string>, vn: Set<string>): Rule {
    const [left, right] = rule.split('=>');
    const rules = right.split('|')
      .map((rule) => {
        // Split by space (grammar string should has lexems separeted by space)
        return rule
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

    return { left: VN(left), right: rules };
  }


  parseCornersSets() {}


  // Get all left corner terminal symbols at grammar
  // Memo just need for escape search sets element at grammar what we already searched
  // This is Lt(U) set if speak by academic language
  getLeftSetOf = memo<Array<Vocabulary>>((element: ReturnType<typeof VN>) => {
    const rule = this.rules.find((rule) => rule.left.value === element.value);
    const leftElements = [];

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
          ? this.getLeftSetOf(leftElement)
          : [];

        const nextTerminal = currentRule.find((symbol) => this.vt.has(symbol.value));

        if (nextTerminal != null) {
          leftElements.push(nextTerminal);
        }

        // Add inner elements into result array
        leftElements.push.apply(leftElements, innerElements);
      } else {
        leftElements.push(leftElement);
      }
    }

    return leftElements;
  });

  getRightSetOf = memo<Array<Vocabulary>>((element: ReturnType<typeof VN>) => {
    const rule = this.rules.find((rule) => rule.left.value === element.value);
    const leftElements = [];

    if (rule == null) {
      // TODO Added custom error of none find element of rule
      throw Error();
    }

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      // Get right element of rule
      const leftElement = currentRule[currentRule.length - 1];

      if (this.vn.has(leftElement.value)) {
        const innerElements = this.getRightSetOf(leftElement);
        const nextTerminal = currentRule.reverse().find((symbol) => this.vt.has(symbol.value));

        if (nextTerminal != null) {
          leftElements.push(nextTerminal);
        }

        // Add inner elements into result array
        leftElements.push.apply(leftElements, innerElements);
      } else {
        leftElements.push(leftElement);
      }
    }

    return leftElements;
  });


}
