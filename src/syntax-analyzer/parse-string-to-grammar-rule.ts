import { Grammar, Rule, NonTerminal, Terminal } from "./types";

// TODO [VK] Make parsing syntax gramma more flexible
// const Options = {
//   rulePartSeparator: '=>',
//   separator: '|',
//   ruleSeparator: '\n',
// };

const parseGrammarRule = (rawRule: string, terminals: Set<string>, nonTerminals: Set<string>): Rule => {
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
            return Terminal(lex);
          }

          if (nonTerminals.has(lex)) {
            return NonTerminal(lex);
          }

          throw Error('Unsupported lex in grammar string');
        });
    });

  return { left: NonTerminal(left.trim()), right: rules };
};

export type AnalyzerOptions = {
  terminals: Set<string>,
  nonTerminals: Set<string>,
  grammarString: string,
}

export default (options: AnalyzerOptions ): Grammar => {
  return options.grammarString
    .split('\n')
    .filter(str => str.trim().length)
    .map((rule) => parseGrammarRule(rule, options.terminals, options.nonTerminals));
};
