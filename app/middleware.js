const httpStatus = require("http-status");
const ApiError = require("./models/error");

const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
  };

  res.status(err.status).json(response);
};

const converter = (err, req, res, next) => {
  let convertedError = err;

  if (!(err instanceof ApiError)) {
    convertedError = new ApiError({
      message: err.message,
      status: err.status,
    });
  }

  return handler(convertedError, req, res);
};

const notFound = (req, res, next) => {
  const err = new ApiError({
    message: "Endpoint not found",
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};

module.exports = { handler, converter, notFound };
