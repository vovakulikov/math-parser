import { IExtendedVocabulary, ITypeSymbol } from "./types";

export const isType = (symbol: IExtendedVocabulary, type: ITypeSymbol) => symbol != undefined && symbol.type === type;
