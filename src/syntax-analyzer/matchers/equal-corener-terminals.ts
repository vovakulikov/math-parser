import { CornerTerminals, IVocabulary } from "../types";
import CustomMatcherResult = jest.CustomMatcherResult;

declare global {
  namespace jest {
    interface Matchers<R> {
      includeSameCornerTerminals(actual: CornerTerminals): R;
    }
  }
}

const getValues = (symbols: Array<IVocabulary>) => symbols.map(s => s.value);

export default (received: CornerTerminals, actual: CornerTerminals): CustomMatcherResult => {
  const receivedKeys = [...received.keys()];
  const actualKeys = [...actual.keys()];

  expect(receivedKeys).toIncludeSameMembers(actualKeys);

  for (let index = 0; index < receivedKeys.length; index++) {
    const key = receivedKeys[index];
    const expectValue = received.get(key);
    const actualValue = actual.get(key);

    if (expectValue == undefined || actualValue == undefined) {
      // TODO [VK] Write more information message about fail check
      return { pass: false, message: 'One of key has nullable value' };
    }

    try {
      expect(getValues(actualValue.rightElements))
        .toIncludeSameMembers(getValues(expectValue.rightElements));

      expect(getValues(actualValue.leftElements))
        .toIncludeSameMembers(getValues(expectValue.leftElements));
    } catch (e) {

      throw e;
    }

  }

  return { pass: true, message: 'CornerTerminals is equal' };
}
