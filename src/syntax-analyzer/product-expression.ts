import { PrecedenceMatrix } from "./create-precedence-matrix";
import { IToken } from "../lexical-analyzer/token";
import { IRule, createTerminal, ITerminal, IVocabulary } from "./types";

type IOptions = {
  precedenceMatrix: PrecedenceMatrix,
  tokens: Array<IToken>,
  rules: Array<IRule>,
};

function findRule(symbols: Array<IVocabulary>): IRule {

}

export default ({ precedenceMatrix, tokens, rules} : IOptions) => {
  const lexems = tokens.map(token => createTerminal(token.value));
  // TODO [VK] added beginOFChain Symbol and EOF symbol
  const stack = [];

  while (lexems.length > 0) {
    const isFirstSymbol = stack.length === 0;
    const nextToken = lexems.shift() as ITerminal;

    if (isFirstSymbol) {
      stack.push(nextToken);
      continue;
    }

    const relation = precedenceMatrix.get(nextToken.value)
  }
}
