const { Joi } = require("celebrate");

const { PagingBaseSchema } = require("./BaseSchema");

const searchLogParamSchema = PagingBaseSchema.keys({
  logId: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Log Id harus bertipe 'text'`,
      "string.pattern.base": `Log Id tidak bisa diisi oleh spesial karakter`,
    }),
  action: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Action harus bertipe 'text'`,
      "string.pattern.base": `Action tidak bisa diisi oleh spesial karakter`,
    }),
  screen: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Screen should harus bertipe 'text'`,
      "string.pattern.base": `Screen tidak bisa diisi oleh spesial karakter`,
    }),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Username should harus bertipe 'text'`,
      "string.pattern.base": `Username tidak bisa diisi oleh spesial karakter`,
    }),
  createdBy: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Created by should harus bertipe 'text'`,
      "string.pattern.base": `Created by tidak bisa diisi oleh spesial karakter`,
    }),
  updatedBy: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .allow(null, "")
    .messages({
      "string.base": `Updated by should harus bertipe 'text'`,
      "string.pattern.base": `Updated by tidak bisa diisi oleh spesial karakter`,
    }),
  createdDateBegin: Joi.date().allow(null, "").optional(),
  createdDateEnd: Joi.date().allow(null, "").optional(),
  updatedDateBegin: Joi.date().allow(null, "").optional(),
  updatedDateEnd: Joi.date().allow(null, "").optional(),
}).unknown(false);

module.exports = {
  searchLogParamSchema,
};
