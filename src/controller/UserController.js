const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUND);
const {
  Ok,
  BadRequest,
  InternalServerErr,
  NotFound,
  SearchOk,
  SearchNotFound,
} = require("../helper/ResponseUtil");
const { GetMsg } = require("../helper/MessageUtil");
const { sendHTMLTemplateEmail } = require("../helper/EmailUtil");
const {
  getOneUser,
  changePassword,
  getUserByUsername,
  updateUser,
  getUserByEmail,
  searchUser,
  deleteUserById,
  createUser,
  getUserById,
  updateStatus,
} = require("../model/User");
const {
  SaveFile,
  GetFileBufferByManualPath,
  GetFileBuffer,
  DeleteFolder,
} = require("../helper/FileUtil");
const profilePhotoFolder = process.env.PROFILE_PHOTO_FOLDER;
const uuid = require("uuid").v7;
const moment = require("moment");
const { getTimestamp } = require("../helper/StringUtil");

class UserController {
  async getById(req, res) {
    const param = req.query;
    try {
      param.userId = param.userId || req.user.userId;
      let user = await getUserById(param.userId);

      if (user == null) {
        NotFound(res, GetMsg("not.found"));
        return;
      }

      // Get foto  berasarkan path DB, jika tidak ada, maka null
      if (user.profilePhoto) {
        let profilePhotoBuffer = GetFileBuffer(user.profilePhoto);
        user.profilePhotoBase64 = !profilePhotoBuffer
          ? null
          : profilePhotoBuffer.toString("base64");
      } else {
        user.profilePhotoBase64 = null;
      }

      Ok(res, GetMsg("found"), user);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("findById", err);
      InternalServerErr(res, "Error saat mendapatkan user berdasarkan id");
    }
  }

  async doChangePassword(req, res) {
    const param = req.body;
    try {
      let who = req.user.email;
      let salt = bcrypt.genSaltSync(saltRounds);
      param.newPassword = bcrypt.hashSync(param.newPassword, salt);
      param.userId = req.user.userId;
      await changePassword(param, who);
      Ok(res, "Password berhasil diubah");
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doChangePassword", err);
      InternalServerErr(res, "Error saat mengubah password");
    }
  }

