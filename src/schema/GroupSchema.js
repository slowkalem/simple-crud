const { Joi } = require('celebrate')
const { nameField, descriptionField } = require('./BaseField')
const { PagingBaseSchema } = require('./BaseSchema')


const createGroupSchema  = Joi.object().options({ abortEarly: false }).keys({
  groupId: Joi.string().max(50).required(),
  name: Joi.string().max(50)
    .messages({
      "any.required": nameField.message.required,
      "string.empty": nameField.message.required
    })
    .required(),
  description: Joi.string().max(255)
    .messages({
      "any.required": descriptionField.message.required,
      "string.empty": descriptionField.message.required
    })
    .optional(),
}).unknown(true)

const getOneGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  groupId: Joi.string().max(50).required(),
}).unknown(true)

const deleteOneGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  groupId: Joi.string().max(50).required(),
}).unknown(true)

const searchGroupSchema = PagingBaseSchema.keys({
  groupId: Joi.string().allow("").max(255).optional(),
  name: Joi.string().allow("").max(255).optional(),
  description: Joi.string().allow("").max(255).optional(),
}).unknown(true)

const updateGroupSchema  = Joi.object().options({ abortEarly: false }).keys({
  groupId: Joi.string().max(50).required(),
  name: Joi.string().max(50)
    .messages({
      "any.required": nameField.message.required,
      "string.empty": nameField.message.required
    })
    .required(),
  description: Joi.string().max(255)
    .messages({
      "any.required": descriptionField.message.required,
      "string.empty": descriptionField.message.required
    })
    .optional(),
}).unknown(true)

module.exports = { 
  createGroupSchema,
  getOneGroupSchema,
  deleteOneGroupSchema,
  searchGroupSchema,
  updateGroupSchema
}