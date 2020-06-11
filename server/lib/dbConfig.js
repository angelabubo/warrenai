// Load all variables from .env file to "process.env" when not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//local database client configuration
const config = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

const configPool = {
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

module.exports = {
  connection: config,
  pool: configPool,
};
