const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");

const { JwtFilter, PermissionFilter } = require("../middleware/RequestFilter");

const { CreateLog } = require("../helper/LogUtil");
const UserController = require("../controller/UserController");
const {
  changePasswordSchema,
  getOneUserParamsSchema,
  checkPasswordSchema,
  searchUserAdminPortalUsSchema,
  createUserAdminPortalSchema,
  updateUserAdminPortalSchema,
  deleteUserAdminPortalSchema,
  updateProfileUserSchema,
  updateStatusUserSchema,
} = require("../schema/UserSchema");

const { checkPassword } = require("../middleware/UserFilter");
const { uploadPhoto } = require("../middleware/MulterFilter");

// base route /users
var ctrl = new UserController();

// if you want all under /users to be protected by jwt token
router.all("/*", JwtFilter);
router.post("/", PermissionFilter(["POST", "/users"]));
router.put("/", PermissionFilter(["PUT", "/users"]));
router.get("/", PermissionFilter(["GET", "/users"]));
router.delete("/", PermissionFilter(["DELETE", "/users"]));
router.get("/getById", PermissionFilter(["GET", "/users/getById"]));
router.put(
  "/changePassword",
  PermissionFilter(["PUT", "/users/changePassword"])
);
router.put("/updateProfile", PermissionFilter(["PUT", "/users/updateProfile"]));

router
  .route("/")
  .post(
    [
      uploadPhoto.single("file"),
      celebrate({ body: createUserAdminPortalSchema }),
    ],
    ctrl.doCreate,
    CreateLog("add", "User")
  )
  .get(
    celebrate({ query: searchUserAdminPortalUsSchema }),
    ctrl.doSearch,
    CreateLog("view", "User")
  )
  .put(
    [
      uploadPhoto.single("file"),
      celebrate({ body: updateUserAdminPortalSchema }),
    ],
    ctrl.doUpdate,
    CreateLog("edit", "User")
  )
  .delete(
    celebrate({ body: deleteUserAdminPortalSchema }),
    ctrl.doDelete,
    CreateLog("delete", "User")
  );

router.get(
  "/getById",
  celebrate({ query: getOneUserParamsSchema }),
  ctrl.getById
);
router.put(
  "/changePassword",
  [
    celebrate({ body: checkPasswordSchema }),
    checkPassword,
    celebrate({ body: changePasswordSchema }),
  ],
  ctrl.doChangePassword
);
router.put(
  "/updateProfile",
  [uploadPhoto.single("file"), celebrate({ body: updateProfileUserSchema })],
  ctrl.doUpdateProfile,
  CreateLog("update", "Profile")
);

router.put(
  "/status",
  celebrate({ body: updateStatusUserSchema }),
  ctrl.doUpdateStatus,
  CreateLog("update", "User")
);

module.exports = router;
