const Joi = require('joi')

const googleclientid = '644690595130-lv4cosg2kpei4347fc6d4842tm7vog87.apps.googleusercontent.com'
const select_by = 'btn'

const signupSchema = Joi.object({
  credential: Joi.string().required(),
  clientId: Joi.string().valid(googleclientid).required(),
  select_by: Joi.string().valid(select_by).required()
})

module.exports = {
  signupSchema,
}