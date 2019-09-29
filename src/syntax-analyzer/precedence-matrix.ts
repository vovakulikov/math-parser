import { CornersTerminals, Grammar, RuleSet, TerminalType, TypeSymbol } from "./types";

enum Relation {
  Base,
  Prev,
  Next,
  None
}

function getInitMatrix(elements: Array<TerminalType>) {
  return elements.reduce((matrix, element) => {

    const subMatrix = elements.reduce((memo, element) => {
      memo.set(element.value, Relation.None);

      return memo;
    }, new Map<string, Relation>());

    matrix.set(element.value, subMatrix);

    return matrix;
  }, new Map<string, Map<string, Relation>>());
}

function createPrecedenceMatrix(elements: Array<TerminalType>, rules: Grammar, cornerTerminals: CornersTerminals) {
  const matrix = getInitMatrix(elements);

  // go through all syntax shift rules
  for(let i = 0; i < rules.length; i++) {
    const currentShiftRules = rules[i].right;

    // go through all syntax rules for current non terminal
    for (let j = 0; j < currentShiftRules.length; j++) {
      const currentRule = currentShiftRules[i];

      // go through all symbols in rule
      for (let k = 0; k < currentRule.length; k++) {
        // TODO [VK] Move this logic to separated functions
        const currentSymbol = currentRule[k];
        const symbolRow = matrix.get(currentSymbol.value);

        if (currentSymbol.type === TypeSymbol.NonTerminal) {
          continue;
        }

        const prevSymbol = currentRule[k - 1];
        const nextSymbol = currentRule[k + 1];

        if (nextSymbol != undefined && symbolRow != undefined) {
          const cornersTerminalOfSymbol = cornerTerminals.get(nextSymbol.value);
          const rightSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.rightElements : [];

          for (let s = 0; s < rightSymbols.length; s++) {
            const currentRightSymbol = rightSymbols[i];

            symbolRow.set(currentRightSymbol.value, Relation.Prev);
          }
        }

        if (prevSymbol != undefined) {
          const cornersTerminalOfSymbol = cornerTerminals.get(nextSymbol.value);
          const leftSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.leftElements : [];

          for (let s = 0; s < leftSymbols.length; s++) {
            const currentSymbol = leftSymbols[s];
            const currentSymbolRow = matrix.get(currentSymbol.value);

            if (currentSymbolRow != undefined) {
              currentSymbolRow.set(currentSymbol.value, Relation.Next);
            }
          }
        }

        // TODO [VK] Added process for base relation below
      }
    }
  }
}
