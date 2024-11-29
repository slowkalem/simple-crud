const { Joi } = require("celebrate");

const comboFilterSchema = Joi.object()
  .keys({
    value: Joi.string().allow("").optional(),
    label: Joi.string().allow("").optional(),
    dir: Joi.string().allow("").optional(),
  })
  .unknown(true);

const comboFilterSchemaParent = Joi.object()
  .keys({
    value: Joi.string().allow("").optional(),
    label: Joi.string().allow("").optional(),
    parent: Joi.string().allow("").optional(),
  })
  .unknown(true);

const comboFilterSystemSchema = Joi.object()
  .keys({
    sysCat: Joi.string().allow("").optional(),
    sysSubCat: Joi.string().allow("").optional(),
    sysCode: Joi.string().allow("").optional(),
  })
  .unknown(false);

module.exports = {
  comboFilterSchema,
  comboFilterSchemaParent,
  comboFilterSystemSchema,
};
