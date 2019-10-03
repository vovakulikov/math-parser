import { PrecedenceMatrix } from "./create-precedence-matrix";
import { IToken } from "../lexical-analyzer/token";
import { Rule, Terminal, TerminalType, Vocabulary } from "./types";

type IOptions = {
  precedenceMatrix: PrecedenceMatrix,
  tokens: Array<IToken>,
  rules: Array<Rule>,
};

function findRule(symbols: Array<Vocabulary>): Rule {

}

export default ({ precedenceMatrix, tokens, rules} : IOptions) => {
  const lexems = tokens.map(token => Terminal(token.value));
  // TODO [VK] added beginOFChain Symbol and EOF symbol
  const stack = [];

  while (lexems.length > 0) {
    const isFirstSymbol = stack.length === 0;
    const nextToken = lexems.shift() as TerminalType;

    if (isFirstSymbol) {
      stack.push(nextToken);
      continue;
    }

    const relation = precedenceMatrix.get(nextToken.value).get()
  }
}
