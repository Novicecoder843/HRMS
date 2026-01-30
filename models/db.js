// models/db.js
const { Pool } = require("pg");
require("dotenv").config(); // Load variables from .env

const pool = new Pool({
  user: process.env.DB_USER,       // postgres
  host: process.env.DB_HOST,       // localhost
  database: process.env.DB_NAME,   // test_db
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,       // 5432
});

// Optional: Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
  } else {
    console.log("Database connected successfully!");
    release();
  }
});

module.exports = pool;


