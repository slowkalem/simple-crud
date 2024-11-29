const { Joi } = require("celebrate");

const { PagingBaseSchema } = require("./BaseSchema");

const searchSystemParamSchema = PagingBaseSchema.keys({
  sysCat: Joi.string().max(64).allow(null, ""),
  sysSubCat: Joi.string().max(64).allow(null, ""),
  sysCode: Joi.string().max(64).allow(null, ""),
  all: Joi.string().max(64).allow(null, ""),
}).unknown(false);

const createSystemParamSchema = Joi.object()
  .keys({
    sysCat: Joi.string().max(64).required().messages({
      "any.required": `System Category tidak boleh kosong`,
      "string.max": `System Category tidak boleh lebih dari 64 karakter`,
    }),
    sysSubCat: Joi.string().max(64).required().messages({
      "any.required": `System Sub Category tidak boleh kosong`,
      "string.max": `System Sub Category tidak boleh lebih dari 64 karakter`,
    }),
    sysCode: Joi.string().max(64).required().messages({
      "any.required": `System Code tidak boleh kosong`,
      "string.max": `System Code tidak boleh lebih dari 64 karakter`,
    }),
    value: Joi.string().required().messages({
      "any.required": `Value tidak boleh kosong`,
    }),
    remark: Joi.string().allow("").max(64).optional(),
    status: Joi.string().allow("").max(10).optional(),
  })
  .unknown(false);

const updateSystemParamSchema = Joi.object()
  .keys({
    sysCat: Joi.string().max(64).required().messages({
      "any.required": `System Category tidak boleh kosong`,
      "string.max": `System Category tidak boleh lebih dari 64 karakter`,
    }),
    sysSubCat: Joi.string().max(64).required().messages({
      "any.required": `System Sub Category tidak boleh kosong`,
      "string.max": `System Sub Category tidak boleh lebih dari 64 karakter`,
    }),
    sysCode: Joi.string().max(64).required().messages({
      "any.required": `System Code tidak boleh kosong`,
      "string.max": `System Code tidak boleh lebih dari 64 karakter`,
    }),
    value: Joi.string().required().messages({
      "any.required": `Value tidak boleh kosong`,
    }),
    remark: Joi.string().allow("").max(64).optional(),
    status: Joi.string().allow("").max(10).optional(),
    // status: Joi.string().max(1).required().messages({
    //   "any.required": `Status tidak boleh kosong`,
    //   "string.max": `Status can't be more than 1 characters`,
    // }),
  })
  .unknown(false);

const deleteItemParamSchema = Joi.object()
  .keys({
    sysCat: Joi.string().max(64).required().messages({
      "any.required": `System Category tidak boleh kosong`,
      "string.max": `System Category tidak boleh lebih dari 64 karakter`,
    }),
    sysSubCat: Joi.string().max(64).required().messages({
      "any.required": `System Sub Category tidak boleh kosong`,
      "string.max": `System Sub Category tidak boleh lebih dari 64 karakter`,
    }),
    sysCode: Joi.string().max(64).required().messages({
      "any.required": `System Code tidak boleh kosong`,
      "string.max": `System Code tidak boleh lebih dari 64 karakter`,
    }),
  })
  .unknown(false);

const deleteSystemParamSchema = Joi.array()
  .items(deleteItemParamSchema)
  .min(1)
  .required();

const downloadItemParamSchema = Joi.object()
  .keys({
    path: Joi.string().required(),
    filename: Joi.string().required(),
  })
  .unknown(true);

const downloadSystemParamSchema = Joi.array()
  .items(downloadItemParamSchema)
  .min(1)
  .required();

const getOneSystemParamSchema = Joi.object()
  .keys({
    sysCat: Joi.string().max(64).required().messages({
      "any.required": `System Category tidak boleh kosong`,
      "string.max": `System Category tidak boleh lebih dari 64 karakter`,
    }),
    sysSubCat: Joi.string().max(64).required().messages({
      "any.required": `System Sub Category tidak boleh kosong`,
      "string.max": `System Sub Category tidak boleh lebih dari 64 karakter`,
    }),
    sysCode: Joi.string().max(64).required().messages({
      "any.required": `System Code tidak boleh kosong`,
      "string.max": `System Code tidak boleh lebih dari 64 karakter`,
    }),
    isImage: Joi.string().allow("").optional(),
  })
  .unknown(false);

module.exports = {
  searchSystemParamSchema,
  createSystemParamSchema,
  updateSystemParamSchema,
  deleteSystemParamSchema,
  downloadSystemParamSchema,
  getOneSystemParamSchema,
};
