const express = require("express");

const { celebrate } = require("celebrate");
const {
  createPermissionAPISchema,
  searchPermissionAPISchema,
  deleteOnePermissionAPISchema,
  getOnePermissionAPISchema,
  updatePermissionAPISchema,
} = require("../schema/PermissionAPISchema");
const PermissionAPIController = require("../controller/PermissionAPIController");
const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");

const { CreateLog } = require("../helper/LogUtil");
const ctrl = new PermissionAPIController();
const router = express.Router();

router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/apis"]));
router.put("/", PermissionFilter(["PUT", "/apis"]));
router.get("/", PermissionFilter(["GET", "/apis"]));
router.delete("/", PermissionFilter(["DELETE", "/apis"]));
router.get("/getById", PermissionFilter(["GET", "/apis/getById"]));

router
  .route("/")
  .post(
    celebrate({ body: createPermissionAPISchema }),
    ctrl.doCreate,
    CreateLog("add", "Permission API")
  )
  .put(
    celebrate({ body: updatePermissionAPISchema }),
    ctrl.doUpdate,
    CreateLog("edit", "Permission API")
  )
  .get(
    celebrate({ query: searchPermissionAPISchema }),
    ctrl.doSearch,
    CreateLog("view", "Permission API")
  )
  .delete(
    celebrate({ body: deleteOnePermissionAPISchema }),
    ctrl.doDelete,
    CreateLog("delete", "Permission API")
  );

router.get(
  "/getById",
  celebrate({ query: getOnePermissionAPISchema }),
  ctrl.getById
);

module.exports = router;
