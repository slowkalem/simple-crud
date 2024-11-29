const { Joi } = require("celebrate");
const {
  usernameField,
  passwordField,
  emailField,
  phoneField,
  passwordConfirmationField,
  OTPField,
  newPasswordField,
  newPasswordConfirmationField,
} = require("./BaseField");

// https://stackoverflow.com/questions/25953973/joi-validation-return-only-one-error-message#:~:text=Joi.object().options(%7B%20abortEarly%3A%20false%20%7D).keys(%7B...%7D)
const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    username: Joi.string()
      .max(255)
      .messages({
        "string.empty": usernameField.message.required,
      })
      .optional(),
    password: Joi.string()
      .max(255)
      .messages({
        "any.required": passwordField.message.required,
        "string.empty": passwordField.message.required,
      })
      .required(),
  })
  .unknown(true);

// https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages#:~:text=42-,Joi%20Version%2014.0.0,-const%20SchemaValidation%20%3D%20%7B

const registrationSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
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
  })
  .unknown(true);

const sendOTPSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
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

const verifyOTPSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
      })
      .required(),
    OTP: Joi.string().when("isVerifyOTP", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    isVerifyOTP: Joi.boolean().required(),
  })
  .unknown(true);

const resetPasswordSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .max(255)
      .regex(emailField.pattern)
      .messages({
        "string.pattern.base": emailField.message.pattern,
        "any.required": emailField.message.required,
        "string.empty": emailField.message.required,
      })
      .required(),
    password: Joi.string()
      .max(255)
      .regex(newPasswordField.pattern)
      .messages({
        "string.pattern.base": newPasswordField.message.pattern,
        "any.required": newPasswordField.message.required,
        "string.empty": newPasswordField.message.required,
      })
      .required(),
    passwordConfirmation: Joi.any()
      .valid(Joi.ref("password"))
      .messages({
        "any.required": newPasswordConfirmationField.message.required,
        "any.only": newPasswordConfirmationField.message.only,
        "string.empty": newPasswordConfirmationField.message.required,
      })
      .required(),
    isVerifyOTP: Joi.boolean().required(),
  })
  .unknown(true);

const getOTPValidTimeSchema = Joi.object()
  .keys({
    email: Joi.string().max(255).required(),
  })
  .unknown(true);

const updateOTPValidTimeSchema = Joi.object()
  .keys({
    email: Joi.string().max(255).required(),
  })
  .unknown(true);

module.exports = {
  loginSchema,
  registrationSchema,
  sendOTPSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  getOTPValidTimeSchema,
  updateOTPValidTimeSchema,
};
