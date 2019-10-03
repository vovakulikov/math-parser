import { IGrammar, IRule, createNonTerminal, createTerminal } from "./types";

// TODO [VK] Make parsing syntax gramma more flexible
// const Options = {
//   rulePartSeparator: '=>',
//   separator: '|',
//   ruleSeparator: '\n',
// };

const parseGrammarRule = (rawRule: string, terminals: Set<string>, nonTerminals: Set<string>): IRule => {
  const [left, right] = rawRule.trim().split('=>');
  const rules = right
    .trim()
    .split('|')
    .map((rule) => {
      // Split by space (grammar string should has lexems separated by space)
      return rule.trim()
        .split(' ')
        .map((lex: string) => {

          if (terminals.has(lex)) {
            return createTerminal(lex);
          }

          if (nonTerminals.has(lex)) {
            return createNonTerminal(lex);
          }

          throw Error('Unsupported lex in grammar string');
        });
    });

  return { left: createNonTerminal(left.trim()), right: rules };
};

export type AnalyzerOptions = {
  terminals: Set<string>,
  nonTerminals: Set<string>,
  grammarString: string,
}

export default (options: AnalyzerOptions ): IGrammar => {
  return options.grammarString
    .split('\n')
    .filter(str => str.trim().length)
    .map((rule) => parseGrammarRule(rule, options.terminals, options.nonTerminals));
};
