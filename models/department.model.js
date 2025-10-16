// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db.config");
// const Company = require("./company.model");

// const Department = sequelize.define("Department", {
//   dept_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   dept_name: { type: DataTypes.STRING, allowNull: false },
//   manager_id: { type: DataTypes.INTEGER, allowNull: true },
// }, {
//   tableName: "departments",
//   timestamps: false,
// });

// // Relation: Company → Department
// Company.hasMany(Department, { foreignKey: "company_id" });
// Department.belongsTo(Company, { foreignKey: "company_id" });

// module.exports = Department;


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Company = require('./company.model');

const Department = sequelize.define('Department', {
  dept_name: { type: DataTypes.STRING, allowNull: false },
  manager_id: { type: DataTypes.INTEGER, allowNull: true }
});

// Relationship
Department.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Department, { foreignKey: 'company_id' });

module.exports = Department;
