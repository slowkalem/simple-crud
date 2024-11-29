const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");

const { JwtFilter } = require("../middleware/RequestFilter");

const {
  comboFilterSchema,
  comboFilterSchemaParent,
  comboFilterSystemSchema,
} = require("../schema/ComboSchema");
const ComboController = require("../controller/ComboController");

// router.all("/*", JwtFilter);

router.get(
  "/fileSize",
  celebrate({ query: comboFilterSchema }),
  ComboController.doGetMaxFileSize
);

router.get(
  "/group",
  celebrate({ query: comboFilterSchemaParent }),
  ComboController.doGetComboGroup
);

router.get(
  "/function",
  celebrate({ query: comboFilterSchemaParent }),
  ComboController.doGetComboFunction
);

router.get(
  "/status",
  celebrate({ query: comboFilterSchema }),
  ComboController.doGetComboStatus
);

router.get(
  "/syscat",
  celebrate({ query: comboFilterSystemSchema }),
  ComboController.doGetComboFilterSystemCat
);

router.get(
  "/syssubcat",
  celebrate({ query: comboFilterSystemSchema }),
  ComboController.doGetComboFilterSystemSubCat
);

router.get(
  "/syscode",
  celebrate({ query: comboFilterSystemSchema }),
  ComboController.doGetComboFilterSystemCode
);

module.exports = router;
