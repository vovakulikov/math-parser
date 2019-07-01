import { IToken, TokenType } from "../../token";
import FiniteStateMachine, { TransitionMap } from "../../../fsm";
import { isCharacter, isDigit } from "../checkers";
import { ITokenParser } from "../parser";

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

// Number parser
class NumberParser implements ITokenParser {

  guard = (character: string) => isDigit(character);

  invoke(startPosition: number, source: string): IToken | null {
    const fsmParser = new FiniteStateMachine(
      States.Initial,
      new Set([ States.Integer, States.NumberWithExponent, States.NumberWithFractionalPart ]),
      transitions,
      States.NoNextState
    );

    const parsedResult = fsmParser.run(source.slice(startPosition));

    if (parsedResult.successfullyDisassembled) {
      return {
        value: source.slice(startPosition, parsedResult.cursor),
        type: TokenType.number,
        startPosition,
        endPosition: parsedResult.cursor
      }
    } else {
      return null;
    }
  }
}

export default NumberParser;
