const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");

const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");

const SystemController = require("../controller/SystemController");
const {
  searchSystemParamSchema,
  createSystemParamSchema,
  updateSystemParamSchema,
  deleteSystemParamSchema,
  getOneSystemParamSchema,
} = require("../schema/SystemSchema");
const { CreateLog } = require("../helper/LogUtil");

// if you want all under /groups to be protected by jwt token
router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/systems"]));
router.put("/", PermissionFilter(["PUT", "/systems"]));
router.get("/", PermissionFilter(["GET", "/systems"]));
router.delete("/", PermissionFilter(["DELETE", "/systems"]));
router.get("/", PermissionFilter(["GET", "/systems/getById"]));

router
  .route("/")
  .get(
    JwtFilter,
    celebrate({ query: searchSystemParamSchema }),
    SystemController.doSearch,
    CreateLog("view", "Master System")
  )
  .post(
    JwtFilter,
    celebrate({ body: createSystemParamSchema }),
    SystemController.doCreate,
    CreateLog("add", "Master System")
  )
  .put(
    JwtFilter,
    celebrate({ body: updateSystemParamSchema }),
    SystemController.doUpdate,
    CreateLog("edit", "Master System")
  )
  .delete(
    JwtFilter,
    celebrate({ body: deleteSystemParamSchema }),
    SystemController.doDelete,
    CreateLog("delete", "Master System")
  );

router.get(
  "/getById",
  celebrate({ query: getOneSystemParamSchema }),
  SystemController.doGetById
);

module.exports = router;
