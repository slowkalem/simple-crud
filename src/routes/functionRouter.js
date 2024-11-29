const express = require("express");

const { celebrate } = require("celebrate");
const {
  createFunctionSchema,
  searchFunctionSchema,
  deleteOneFunctionSchema,
  getOneFunctionSchema,
  updateFunctionSchema,
} = require("../schema/FunctionSchema");
const FunctionController = require("../controller/FunctionController");
const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");
const { CreateLog } = require("../helper/LogUtil");

const ctrl = new FunctionController();
const router = express.Router();

router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/functions"]));
router.put("/", PermissionFilter(["PUT", "/functions"]));
router.get("/", PermissionFilter(["GET", "/functions"]));
router.delete("/", PermissionFilter(["DELETE", "/functions"]));
router.get("/getById", PermissionFilter(["GET", "/functions/getById"]));

router
  .route("/")
  .post(
    celebrate({ body: createFunctionSchema }),
    ctrl.doCreate,
    CreateLog("add", "Function")
  )
  .put(
    celebrate({ body: updateFunctionSchema }),
    ctrl.doUpdate,
    CreateLog("edit", "Function")
  )
  .get(
    celebrate({ query: searchFunctionSchema }),
    ctrl.doSearch,
    CreateLog("view", "Function")
  )
  .delete(
    celebrate({ body: deleteOneFunctionSchema }),
    ctrl.doDelete,
    CreateLog("delete", "Function")
  );

router.get(
  "/getById",
  celebrate({ query: getOneFunctionSchema }),
  ctrl.getById
);

module.exports = router;
