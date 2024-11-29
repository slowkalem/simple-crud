const express = require("express");

const { celebrate } = require("celebrate");
const {
  createPermissionAPIGroupSchema,
  searchPermissionAPIGroupSchema,
  deleteOnePermissionAPIGroupSchema,
  getOnePermissionAPIGroupSchema,
  updatePermissionAPIGroupSchema,
  createManyPermissionAPIGroupSchema,
  deleteManyPermissionAPIGroupSchema,
} = require("../schema/PermissionAPIGroupSchema");
const PermissionAPIGroupController = require("../controller/PermissionAPIGroupController");
const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");

const { CreateLog } = require("../helper/LogUtil");
const ctrl = new PermissionAPIGroupController();
const router = express.Router();

router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/apiGroups"]));
router.put("/", PermissionFilter(["PUT", "/apiGroups"]));
router.get("/", PermissionFilter(["GET", "/apiGroups"]));
router.delete("/", PermissionFilter(["DELETE", "/apiGroups"]));
router.get("/getById", PermissionFilter(["GET", "/apiGroups/getById"]));
router.post("/bulkCreate", PermissionFilter(["POST", "/apiGroups"]));
router.delete("/bulkCreate", PermissionFilter(["DELETE", "/apiGroups"]));

router
  .route("/")
  .post(
    celebrate({ body: createPermissionAPIGroupSchema }),
    ctrl.doCreate,
    CreateLog("add", "Permission API Group")
  )
  .put(
    celebrate({ body: updatePermissionAPIGroupSchema }),
    ctrl.doUpdate,
    CreateLog("edit", "Permission API Group")
  )
  .get(
    celebrate({ query: searchPermissionAPIGroupSchema }),
    ctrl.doSearch,
    CreateLog("view", "Permission API Group")
  )
  .delete(
    celebrate({ body: deleteOnePermissionAPIGroupSchema }),
    ctrl.doDelete,
    CreateLog("delete", "Permission API Group")
  );

router.get(
  "/getById",
  celebrate({ query: getOnePermissionAPIGroupSchema }),
  ctrl.getById
);
router.post(
  "/bulkCreate",
  celebrate({ query: createManyPermissionAPIGroupSchema }),
  ctrl.doBulkCreate,
  CreateLog("add", "Permission API Group")
);
router.delete(
  "/bulkDelete",
  celebrate({ query: deleteManyPermissionAPIGroupSchema }),
  ctrl.doBulkDelete,
  CreateLog("delete", "Permission API Group")
);

module.exports = router;
