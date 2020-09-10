export default class InternalError extends Error {
    public errorCode: string;
  
    constructor(message: string, code: string) {
      super(message);
      this.errorCode = code;
      Object.setPrototypeOf(this, InternalError.prototype);
    }
  }
  