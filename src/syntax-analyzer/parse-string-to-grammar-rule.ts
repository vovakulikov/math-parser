import { Grammar, Rule, NonTerminal, Terminal } from "./types";

const Options = {
  rulePartSeparator: '=>',
  separator: '|',
  ruleSeparator: '\n',
};

const parseGrammarRule = (rule: string, terminals: Set<string>, nonTerminals: Set<string>): Rule => {
  const [left, right] = rule.trim().split('=>');
  const rules = right.trim().split('|')
    .map((rule) => {
      // Split by space (grammar string should has lexems separeted by space)
      return rule.trim()
        .split(' ')
        .map((lex) => {

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

export default (rules: string, terminals: Set<string>, nonTerminals: Set<string>): Grammar => {
  return rules
    .split('\n')
    .filter(str => str.trim().length)
    .map((rule) => parseGrammarRule(rule, terminals, nonTerminals));
};
