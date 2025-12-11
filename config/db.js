// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pgconnection = new Pool({
     host: process.env.PGHOST,
     port: parseInt(process.env.PGPORT || '5432', 10),
     user: process.env.PGUSER,
     password: process.env.PGPASSWORD,
     database: process.env.PGDATABASE,
     max: 10,
     idleTimeoutMillis: 30000,
});

pgconnection.on('error', (err) => {
     console.error('Unexpected PG error', err);
     process.exit(-1);
});

// Log queries
const query = (text, params) => {
     console.log("\n📌 Executing Query:");
     console.log("SQL:", text);
     console.log("Params:", params, "\n");
     return pgconnection.query(text, params);
};

module.exports = { query, pgconnection };
