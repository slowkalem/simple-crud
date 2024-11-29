const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");

const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");

const LogController = require("../controller/LogController");

const { searchLogParamSchema } = require("../schema/LogSchema");
const { CreateLog } = require("../helper/LogUtil");

// if you want all under /groups to be protected by jwt token
// router.all("/*", JwtFilter);

router
  .route("/")
  .get(
    JwtFilter,
    PermissionFilter(["GET", "/log"]),
    celebrate({ query: searchLogParamSchema }),
    LogController.doSearch,
    CreateLog("view", "Audit Log")
  );

module.exports = router;
