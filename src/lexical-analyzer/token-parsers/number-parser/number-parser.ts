import { IToken, TokenType } from "../../token";
import { isCharacter, isDigit } from "../checkers";
import { ITokenParser } from "../parser";
import FiniteStateMachine, { FSMResult, TransitionMap } from "../../../utils/fsm";
import LexicalError from "../../errors/lexical-error";

enum States {
  Initial,
  Integer,
  BeginNumberWithFractionalPart,
  BeginNumberWithExponent,
  NumberWithFractionalPart,
  NumberWithExponent,
  BeginNumberWithSignedExponent,
  NoNextState,
}

export const transitions: TransitionMap<States> = {
  [States.Initial]: [
    { to: States.Integer, byCondition: isDigit },
    { to: States.NoNextState }
  ],
  [States.Integer]: [
    { to: States.Integer, byCondition: isDigit },
    { to: States.BeginNumberWithFractionalPart, byCondition: isCharacter('.') },
    { to: States.BeginNumberWithExponent, byCondition: isCharacter('e') },
    { to: States.NoNextState }
  ],
  [States.BeginNumberWithFractionalPart]: [
    { to: States.NumberWithFractionalPart, byCondition: isDigit },
    { to: States.NoNextState }
  ],
  [States.NumberWithFractionalPart]: [
    { to: States.NumberWithFractionalPart, byCondition: isDigit },
    { to: States.BeginNumberWithExponent, byCondition: isCharacter('e') },
    { to: States.NoNextState }
  ],
  [States.BeginNumberWithExponent]: [
    {
      to: States.BeginNumberWithSignedExponent,
      byCondition: (char: string) => isCharacter('+')(char) || isCharacter('-')(char)
    },
    { to: States.NumberWithExponent, byCondition: isDigit },
    { to: States.NoNextState }
  ],
  [States.BeginNumberWithSignedExponent]: [
    { to: States.NumberWithExponent, byCondition: isDigit },
    { to: States.NoNextState }
  ],
  [States.NumberWithExponent]: [
    { to: States.NumberWithExponent, byCondition: isDigit },
    { to: States.NoNextState }
  ],
  [States.NoNextState]: []
};

export class NumberParserError extends LexicalError {
  constructor(startPosition: number, source: string, parsedResult: FSMResult<States>) {
    super(`Invalid number format ${source.slice(startPosition, parsedResult.cursor + 1)}`);

    // This problem with error and transpile to es5 by tsc
    Object.setPrototypeOf(this, NumberParserError.prototype);
  }
}

// Number parser
class NumberParser implements ITokenParser<number> {

  guard = (character: string) => isDigit(character);

  invoke(startPosition: number, source: string): IToken<number> | null {
    const fsmParser = new FiniteStateMachine(
      States.Initial,
      new Set([ States.Integer, States.NumberWithExponent, States.NumberWithFractionalPart ]),
      transitions,
      States.NoNextState
    );

    const parsedResult = fsmParser.run(source.slice(startPosition));

    if (parsedResult.successfullyDisassembled) {
      return {
        value: +source.slice(startPosition, startPosition + parsedResult.cursor),
        type: TokenType.number,
        startPosition,
        endPosition: startPosition + parsedResult.cursor
      }
    } else {
      throw new NumberParserError(startPosition, source, parsedResult);
    }
  }
}

export default NumberParser;
