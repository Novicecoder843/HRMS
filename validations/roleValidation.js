const Joi = require("joi");

exports.createRoleSchema = Joi.object({
  role_name: Joi.string().required()
});

exports.updateRoleSchema = Joi.object({
  role_name: Joi.string().required()
});