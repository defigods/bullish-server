const httpStatus = require("http-status");

class ExtendableError extends Error {
  constructor({ message, errors, status }) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isOperational = true;
  }
}

class ApiError extends ExtendableError {
  constructor({ message, errors, status = httpStatus.INTERNAL_SERVER_ERROR }) {
    super({ message, errors, status });
  }
}

module.exports = ApiError;
