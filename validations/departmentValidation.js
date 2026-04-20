const Joi = require("joi");

exports.createDepartmentSchema = Joi.object({
  dept_name: Joi.string().required(),
  description: Joi.string().allow("", null)
});

exports.updateDepartmentSchema = Joi.object({
  dept_name: Joi.string().required(),
  description: Joi.string().allow("", null)
});