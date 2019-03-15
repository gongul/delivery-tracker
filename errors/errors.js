
    
const ErrorCode = require("./error-code.js");

class ErrorFrame extends Error {
  constructor(message,status) {
    if (new.target === ErrorFrame)
        throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
    
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = status;
  }
}

class DeliveryValidationError extends ErrorFrame{
    constructor(message){
        super(message || ErrorCode.VALIDATION.MESSAGE,ErrorCode.VALIDATION.CODE);
        this.name = "ValidationError";
    }
}

class NotFoundError extends ErrorFrame{
    constructor(message){
        super(message || ErrorCode.NOT_FOUND.MESSAGE,ErrorCode.NOT_FOUND.CODE);
    }
}

class InternalServerError extends ErrorFrame{
  constructor(message){
        super(message || ErrorCode.SEVER_ERROR.MESSAGE,ErrorCode.SEVER_ERROR.CODE);
  }
}

class UnauthrizedError extends ErrorFrame{
  constructor(message){
        super(message || ErrorCode.UNAUTHRIZED.MESSAGE,ErrorCode.UNAUTHRIZED.CODE);
  }
}

exports.NotFoundError = NotFoundError;
exports.DeliveryValidationError = DeliveryValidationError;
exports.UnauthrizedError = UnauthrizedError;
exports.InternalServerError = InternalServerError;
exports.ErrorFrame = ErrorFrame;