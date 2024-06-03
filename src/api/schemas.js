const Joi = require('joi');

const signupSchema = Joi.object({
  credential: Joi.string().required(),
  clientId: Joi.string().valid(process.env.GOOGLE_CLIENT_ID).required(),
});

const nameSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
});

module.exports = {
  signupSchema,
  nameSchema,
};
