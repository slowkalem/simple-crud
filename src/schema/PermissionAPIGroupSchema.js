const { Joi } = require('celebrate')
const { nameField, groupIdField, permissionAPIIdField } = require('./BaseField')
const { PagingBaseSchema } = require('./BaseSchema')


const createPermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  groupId: Joi.string().max(255)
    .messages({
      "any.required": groupIdField.message.required,
      "string.empty": groupIdField.message.required
    })
    .required(),
  permissionAPIId: Joi.string().max(255)
    .messages({
      "any.required": permissionAPIIdField.message.required,
      "string.empty": permissionAPIIdField.message.required
    })
    .required(),
}).unknown(true)

const getOnePermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIGroupId: Joi.string().required()
}).unknown(true)

const deleteOnePermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIGroupId: Joi.string().required()
}).unknown(true)

const searchPermissionAPIGroupSchema = PagingBaseSchema.keys({
  groupId: Joi.string().allow("").max(255).required(),
}).unknown(true)

const updatePermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  permissionAPIGroupId: Joi.string().required(),
  groupId: Joi.string().max(255)
    .messages({
      "any.required": groupIdField.message.required,
      "string.empty": groupIdField.message.required
    })
    .required(),
  permissionAPIId: Joi.string().max(255)
    .messages({
      "any.required": permissionAPIIdField.message.required,
      "string.empty": permissionAPIIdField.message.required
    })
}).unknown(true)

const createManyPermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  data: Joi.array().items(createPermissionAPIGroupSchema).min(1)
}).unknown(true)

const deleteManyPermissionAPIGroupSchema = Joi.object().options({ abortEarly: false }).keys({
  data: Joi.array().items(deleteOnePermissionAPIGroupSchema).min(1)
}).unknown(true)


module.exports = {
  createPermissionAPIGroupSchema,
  getOnePermissionAPIGroupSchema,
  deleteOnePermissionAPIGroupSchema,
  searchPermissionAPIGroupSchema,
  updatePermissionAPIGroupSchema,
  createManyPermissionAPIGroupSchema,
  deleteManyPermissionAPIGroupSchema
}