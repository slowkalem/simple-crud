const multer = require("multer");
const { BadRequest } = require("../helper/ResponseUtil");
const { getOneSystem } = require("../model/System");
const { getCombo } = require("../model/Combo");
const storage = multer.memoryStorage();
const uuid = require("uuid").v7;

const delimiter = process.env.FILE_NAME_DELIMITER;

const fileFilter = (req, file, callback) => {
  // const fileSize = parseInt(req.headers["content-length"]);
  // if (fileSize > 3_000_000) {
  //   return callback(new multer.MulterError("LIMIT_PHOTO_SIZE"), false);
  // }

  let photoExtention = file?.originalname.split(".").slice(-1).pop();
  if (!["png", "jpg", "jpeg"].includes(photoExtention)) {
    return callback(new multer.MulterError("PHOTO_EXTENTION"), false);
  }

  callback(null, true);
};

const uploadPhoto = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 10_000_000 },
});

const fileSizeFilter = async (req, res, next) => {
  const fileSize = {
    sysCat: "FILTER",
    sysSubCat: "FILE",
    sysCode: "MAX_SIZE",
  };
  const maxSizeValue = (await getCombo(fileSize))[0];
  if (req.files || req.files?.length) {
    const maxSize = parseInt(maxSizeValue.value) * 1024 * 1024;
    for (let i in req.files) {
      let ekstensiDokumentasi = req.files[i].originalname
        .split(".")
        .slice(-1)
        .pop();
      if (
        ![
          "png",
          "jpg",
          "jpeg",
          "pdf",
          "doc",
          "docx",
          "ppt",
          "pptx",
          "xls",
          "xlsx",
          "xml",
        ].includes(ekstensiDokumentasi)
      ) {
        BadRequest(res, "Ekstensi file tidak didukung!");
        return;
      }
      let fizeSize = Buffer.byteLength(req.files[i].buffer);
      if (fizeSize > maxSize) {
        return BadRequest(
          res,
          `Maximum ukuran file adalah ${maxSizeValue.label}`
        );
      }
    }
  }

  next();
};

const changeFileName = async (req, res, next) => {
  if (req.files || req.files?.length) {
    for (let i in req.files) {
      let originalname = req.files[i].originalname;
      let extention = originalname.split(".").slice(-1).pop();
      let filename = originalname.substr(
        0,
        originalname.length - extention.length - 1
      );
      req.files[
        i
      ].originalname = `${filename}${delimiter}${uuid()}.${extention}`;
    }
  }

  next();
};

module.exports = { uploadPhoto, fileSizeFilter, changeFileName };
