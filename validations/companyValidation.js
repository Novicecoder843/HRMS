const Joi = require("joi");

exports.registerCompanySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  ALIAS: Joi.string().allow("", null),
  pincode: Joi.string().length(6).allow("", null),
  address: Joi.string().allow("", null),
  city: Joi.string().allow("", null)
});

exports.loginCompanySchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});