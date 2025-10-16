// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db.config");

// const Company = sequelize.define("Company", {
//   company_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: { type: DataTypes.STRING, allowNull: false },
//   address: { type: DataTypes.STRING },
//   industry: { type: DataTypes.STRING },
//   settings: { type: DataTypes.JSONB },
// }, {
//   tableName: "companies",
//   timestamps: false,
// });

// module.exports = Company;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Company = sequelize.define('Company', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  settings: { type: DataTypes.JSON }  // optional settings stored as JSON
});

module.exports = Company;

