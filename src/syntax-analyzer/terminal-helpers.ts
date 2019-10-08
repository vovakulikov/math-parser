import { ITypeSymbol, IVocabulary } from "./types";

export const isType = (symbol: IVocabulary, type: ITypeSymbol) => symbol != undefined && symbol.type === type;
