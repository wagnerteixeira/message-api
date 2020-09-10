export default class BadRequestError extends Error {
    public errorCode: string;
  
    constructor(message: string, code: string) {
      super(message);
      this.errorCode = code;
      Object.setPrototypeOf(this, BadRequestError.prototype);
    }
  }
  