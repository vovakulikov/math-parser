
class LexicalError extends Error {
  name: string;
  message: string;
  stack: string | undefined;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, LexicalError.prototype);

    this.name = this.constructor.name;
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

export default LexicalError;
