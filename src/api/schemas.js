const Joi = require('joi');

const signupSchema = Joi.object({
  credential: Joi.string().required(),
  clientId: Joi.string().valid(process.env.GOOGLE_CLIENT_ID).required(),
  select_by: Joi.string().valid('btn', 'btn_confirm').required(),
});

const nameSchema = Joi.object({
  name: Joi.string().min(4).max(10).required(),
});

module.exports = {
  signupSchema,
  nameSchema,
};
