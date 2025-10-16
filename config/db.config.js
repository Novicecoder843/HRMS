// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,      // hrms_db
//   process.env.DB_USER,      // postgres
//   process.env.DB_PASSWORD,  // your password
//   {
//     host: process.env.DB_HOST,  // localhost
//     dialect: "postgres",
//     port: process.env.DB_PORT || 5432,
//     logging: false,
//   }
// );

// sequelize.authenticate()
//   .then(() => console.log("✅ Database connected successfully"))
//   .catch((err) => console.log("❌ Database connection failed:", err));

// module.exports = sequelize;
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hrms", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Unable to connect to DB:", err));

module.exports = sequelize;
