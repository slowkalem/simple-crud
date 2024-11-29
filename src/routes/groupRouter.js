const express = require("express");

const { celebrate } = require("celebrate");
const {
  createGroupSchema,
  searchGroupSchema,
  deleteOneGroupSchema,
  getOneGroupSchema,
  updateGroupSchema,
} = require("../schema/GroupSchema");
const GroupController = require("../controller/GroupController");
const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");
const { CreateLog } = require("../helper/LogUtil");

const ctrl = new GroupController();
const router = express.Router();

router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/groups"]));
router.put("/", PermissionFilter(["PUT", "/groups"]));
router.get("/", PermissionFilter(["GET", "/groups"]));
router.delete("/", PermissionFilter(["DELETE", "/groups"]));
router.get("/getById", PermissionFilter(["GET", "/groups/getById"]));

router
  .route("/")
  .post(
    celebrate({ body: createGroupSchema }),
    ctrl.doCreate,
    CreateLog("add", "Group")
  )
  .put(
    celebrate({ body: updateGroupSchema }),
    ctrl.doUpdate,
    CreateLog("edit", "Group")
  )
  .get(
    celebrate({ query: searchGroupSchema }),
    ctrl.doSearch,
    CreateLog("view", "Group")
  )
  .delete(
    celebrate({ body: deleteOneGroupSchema }),
    ctrl.doDelete,
    CreateLog("delete", "Group")
  );

router.get("/getById", celebrate({ query: getOneGroupSchema }), ctrl.getById);

module.exports = router;
