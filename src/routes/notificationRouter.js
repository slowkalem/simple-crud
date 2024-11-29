const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");

const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");
const { checkCache } = require("../middleware/CacheFilter");

const NotificationController = require("../controller/NotificationController");
const {
  searchSystemParamSchema,
  createSystemParamSchema,
  updateSystemParamSchema,
  deleteSystemParamSchema,
  getOneSystemParamSchema,
} = require("../schema/SystemSchema");
const { upload } = require("../middleware/MulterFilter");
const { CreateLog } = require("../helper/LogUtil");

// if you want all under /groups to be protected by jwt token
router.all("/*", JwtFilter);
router.get("/", PermissionFilter(["GET", "/notification"]));
router.post("/read", PermissionFilter(["POST", "/notification/read"]));
router.post("/read-all", PermissionFilter(["POST", "/notification/read-all"]));
router.get("/count", PermissionFilter(["GET", "/notification/count"]));

router
  .route("/")
  .get(
    checkCache(),
    NotificationController.doSearch,
    CreateLog("view", "Notification")
  );

router.post("/read", NotificationController.doRead);
router.post("/read-all", NotificationController.doReadAll);
router.get("/count", NotificationController.doCountUnreadNotification);

module.exports = router;
