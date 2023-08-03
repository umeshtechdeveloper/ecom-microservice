require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  RPC_QUEUE_NAME: process.env.RPC_QUEUE_NAME,
  SENTRY_DSN: process.env.SENTRY_DSN,
};
