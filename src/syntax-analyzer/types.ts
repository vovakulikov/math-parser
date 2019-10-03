
export const enum ITypeSymbol {
  Terminal,
  NonTerminal,
  BOF,
  EOF
}

export type ITerminalType = { type: ITypeSymbol.Terminal, value: string };
export type INonTerminalType = { type: ITypeSymbol.NonTerminal, value: string };
export type IBOF = { type: ITypeSymbol.BOF };
export type IEOF = { type: ITypeSymbol.EOF };


export type IVocabulary = ITerminalType | INonTerminalType;

export type IGrammar = Array<IRule>;

export type IRule = {
  left: INonTerminalType,
  right: Array<Array<IVocabulary>>
}

export type CornerTerminals = Map<string, {
  leftElements: Array<ITerminalType>,
  rightElements: Array<ITerminalType>,
}>;

export const createTerminal = (value: string): ITerminalType => ({ type: ITypeSymbol.Terminal, value });
export const createNonTerminal = (value: string): INonTerminalType => ({ type: ITypeSymbol.NonTerminal, value });
// TODO [VK] Added unic Symbols
export const createBOF = () => ({ type: ITypeSymbol.BOF, value: '@@begin' });
export const createEOF = () => ({ type: ITypeSymbol.EOF, value: '@@end' });

