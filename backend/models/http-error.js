class HttpError extends Error {
    constructor(message, errorCode, error) {
      super(message);
      this.code = errorCode;
      this.error = error;
    }
  }
  
  module.exports = HttpError;
  