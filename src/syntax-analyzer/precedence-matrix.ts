import { CornerTerminals, Grammar, TerminalType, TypeSymbol, Vocabulary } from "./types";

export enum Relation {
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

const isCorrectType = (symbol: Vocabulary, type: TypeSymbol) => symbol != undefined && symbol.type === type;

function processNextSymbol(symbol: Vocabulary, cornerTerminals: CornerTerminals, row: Map<string, Relation>) {
  const cornersTerminalOfSymbol = cornerTerminals.get(symbol.value);
  const rightSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.rightElements : [];

  for (let s = 0; s < rightSymbols.length; s++) {
    const currentRightSymbol = rightSymbols[s];

    row.set(currentRightSymbol.value, Relation.Prev);
  }

  return row;
}

function createPrecedenceMatrix(terminals: Array<TerminalType>, rules: Grammar, cornerTerminals: CornerTerminals) {
  const matrix = getInitMatrix(terminals);

  // go through all syntax shift rules
  for (let i = 0; i < rules.length; i++) {
    const currentShiftRules = rules[i].right;

    // go through all syntax rules for current non terminal
    for (let j = 0; j < currentShiftRules.length; j++) {
      const currentRule = currentShiftRules[j];

      // go through all symbols in rule
      for (let k = 0; k < currentRule.length; k++) {
        // TODO [VK] Move this logic to separated functions
        const currentSymbol = currentRule[k];
        const symbolRow = matrix.get(currentSymbol.value);

        if (currentSymbol.type !== TypeSymbol.Terminal || symbolRow == undefined) {
          continue;
        }

        const prevSymbol = currentRule[k - 1];
        const nextSymbol = currentRule[k + 1];
        const secondSymbolAHead = currentRule[k + 2];

        if (nextSymbol != undefined) {

          if (nextSymbol.type == TypeSymbol.Terminal) {
            symbolRow.set(nextSymbol.value, Relation.Base);
          }

          const cornersTerminalOfSymbol = cornerTerminals.get(nextSymbol.value);
          const rightSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.leftElements : [];

          for (let s = 0; s < rightSymbols.length; s++) {
            const currentRightSymbol = rightSymbols[s];

            symbolRow.set(currentRightSymbol.value, Relation.Prev);
          }
        }

        if (prevSymbol != undefined) {
          const cornersTerminalOfSymbol = cornerTerminals.get(prevSymbol.value);
          const leftSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.rightElements : [];

          for (let s = 0; s < leftSymbols.length; s++) {
            const currentCornerSymbol = leftSymbols[s];
            const currentSymbolRow = matrix.get(currentCornerSymbol.value);

            if (currentSymbolRow != undefined) {
              currentSymbolRow.set(currentSymbol.value, Relation.Next);
            }
          }
        }

        if (isCorrectType(nextSymbol, TypeSymbol.NonTerminal) && isCorrectType(secondSymbolAHead, TypeSymbol.Terminal)) {
          symbolRow.set(secondSymbolAHead.value, Relation.Base);
        }
      }
    }
  }

  return matrix;
}

export default createPrecedenceMatrix;
