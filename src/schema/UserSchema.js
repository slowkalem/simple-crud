const { Joi } = require("celebrate");
const {
  emailField,
  usernameField,
  phoneField,
  passwordField,
  fullNameField,
  currentPasswordField,
  newPasswordField,
  newPasswordConfirmationField,
  passwordConfirmationField,
  statusField,
} = require("./BaseField");
const { PagingBaseSchema } = require("./BaseSchema");

const getOneUserParamsSchema = Joi.object()
  .keys({
    userId: Joi.string().max(255).optional(),
  })
  .unknown(true);

const checkPasswordSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    currentPassword: Joi.string()
      .max(255)
      .messages({
        "any.required": currentPasswordField.message.required,
        "string.empty": currentPasswordField.message.required,
      })
      .required(),
  })
  .unknown(true);

const changePasswordSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    currentPassword: Joi.string()
      .max(255)
      .messages({
        "any.required": currentPasswordField.message.required,
        "string.empty": currentPasswordField.message.required,
      })
      .required(),
    newPassword: Joi.string()
      .max(255)
      .regex(newPasswordField.pattern)
      .messages({
        "string.pattern.base": newPasswordField.message.pattern,
        "any.required": newPasswordField.message.required,
        "string.empty": newPasswordField.message.required,
      })
      .required(),
    newPasswordConfirmation: Joi.string()
      .max(255)
      .valid(Joi.ref("newPassword"))
      .messages({
        "any.required": newPasswordConfirmationField.message.required,
        "any.only": newPasswordConfirmationField.message.only,
        "string.empty": newPasswordConfirmationField.message.required,
      })
      .required(),
  })
  .unknown(true);

/**
 * Admin Portal
 */
// C R U D
const searchUserAdminPortalUsSchema = PagingBaseSchema.keys({
  fullName: Joi.string().allow("").max(255).optional(),
  username: Joi.string().allow("").max(255).optional(),
  phone: Joi.string().allow("").max(13).optional(),
  groupId: Joi.string().allow("").max(255).optional(),
  email: Joi.string().allow("").max(255).optional(),
  status: Joi.string().allow("").max(255).optional(),
  all: Joi.string().allow("").max(255).optional(),
}).unknown(true);

const createUserAdminPortalSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    fullName: Joi.string()
      .max(255)
      .messages({
        "any.required": fullNameField.message.required,
        "string.empty": fullNameField.message.required,
      })
      .required(),
    username: Joi.string()
      .max(255)
      .messages({
        "any.required": usernameField.message.required,
        "string.empty": usernameField.message.required,
      })
      .required(),
    password: Joi.string()
      .max(255)
      .regex(passwordField.pattern)
      .messages({
        "string.pattern.base": passwordField.message.pattern,
        "any.required": passwordField.message.required,
        "string.empty": passwordField.message.required,
      })
      .required(),
    passwordConfirmation: Joi.any()
      .valid(Joi.ref("password"))
      .messages({
        "any.required": passwordConfirmationField.message.required,
        "any.only": passwordConfirmationField.message.only,
        "string.empty": passwordConfirmationField.message.required,
      })
      .required(),
    status: Joi.string()
      .max(10)
      .messages({
        "any.required": statusField.message.required,
        "string.empty": statusField.message.required,
      })
      .required(),
    phone: Joi.string()
      .max(13)
      .regex(phoneField.pattern)
      .messages({ "string.pattern.base": phoneField.message.pattern })
      .allow("")
      .required(),
    groupId: Joi.string().max(50).required(),
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
      })
      .required(),
  })
  .unknown(true);

const updateUserAdminPortalSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    userId: Joi.string().max(255).required(),
    fullName: Joi.string()
      .max(255)
      .messages({
        "any.required": fullNameField.message.required,
        "string.empty": fullNameField.message.required,
      })
      .required(),
    username: Joi.string()
      .max(255)
      .messages({
        "any.required": usernameField.message.required,
        "string.empty": usernameField.message.required,
      })
      .required(),
    status: Joi.string()
      .max(10)
      .messages({
        "any.required": statusField.message.required,
        "string.empty": statusField.message.required,
      })
      .required(),
    phone: Joi.string()
      .max(13)
      .regex(phoneField.pattern)
      .messages({
        "string.pattern.base": phoneField.message.pattern,
        "any.required": phoneField.message.required,
        "string.empty": phoneField.message.required,
      })
      .required(),
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
      })
      .required(),
    groupId: Joi.string().max(50).required(),
  })
  .unknown(true);

const deleteUserAdminPortalSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    userId: Joi.string().max(255).required(),
  })
  .unknown(true);

// User
const updateProfileUserSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    fullName: Joi.string()
      .max(255)
      .messages({
        "any.required": fullNameField.message.required,
        "string.empty": fullNameField.message.required,
      })
      .required(),
    username: Joi.string()
      .max(255)
      .messages({
        "any.required": usernameField.message.required,
        "string.empty": usernameField.message.required,
      })
      .required(),
    phone: Joi.string()
      .max(13)
      .regex(phoneField.pattern)
      .messages({
        "string.pattern.base": phoneField.message.pattern,
        "any.required": phoneField.message.required,
        "string.empty": phoneField.message.required,
      })
      .required(),
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
      })
      .required(),
  })
  .unknown(true);

const updateStatusUserSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    userId: Joi.string().max(255).required(),
    status: Joi.string()
      .max(10)
      .messages({
        "any.required": statusField.message.required,
        "string.empty": statusField.message.required,
      })
      .required(),
  })
  .unknown(true);

module.exports = {
  changePasswordSchema,
  getOneUserParamsSchema,
  checkPasswordSchema,
  createUserAdminPortalSchema,
  deleteUserAdminPortalSchema,
  searchUserAdminPortalUsSchema,
  updateUserAdminPortalSchema,
  updateProfileUserSchema,
  updateStatusUserSchema,
};
