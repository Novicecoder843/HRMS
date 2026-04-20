const Joi = require("joi");

exports.createUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().allow("", null),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_no: Joi.string().length(10).required(),
  role_id: Joi.number().required(),
  dept_id: Joi.number().required(),
  designation_id: Joi.number().required(),
  date_of_joining: Joi.date().required(),
  date_of_exit: Joi.allow(null, "")
});

exports.loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});