
type Func<R = unknown> = (...args: Array<any>) => R;
type Options = {
  keySelector: (...args: Array<unknown>) => string | number;
}

// By default key selector just return first argument of function which pass for memo
const initialOptions = {
  keySelector: (args: Array<unknown>) => args[0]
};

export default <T>(fn: Func<T>, options?: Options) => {
  const normalizedOptions = { ...initialOptions, ...options };
  const cache = new Map();

  return (...args: Array<unknown>) => {
    const key = normalizedOptions.keySelector(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(args);

    cache.set(key, result);

    return result;
  }
}
