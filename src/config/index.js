require('dotenv').config({ path: './.env' });

export default {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.SERVER_PORT,
  },
  logger: {
    host: process.env.LOGGER_HOST,
    port: process.env.LOGGER_PORT,  // LET HOST BE SET TO DEFUALT LOCAL
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
  auth: {
    secret: process.env.JWT_SECRET,
  }
}