const { Joi } = require('celebrate')
const { functionIdField, actionField, HTTPMethodField, APIURLNameField, statusField } = require('./BaseField')
const { PagingBaseSchema } = require('./BaseSchema')


const createPermissionAPISchema  = Joi.object().options({ abortEarly: false }).keys({
  functionId: Joi.string().max(50)
    .messages({
      "any.required": functionIdField.message.required,
      "string.empty": functionIdField.message.required
    })
    .required(),
  action: Joi.string().max(255)
    .messages({
      "any.required": actionField.message.required,
      "string.empty": actionField.message.required
    })
    .required(),
  HTTPMethod: Joi.string().max(255)
    .messages({
      "any.required": HTTPMethodField.message.required,
      "string.empty": HTTPMethodField.message.required
    })
    .required(),
  APIURLName: Joi.string().max(255)
    .messages({
      "any.required": APIURLNameField.message.required,
      "string.empty": APIURLNameField.message.required
    })
    .required(),
  status: Joi.string().max(10)
    .messages({
      "any.required": statusField.message.required,
      "string.empty": statusField.message.required,
    })
    .required(),
}).unknown(true)

const getOnePermissionAPISchema = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIId: Joi.string().required()
}).unknown(true)

const deleteOnePermissionAPISchema = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIId: Joi.string().required()
}).unknown(true)

const searchPermissionAPISchema = PagingBaseSchema.keys({
  functionId: Joi.string().allow("").max(50).optional(),
  functionName: Joi.string().allow("").max(255).optional(),
  action: Joi.string().allow("").max(255).optional(),
  HTTPMethod: Joi.string().allow("").max(255).optional(),
  APIURLName: Joi.string().allow("").max(255).optional(),
  status: Joi.string().allow("").max(255).optional(),
}).unknown(true)

const updatePermissionAPISchema  = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIId: Joi.string().required(),
  functionId: Joi.string().max(50)
    .messages({
      "any.required": functionIdField.message.required,
      "string.empty": functionIdField.message.required
    })
    .required(),
  action: Joi.string().max(255)
    .messages({
      "any.required": actionField.message.required,
      "string.empty": actionField.message.required
    })
    .required(),
  HTTPMethod: Joi.string().max(255)
    .messages({
      "any.required": HTTPMethodField.message.required,
      "string.empty": HTTPMethodField.message.required
    })
    .required(),
  APIURLName: Joi.string().max(255)
    .messages({
      "any.required": APIURLNameField.message.required,
      "string.empty": APIURLNameField.message.required
    })
    .required(),
  status: Joi.string().max(10)
    .messages({
        "any.required": statusField.message.required,
        "string.empty": statusField.message.required,
    })
    .required(),
}).unknown(true)

module.exports = { 
  createPermissionAPISchema,
  getOnePermissionAPISchema,
  deleteOnePermissionAPISchema,
  searchPermissionAPISchema,
  updatePermissionAPISchema
}