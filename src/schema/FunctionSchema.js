const { Joi } = require('celebrate')
const { nameField } = require('./BaseField')
const { PagingBaseSchema } = require('./BaseSchema')


const createFunctionSchema  = Joi.object().options({ abortEarly: false }).keys({
  name: Joi.string().max(255)
    .messages({
      "any.required": nameField.message.required,
      "string.empty": nameField.message.required
    })
    .required(),
}).unknown(true)

const getOneFunctionSchema = Joi.object().options({ abortEarly: false }).keys({
  functionId: Joi.string().required()
}).unknown(true)

const deleteOneFunctionSchema = Joi.object().options({ abortEarly: false }).keys({
  functionId: Joi.string().required()
}).unknown(true)

const searchFunctionSchema = PagingBaseSchema.keys({
  name: Joi.string().allow("").max(255).optional(),
}).unknown(true)

const updateFunctionSchema  = Joi.object().options({ abortEarly: false }).keys({
  functionId: Joi.string().required(),
  name: Joi.string().max(255)
    .messages({
      "any.required": nameField.message.required,
      "string.empty": nameField.message.required
    })
    .required(),
}).unknown(true)

module.exports = { 
  createFunctionSchema,
  getOneFunctionSchema,
  deleteOneFunctionSchema,
  searchFunctionSchema,
  updateFunctionSchema
}