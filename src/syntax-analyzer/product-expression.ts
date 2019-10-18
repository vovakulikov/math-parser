import { PrecedenceMatrix, Relation } from "./create-precedence-matrix";
import { IToken } from "../lexical-analyzer/token";
import { BOF, createTerminal, EOF, IExtendedVocabulary, IRule, ITerminal, ITypeSymbol, IVocabulary } from "./types";
import { isType } from "./terminal-helpers";

type IOptions = {
  precedenceMatrix: PrecedenceMatrix,
  tokens: Array<IToken>,
  rules: Array<IRule>,
};

function findRule(symbols: Array<IVocabulary>): IRule {

}

function getTopTerminal(stack: Array<IExtendedVocabulary>) {
  for (let index = stack.length - 1; index >= 0; index--) {
    if (isType(stack[index], ITypeSymbol.Terminal)) {
      return stack[index];
    }
  }

  return null;
}

export default ({ precedenceMatrix, tokens, rules} : IOptions) => {
  const terminals = tokens.map(token => createTerminal(token.value));
  const queueTokens = [...terminals, EOF];
  const stack = [BOF];

  while (queueTokens.length > 0) {
    const nextToken = queueTokens[0] as ITerminal;
    const topTerminal = getTopTerminal(stack);

    if (topTerminal == null) {
      continue;
    }

    const relation = precedenceMatrix[nextToken.value][topTerminal.value];

    if (relation === Relation.Base || Relation.Prev) {
      queueTokens.shift();
      stack.push(nextToken);
    }

    if (relation === Relation.Next) {
      // TODO [VK] find product rule for shift
    }
  }
}
