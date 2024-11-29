const { Router } = require("express");
const authRouter = require("./authRouter");
const comboRouter = require("./comboRouter");
const systemRouter = require("./systemRouter");
const userRouter = require("./userRouter");
const notificationRouter = require("./notificationRouter");
const functionRouter = require("./functionRouter");
const groupRouter = require("./groupRouter");
const permissionAPIRouter = require("./permissionAPIRouter");
const permissionAPIGroupRouter = require("./permissionAPIGroupRouter");
const logRouter = require("./logRouter");

const routes = Router();
routes.use("/auth", authRouter);
routes.use("/combos", comboRouter);
routes.use("/systems", systemRouter);
routes.use("/users", userRouter);
routes.use("/notification", notificationRouter);
routes.use("/functions", functionRouter);
routes.use("/groups", groupRouter);
routes.use("/apis", permissionAPIRouter);
routes.use("/apiGroups", permissionAPIGroupRouter);
routes.use("/log", logRouter);

module.exports = routes;
