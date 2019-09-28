
type Func<A, R = unknown> = (...args: Array<A>) => R;

type Options<A> = {
  keySelector: (args: Array<A>) => unknown;
}

// By default key selector just return first argument of function which pass for memo
const initialOptions: Options<unknown> = {
  keySelector: (args: Array<unknown>) => args[0]
};

// TODO [VK] Improve types for arguments of func
export default <ReturnType, Arguments>(fn: Func<Arguments, ReturnType>, options?: Options<Arguments>) => {
  const normalizedOptions = { ...initialOptions, ...options };
  const cache = new Map();

  return (...args: Array<Arguments>): ReturnType => {
    const key = normalizedOptions.keySelector(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(null, args);

    cache.set(key, result);

    return result;
  }
}
