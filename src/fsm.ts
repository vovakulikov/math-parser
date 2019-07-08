export type FSMResult<T> = {
  successfullyDisassembled: boolean;
  cursor: number;
  lastState: T | null
};

export type Transition<S, A> = {
  to: S;
  byCondition?: (input: A) => boolean;
}
export type TransitionMap<S extends number> = {
  [key in S]: Array<Transition<S, string>>
};

class FiniteStateMachine<S extends number, A extends string> {
  constructor(
    private initialState: S,
    private acceptingStates: Set<S>,
    private transition: TransitionMap<S>,
    private errorState: S) {}

  run(source: A): FSMResult<S> {
    let currentState = this.initialState;
    let nextState = null;
    let i = 0;

    while (source[i] !== undefined) {
      const character = source[i];

      nextState = this.next(currentState, character);

      if (nextState === this.errorState) {
        break;
      }

      // shift to next character at source string
      currentState = nextState;
      i++;
    }

    return {
      successfullyDisassembled: this.acceptingStates.has(currentState),
      // if we got a error state we need get prev index
      // for correct get a end border of token
      cursor: nextState !== null ? i - 1 : i,
      lastState: nextState
    }
  }

  next(currentState: S, input: string): S {
    const possibleTransitions = this.transition[currentState];

    if (possibleTransitions !== undefined) {
      const transition = possibleTransitions.find((transition) => {
        if (transition.byCondition !== undefined) {
          return transition.byCondition(input);
        }

        return true;
      });

      return transition !== undefined ? transition.to : this.errorState;
    }

    return this.errorState;
  }
}

export default FiniteStateMachine;
