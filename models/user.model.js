// 

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Company = require('./company.model');
const Department = require('./department.model');
const Designation = require('./designation.model');

const User = sequelize.define('User', {
  emp_code: { type: DataTypes.STRING, unique: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  date_of_joining: { type: DataTypes.DATEONLY },
  date_of_exit: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
});

// Relationships
User.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(User, { foreignKey: 'company_id' });

User.belongsTo(Department, { foreignKey: 'dept_id' });
Department.hasMany(User, { foreignKey: 'dept_id' });

User.belongsTo(Designation, { foreignKey: 'designation_id' });
Designation.hasMany(User, { foreignKey: 'designation_id' });

module.exports = User;
