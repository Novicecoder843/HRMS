// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db.config");
// const Company = require("./company.model");

// const Designation = sequelize.define("Designation", {
//   designation_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: { type: DataTypes.STRING, allowNull: false },
//   level: { type: DataTypes.INTEGER },
// }, {
//   tableName: "designations",
//   timestamps: false,
// });

// Company.hasMany(Designation, { foreignKey: "company_id" });
// Designation.belongsTo(Company, { foreignKey: "company_id" });

// module.exports = Designation;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Company = require('./company.model');

const Designation = sequelize.define('Designation', {
  name: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.INTEGER, defaultValue: 1 }
});

// Relationship
Designation.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Designation, { foreignKey: 'company_id' });

module.exports = Designation;
