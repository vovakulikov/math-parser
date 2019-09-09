
export enum TypeSymbol {
  Terminal,
  NonTerminal,
}

export type TerminalType = ReturnType<typeof Terminal>;
export type NonTerminalType = ReturnType<typeof NonTerminal>;

export type Vocabulary = TerminalType | NonTerminalType;

export type Grammar = Array<Rule>;

export type Rule = {
  left: NonTerminalType,
  right: Array<Array<Vocabulary>>
}

export const Terminal = (value: string) => ({ type: TypeSymbol.Terminal, value });
export const NonTerminal = (value: string) => ({ type: TypeSymbol.NonTerminal, value });
