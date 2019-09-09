import memo from '../utils/memo';
import { Grammar, NonTerminalType, Vocabulary, Rule } from "./types";
import parseGrammar from './parse-string-to-grammar-rule';
import SyntaxParseError from "./errors/syntax-parse-error";

type AnalyzerOptions = {
  terminals: Set<string>,
  nonTerminals: Set<string>,
  rawRules: string,
}

type CornersTerminals = {
  [key: string]: {
    leftElements: Array<Vocabulary>,
    rightElements: Array<Vocabulary>,
  }
}

class SyntaxAnalyzer {

  terminals: Set<string> = new Set();
  nonTerminals: Set<string> = new Set();
  rules: Grammar = [];

  constructor(options: AnalyzerOptions) {
    this.terminals = options.terminals;
    this.nonTerminals = options.nonTerminals;

    this.rules = parseGrammar(options.rawRules, this.terminals, this.nonTerminals);
  }

  getCornerTerminalSets(): CornersTerminals {
    const resultSets: CornersTerminals = {};

    return this.rules.reduce<CornersTerminals>((result, rule) => {
      const currentProcessedElement = rule.left;

      result[currentProcessedElement.value] = {
        leftElements: [...this.getLeftSet(currentProcessedElement).values()],
        rightElements: [...this.getRightSet(currentProcessedElement).values()],
      };

      return result;
    }, {});
  }

  // Get all left corner terminal symbols at grammar
  // Memo just need for escape search sets element at grammar what we already searched
  // This is Lt(U) set if speak by academic language
  private getLeftSet = memo<Map<String, Vocabulary>, NonTerminalType>((element: NonTerminalType) => {
    const rule = this.getRuleByElement(element);
    let leftElements = new Map<String, Vocabulary>();

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      const leftElement = currentRule[0];

      if (this.nonTerminals.has(leftElement.value)) {
        // Get left element of rule

        const innerElements = leftElement.value !== rule.left.value
          ? this.getLeftSet(leftElement)
          : [];

        const nextTerminal = currentRule
          .find((symbol) => this.terminals.has(symbol.value));

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
  }, { keySelector: SyntaxAnalyzer.getUniqElementKey });

  private getRightSet = memo<Map<String, Vocabulary>, NonTerminalType>((element: NonTerminalType) => {
    const rule = this.getRuleByElement(element);
    let rightElements = new Map<String, Vocabulary>();

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      // Get right element of rule
      const rightElement = currentRule[currentRule.length - 1];

      if (this.nonTerminals.has(rightElement.value)) {
        const innerElements = rightElement.value !== rule.left.value
          ? this.getRightSet(rightElement)
          : new Map();
        const nextTerminal = currentRule
          .reverse()
          .find((symbol) => this.terminals.has(symbol.value));

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
  }, { keySelector: SyntaxAnalyzer.getUniqElementKey });

  private getRuleByElement(element: NonTerminalType): Rule {
    const rule = this.rules.find((rule) => rule.left.value === element.value);

    if (rule == undefined) {
      throw new SyntaxParseError(`do not find current rule for ${element.value}`);
    }

    return rule;
  }

  static getUniqElementKey = (element: Array<NonTerminalType>) => element[0].value;

}

export default SyntaxAnalyzer;
