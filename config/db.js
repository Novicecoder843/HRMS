const { Pool, Query } = require("pg");
require("dotenv").config();

const pgConnection = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || "5432", 10),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000,
});

pgConnection.on("error", (err) => {
  console.log("Unexpected PG error", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pgConnection.query(text, params),
  pgConnection,
};
