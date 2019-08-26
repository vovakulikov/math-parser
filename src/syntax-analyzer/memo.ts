
type Func<A, R = unknown> = (...args: Array<any>) => R;
type Options<A> = {
  keySelector: (args: Array<A>) => string | number;
}

// By default key selector just return first argument of function which pass for memo
const initialOptions: Options<any> = {
  keySelector: (args: Array<any>) => args[0]
};

export default <T, A>(fn: Func<A, T>, options?: Options<A>) => {
  const normalizedOptions = { ...initialOptions, ...options };
  const cache = new Map();

  return (...args: Array<A>) => {
    const key = normalizedOptions.keySelector(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(null, args);

    cache.set(key, result);

    return result;
  }
}
