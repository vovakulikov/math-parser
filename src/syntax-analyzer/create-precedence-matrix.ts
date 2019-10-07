import {
  BOF,
  CornerTerminals,
  EOF,
  IGrammar,
  ITerminal,
  ITypeSymbol,
  IVocabulary } from "./types";

export enum Relation {
  Base,
  Prev,
  Next,
  None
}

export type PrecedenceMatrix = {
  [key: string]: PrecedenceMatrixColumn
}

export type PrecedenceMatrixColumn = {
  [key: string]: Relation
}

type IMatrixFiller = (rule: Array<IVocabulary>, cursor: number,  cornerTerminals: CornerTerminals) => PrecedenceMatrix;

export default (terminals: Array<ITerminal>, rules: IGrammar, cornerTerminals: CornerTerminals) => {
  let matrix = getInitMatrix(terminals);

  // go through all syntax shift rules
  for (let i = 0; i < rules.length; i++) {
    const currentProductionRules = rules[i].right;

    // go through all syntax rules for current non terminal
    for (let j = 0; j < currentProductionRules.length; j++) {
      const currentRule = currentProductionRules[j];

      // go through all symbols in rule
      for (let cursor = 0; cursor < currentRule.length; cursor++) {
        // Fill matrix by symbols relation
        matrix = matrixFillers
          .reduce(
            (matrix, filler) => mergeMatrix(matrix, filler(currentRule, cursor, cornerTerminals)),
            matrix
          );
      }
    }
  }

  return matrix;
}

function getInitMatrix(elements: Array<ITerminal>) {
  // Insert BOF row in matrix (EOF will be insert as column at matrix fillers)
  return [BOF, ...elements].reduce((matrix, element) => {

    matrix[element.value] = elements.reduce((memo, element) => {
      memo[element.value] =  Relation.None;

      return memo;
    }, <PrecedenceMatrixColumn>{});

    return matrix;
  }, <PrecedenceMatrix>{});
}

const createNextElementsMatrix: IMatrixFiller = (rule, cursor, cornerTerminals) => {
  const currentSymbol = rule[cursor];
  const nextSymbol = rule[cursor + 1];
  const matrix = <PrecedenceMatrix>{
    [currentSymbol.value]: {}
  };

  if (!isType(currentSymbol, ITypeSymbol.Terminal)) {
    return {};
  }

  if (nextSymbol != undefined) {
    const cornersTerminalOfSymbol = cornerTerminals.get(nextSymbol.value);
    const rightSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.leftElements : [];

    for (let s = 0; s < rightSymbols.length; s++) {
      const currentRightSymbol = rightSymbols[s];

      matrix[currentSymbol.value][currentRightSymbol.value] =  Relation.Prev;
    }
  }

  return matrix;
};

const createPreviousElementsMatrix: IMatrixFiller = (rule, cursor, cornerTerminals) => {
  const matrix = <PrecedenceMatrix>{};
  const currentSymbol = rule[cursor];
  const prevSymbol = rule[cursor - 1];

  if (!isType(currentSymbol, ITypeSymbol.Terminal)) {
    return {};
  }

  if (prevSymbol != undefined) {
    const cornersTerminalOfSymbol = cornerTerminals.get(prevSymbol.value);
    const leftSymbols = cornersTerminalOfSymbol != undefined ? cornersTerminalOfSymbol.rightElements : [];

    for (let s = 0; s < leftSymbols.length; s++) {
      const currentCornerSymbol = leftSymbols[s];

      matrix[currentCornerSymbol.value] = {
        [currentSymbol.value]: Relation.Next
      };
    }
  }

  return matrix;
};

const createBaseElementsMatrix: IMatrixFiller = (rule, cursor, cornerTerminals) => {
  const currentSymbol = rule[cursor];
  const nextSymbol = rule[cursor + 1];
  const secondSymbolAHead = rule[cursor + 2];
  const matrix = <PrecedenceMatrix>{ [currentSymbol.value]: {} };

  if (!isType(currentSymbol, ITypeSymbol.Terminal)) {
    return {};
  }

  if (nextSymbol != undefined && nextSymbol.type == ITypeSymbol.Terminal) {
    const row = matrix[currentSymbol.value];

    matrix[currentSymbol.value] = row != undefined ? row : {};
    matrix[currentSymbol.value][nextSymbol.value] =  Relation.Base;
  }

  if (isType(nextSymbol, ITypeSymbol.NonTerminal) && isType(secondSymbolAHead, ITypeSymbol.Terminal)) {
    matrix[currentSymbol.value][secondSymbolAHead.value] = Relation.Base;
  }

  return matrix;
};

const bofAndEofFiller:IMatrixFiller = (rule, cursor, cornerTerminals) => {
  const isFirst = cursor === 0;
  const currentSymbol = rule[cursor];
  const matrix = <PrecedenceMatrix>{ [BOF.value]: {}};
  const isLast = cursor === rule.length - 1;

  if (isFirst && isType(currentSymbol, ITypeSymbol.Terminal)) {
    matrix[BOF.value][currentSymbol.value] = Relation.Prev;
  }

  if (isLast) {
    const lastTerminal = [...rule]
      .reverse()
      .find(symbol => isType(symbol, ITypeSymbol.Terminal));

    if (lastTerminal != undefined) {
      matrix[lastTerminal.value] = {
        [EOF.value]: Relation.Next
      };
    }
  }

  return matrix;
};

const matrixFillers = [
  createPreviousElementsMatrix,
  createNextElementsMatrix,
  createBaseElementsMatrix,
  bofAndEofFiller,
];

const isType = (symbol: IVocabulary, type: ITypeSymbol) => symbol != undefined && symbol.type === type;

function mergeMatrix(first: PrecedenceMatrix, second: PrecedenceMatrix): PrecedenceMatrix {
  const mergedMatrix = <PrecedenceMatrix>{};
  const keys = Object.keys({...first, ...second});

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    mergedMatrix[key] = { ...first[key], ...second[key] };
  }

  return mergedMatrix;
}
