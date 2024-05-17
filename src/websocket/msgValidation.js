const Joi = require('joi');

// Define command schema allowing 'cmd' with 'ADD' or 'DEL', and either 'val' or 'num'
const commandSchema = Joi.alternatives().try(
  Joi.object({
    cmd: Joi.string().valid('ADD', 'DEL').required(),
    val: Joi.string().length(1).required(),
  }),
  Joi.object({
    cmd: Joi.string().valid('ADD', 'DEL').required(),
    num: Joi.number().required(),
  }),
);

// Define the schema for the commands array, limiting to exactly 3 items
const commandsArraySchema = Joi.array().items(commandSchema).max(3).required();

// Define the schema for the entire message
const messageSchema = Joi.object({
  commands: commandsArraySchema,
});

module.exports = messageSchema;
