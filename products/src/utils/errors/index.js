const Sentry = require("@sentry/node");
const { SENTRY_DSN } = require('../../config');
const { NotFoundError } = require("./app-errors");

// ==================Error logging================ //

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

module.exports = (app) => {
  app.use((error, req, res, next) => {
    let reportError = true;

    // skip common / known errors

    if (error instanceof NotFoundError) {
      reportError = false;  
    }

    if (reportError) {
      Sentry.captureException(error);
    }
    const statusCode = error.statusCode || 500;
    const data = error.data || error.message;
    return res.status(statusCode).json(data);
  });
};
