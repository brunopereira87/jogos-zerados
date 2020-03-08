class AppError extends Error {
  constructor(message, status_code) {
    super(message);
    this.status_code = status_code;
    this.success = status_code >= 400 ? false : true;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