  /**
   * Admin Portal
   */
  async doCreate(req, res, next) {
    const param = req.body;
    try {
      const userEmail = await getUserByEmail(param.email);
      if (userEmail) {
        BadRequest(res, "Email telah terdaftar");
        return;
      }

      const userUsername = await getUserByUsername(param.username);
      if (userUsername) {
        BadRequest(res, "Username telah terdaftar");
        return;
      }

      param.userId = uuid();

      // Insert image jika ada
      if (req.file) {
        let photoName = req.file.originalname;
        let photoBuffer = req.file.buffer;

        const maxSize = 10 * 1024 * 1024;
        let fizeSize = Buffer.byteLength(photoBuffer);
        if (fizeSize > maxSize) {
          return BadRequest(
            res,
            "Maksimal Ukuran File Foto Profil adalah 10 MB"
          );
        }

        param.profilePhotoFolder = `${profilePhotoFolder}/${param.userId}/`;
        param.profilePhoto = `${profilePhotoFolder}/${param.userId}/${photoName}`;
        SaveFile(param.profilePhotoFolder, photoName, photoBuffer);
      }

      param.email = param.email.toLowerCase();

      let replacement = {
        name: param.fullName,
        username: param.username,
        password: param.password,
        websiteURL: process.env.WEBSITEURL,
        registeredDate: moment(new Date()).format("DD-MMM-YY"),
      };

      let options = {
        from: process.env.APP_NAME,
        to: param.email,
        replacements: replacement,
        subject: "Registration Successful",
        filename: "Registered-Account.html",
      };

      await sendHTMLTemplateEmail(options);

      let salt = bcrypt.genSaltSync(saltRounds);
      param.password = bcrypt.hashSync(param.password, salt);
      await createUser(param);
      Ok(res, GetMsg("created"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("registration", err);
      InternalServerErr(res, "Error saat mendaftar");
    }
  }

  async doUpdate(req, res, next) {
    const param = req.body;
    try {
      let user = await getOneUser(param.userId);
      if (user == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      if (req.file) {
        const maxSize = 10 * 1024 * 1024;
        let fizeSize = Buffer.byteLength(req.file.buffer);
        if (fizeSize > maxSize) {
          return BadRequest(
            res,
            "Maksimal Ukuran File Foto Profil adalah 10 MB"
          );
        }
      }

      // Validate account (unique constraint)
      if (param.email != user.email) {
        let userEmail = await getUserByEmail(param.email);
        if (userEmail) {
          return BadRequest(res, "Email telah terdaftar");
        }
      }

      // Validate account (unique constraint)
      if (param.username != user.username) {
        let userUsername = await getUserByUsername(param.username);
        if (userUsername) {
          return BadRequest(res, "Username telah terdaftar");
        }
      }

      // Delete image
      DeleteFolder(`${profilePhotoFolder}/${param.userId}/`);

      // Update image (kalo insert image juga)
      if (req.file) {
        let photoName = req.file.originalname;
        let photoBuffer = req.file.buffer;
        param.profilePhotoFolder = `${profilePhotoFolder}/${param.userId}/`;
        param.profilePhoto = `${profilePhotoFolder}/${param.userId}/${photoName}`;
        SaveFile(param.profilePhotoFolder, photoName, photoBuffer);
      }

      if (param.password && param.password != "") {
        let salt = bcrypt.genSaltSync(saltRounds);
        param.password = bcrypt.hashSync(param.password, salt);
      }

      let who = param.email;
      await updateUser(param, who);
      Ok(res, GetMsg("updated"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah user");
    }
  }

  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }

      const { page, perPage, totalPages, totalRows, result } = await searchUser(
        param
      );
      if (!result.length) {
        return SearchNotFound(
          res,
          page,
          perPage,
          totalRows,
          totalPages,
          result
        );
      }

      SearchOk(res, page, perPage, totalRows, totalPages, result);
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doSearch", err);
      InternalServerErr(res, "Error saat mencari saat user");
    }
  }

  async doDelete(req, res, next) {
    const param = req.body;
    try {
      let user = await getOneUser(param.userId);
      if (user == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await deleteUserById(param.userId);

      Ok(res, GetMsg("deleted"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus user");
    }
  }

  async doUpdateProfile(req, res, next) {
    const param = req.body;
    param.userId = req.user.userId;
    param.groupId = req.user.groupId;
    param.status = "Active";
    let who = param.email;

    try {
      let user = await getOneUser(param.userId);

      if (req.file) {
        const maxSize = 10 * 1024 * 1024;
        let fizeSize = Buffer.byteLength(req.file.buffer);
        if (fizeSize > maxSize) {
          return BadRequest(
            res,
            "Maksimal Ukuran File Foto Profil adalah 10 MB"
          );
        }
      }

      // Validate account (unique constraint)
      if (param.email != user.email) {
        let userEmail = await getUserByEmail(param.email);
        if (userEmail) {
          return BadRequest(res, "Email telah terdaftar");
        }
      }

      // Validate account (unique constraint)
      if (param.username != user.username) {
        let userUsername = await getUserByUsername(param.username);
        if (userUsername) {
          return BadRequest(res, "Username telah terdaftar");
        }
      }

      // Delete image
      DeleteFolder(`${profilePhotoFolder}/${param.userId}/`);

      // Update image (kalo insert image juga)
      if (req.file) {
        let photoName = req.file.originalname;
        let photoBuffer = req.file.buffer;
        param.profilePhotoFolder = `${profilePhotoFolder}/${param.userId}/`;
        param.profilePhoto = `${profilePhotoFolder}/${param.userId}/${photoName}`;
        SaveFile(param.profilePhotoFolder, photoName, photoBuffer);
      }

      await updateUser(param, who);
      Ok(res, GetMsg("updated"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat update profile user");
    }
  }

  async doUpdateStatus(req, res, next) {
    const param = req.body;
    let who = req.user.email;

    try {
      let user = await getOneUser(param.userId);
      if (user == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await updateStatus(param, who);
      Ok(res, GetMsg("updated"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdateStatus", err);
      InternalServerErr(res, "Error saat update status user");
    }
  }
}

module.exports = UserController;
