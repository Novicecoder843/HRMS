const Joi = require("joi");

exports.createDesignationSchema = Joi.object({
  desig_name: Joi.string().required(),
  dept_id: Joi.number().required(),
  description: Joi.string().allow("", null)
});

exports.updateDesignationSchema = Joi.object({
  desig_name: Joi.string().required(),
  dept_id: Joi.number().required(),
  description: Joi.string().allow("", null)
});