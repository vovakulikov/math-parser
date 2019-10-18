
export const enum ITypeSymbol {
  Terminal,
  NonTerminal,
  BOF,
  EOF
}

export type ITerminal = { type: ITypeSymbol.Terminal, value: string };
export type INonTerminal = { type: ITypeSymbol.NonTerminal, value: string };
export type IBOF = { type:  ITypeSymbol.BOF, value: string };
export type IEOF = { type: ITypeSymbol.EOF, value: string };

export type IVocabulary = ITerminal | INonTerminal;
export type IExtendedVocabulary = IVocabulary | IBOF | IEOF;

export type IGrammar = Array<IRule>;

export type IRule = {
  left: INonTerminal,
  right: Array<Array<IVocabulary>>
}

export type CornerTerminals = Map<string, {
  leftElements: Array<ITerminal>,
  rightElements: Array<ITerminal>,
}>;

export const createTerminal = (value: string): ITerminal => ({ type: ITypeSymbol.Terminal, value });
export const createNonTerminal = (value: string): INonTerminal => ({ type: ITypeSymbol.NonTerminal, value });

export const BOF = ({ type: ITypeSymbol.BOF, value: '@@begin' });
export const EOF = ({ type: ITypeSymbol.EOF, value: '@@end' });

