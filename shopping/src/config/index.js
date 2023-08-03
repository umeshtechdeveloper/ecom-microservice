require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  BASE_URL: process.env.BASE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  RPC_QUEUE_NAME: process.env.RPC_QUEUE_NAME,
  SHOPPING_SERVICE: process.env.SHOPPING_SERVICE,
};
