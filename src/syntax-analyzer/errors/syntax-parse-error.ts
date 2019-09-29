
class SyntaxParseError extends Error {
  name: string;
  message: string;
  stack: string | undefined;

  constructor(message: string) {
    super(message);

    // This problem with error and transpile to es5 by tsc
    Object.setPrototypeOf(this, SyntaxParseError.prototype);

    this.name = this.constructor.name;
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

export default SyntaxParseError;
