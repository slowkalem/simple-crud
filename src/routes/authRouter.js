const express = require("express");
const AuthController = require("../controller/AuthController");
const { CreateLog } = require("../helper/LogUtil");

const { celebrate } = require("celebrate");
const {
  loginSchema,
  sendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} = require("../schema/AuthSchema");
const { JwtFilter } = require("../middleware/RequestFilter");
const { verifyOTP } = require("../middleware/OTPFilter");

const ctrl = new AuthController();
const authRouter = express.Router();

// base route /auth
authRouter.post(
  "/login",
  celebrate({ body: loginSchema }),
  ctrl.login,
  CreateLog("login", "Login")
);

authRouter.post("/sendOTP", celebrate({ body: sendOTPSchema }), ctrl.sendOTP);

authRouter.post(
  "/resetPassword",
  [
    celebrate({ body: verifyOTPSchema }),
    verifyOTP,
    celebrate({ body: resetPasswordSchema }),
  ],
  ctrl.resetPassword
);

authRouter.post(
  "/logout",
  JwtFilter,
  ctrl.logout,
  CreateLog("logout", "Logout")
);

module.exports = authRouter;
