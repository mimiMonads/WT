const { constants } = require("constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 505;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.status({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.UNAUTHORIZED:
      res.status({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.FORBIDDEN:
      res.status({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.NOT_FOUND:
      res.status({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
    case constants.SERVER_ERROR:
      res.status({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
    default:
      console.log("Error: ", err.message);
      break;
  }
};

module.exports = errorHandler;
