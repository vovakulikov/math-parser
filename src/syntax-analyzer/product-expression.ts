import { PrecedenceMatrix } from "./create-precedence-matrix";
import { IToken } from "../lexical-analyzer/token";
import { IRule, createTerminal, ITerminal, IVocabulary, BOF, EOF } from "./types";

type IOptions = {
  precedenceMatrix: PrecedenceMatrix,
  tokens: Array<IToken>,
  rules: Array<IRule>,
};

function findRule(symbols: Array<IVocabulary>): IRule {

}

export default ({ precedenceMatrix, tokens, rules} : IOptions) => {
  const terminals = tokens.map(token => createTerminal(token.value));
  const queueTokens = [...terminals, EOF];
  const stack = [BOF];

  while (queueTokens.length > 0) {
    const nextToken = queueTokens.shift() as ITerminal;
    const relation = precedenceMatrix[nextToken.value][];
  }
}
