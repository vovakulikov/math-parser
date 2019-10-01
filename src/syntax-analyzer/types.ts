
export enum TypeSymbol {
  Terminal,
  NonTerminal,
}

export type TerminalType = { type: TypeSymbol.Terminal, value: string };
export type NonTerminalType = { type: TypeSymbol.NonTerminal, value: string };

export type Vocabulary = TerminalType | NonTerminalType;

export type Grammar = Array<Rule>;

export type Rule = {
  left: NonTerminalType,
  right: RuleSet
}

export type RuleSet = Array<Array<Vocabulary>>;

export type CornerTerminals = Map<string, {
  leftElements: Array<TerminalType>,
  rightElements: Array<TerminalType>,
}>;

export const Terminal = (value: string): TerminalType => ({ type: TypeSymbol.Terminal, value });
export const NonTerminal = (value: string): NonTerminalType => ({ type: TypeSymbol.NonTerminal, value });
