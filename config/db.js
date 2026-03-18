const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// Check database connection using async function
async function checkDBConnection() {
  try {
    const connection = await db.getConnection();
    console.log(`✅ Database connected successfully: ${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

// Run connection test
checkDBConnection();

module.exports = db;