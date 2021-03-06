import memo from '../utils/memo';
import { CornerTerminals, IGrammar, INonTerminal, IRule, ITerminal, ITypeSymbol } from "./types";
import SyntaxParseError from "./errors/syntax-parse-error";

class SyntaxAnalyzer {

  constructor(public rules: IGrammar) {}

  static getUniqElementKey = (args: Array<INonTerminal>) => args[0].value;

  // TODO [VK] Added new data structure for store IVocabulary elements
  getCornerTerminalSets(): CornerTerminals {
    return this.rules.reduce<CornerTerminals>((result, rule) => {
      const currentProcessedElement = rule.left;

      result.set(currentProcessedElement.value, {
        leftElements: [...this.getLeftSet(currentProcessedElement).values()],
        rightElements: [...this.getRightSet(currentProcessedElement).values()],
      });

      return result;
    }, new Map());
  }

  // Get all left corner terminal symbols at grammar
  // Memo just need for escape search sets element at grammar what we already searched
  // This is LT(U) set
  private getLeftSet = memo<Map<String, ITerminal>, INonTerminal>((element: INonTerminal) => {
    const rule = this.getRuleByElement(element);
    let leftElements = new Map<String, ITerminal>();

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      const leftElement = currentRule[0];

      if (leftElement.type === ITypeSymbol.NonTerminal) {
        const innerElements = leftElement.value !== rule.left.value
          ? this.getLeftSet(leftElement)
          : [];

        const nextTerminal = currentRule
          .find((symbol) => symbol.type === ITypeSymbol.Terminal);

        if (nextTerminal != null && !leftElements.has(nextTerminal.value)) {
          leftElements.set(nextTerminal.value, <ITerminal>nextTerminal);
        }

        leftElements = new Map([...leftElements, ...innerElements]);
      } else {
        leftElements.set(leftElement.value, leftElement);
      }
    }

    return leftElements;
  }, { keySelector: SyntaxAnalyzer.getUniqElementKey });

  private getRightSet = memo<Map<String, ITerminal>, INonTerminal>((element: INonTerminal) => {
    const rule = this.getRuleByElement(element);
    let rightElements = new Map<String, ITerminal>();

    for (let i = 0; i < rule.right.length; i++) {
      const currentRule = rule.right[i];
      const rightElement = currentRule[currentRule.length - 1];

      if (rightElement.type === ITypeSymbol.NonTerminal) {
        const innerElements = rightElement.value !== rule.left.value
          ? this.getRightSet(rightElement)
          : new Map();
        const nextTerminal = currentRule
          .concat()
          .reverse()
          .find((symbol) => symbol.type === ITypeSymbol.Terminal);

        if (nextTerminal != null && !rightElements.has(nextTerminal.value)) {
          rightElements.set(nextTerminal.value, <ITerminal>nextTerminal);
        }

        // Add inner elements into result array
        rightElements = new Map([...rightElements, ...innerElements])
      } else {
        rightElements.set(rightElement.value, rightElement);
      }
    }

    return rightElements;
  }, { keySelector: SyntaxAnalyzer.getUniqElementKey });

  private getRuleByElement(element: INonTerminal): IRule {
    const rule = this.rules.find((rule) => rule.left.value === element.value);

    if (rule == undefined) {
      throw new SyntaxParseError(`do not find current rule for ${element.value}`);
    }

    return rule;
  }

}

export default SyntaxAnalyzer;
