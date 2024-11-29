require("dotenv").config();
const express = require("express");
const multer = require("multer");

const BodyParser = require("body-parser");
const { errors } = require("celebrate");

const routes = require("./src/routes");
const { NotFound, BadRequest } = require("./src/helper/ResponseUtil");
const { CreateNewFolder } = require("./src/helper/FileUtil");

const rootFolder = process.env.ROOT_FOLDER;

// create folder
CreateNewFolder(rootFolder);

const app = express();

// fix issue security
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// })

app.use(BodyParser.json({ limit: "50mb" })); //limit upload file
// app.use(BodyParser.urlencoded({ extended: true, limit: "50mb" })); //limit upload file
app.use(BodyParser.urlencoded({ extended: false })); //limit upload file

// register base path '/'
app.get("/", (req, res) =>
    res.send(`${process.env.APP_NAME} - ${process.env.APP_VERSION}`)
);

// register static file
app.use(express.static(process.env.ROOT_FOLDER));

// register all route under '/api/v1'
app.use("/api/v1", routes);

// register error handler from Joi->Celebrate
app.use(errors());

// Error handling multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            BadRequest(res, "File max size should be less than 3 MB");
        } else if (error.code === "LIMIT_PHOTO_SIZE") {
            BadRequest(res, "Maksimal Ukuran File Foto Profil adalah 3 MB");
        } else if (error.code === "PHOTO_EXTENTION") {
            BadRequest(res, "File Foto Profil harus berekstensi png, jpeg atau jpg");
        }
    }
});

// set page not found as a default not found url
app.get("*", function (req, res) {
    return NotFound(res, "Page Not Found");
});

module.exports = app;
