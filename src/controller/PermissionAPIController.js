const { SaveFile, GetFileBuffer, DeleteFolder } = require("../helper/FileUtil");
const { GetMsg } = require("../helper/MessageUtil");
const {
  Ok,
  BadRequest,
  InternalServerErr,
  NotFound,
  SearchOk,
  SearchNotFound,
} = require("../helper/ResponseUtil");
const {
  createPermissionAPI,
  getPermissionAPIById,
  deletePermissionAPIById,
  searchPermissionAPI,
  updatePermissionAPI,
} = require("../model/PermissionAPI");
const { getFunctionById } = require("../model/Function");
const { getPermissionAPIGroupById } = require("../model/PermissionAPIGroup");
const { updatePermission } = require("../helper/PermissionUtil");
const { getGroupCombo } = require("../model/Combo");
const { getTimestamp } = require("../helper/StringUtil");
const uuid = require("uuid").v7;

class PermissionAPIController {
  async doCreate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      // Cek function Id
      const func = await getFunctionById(param.functionId);
      if (func == null) {
        BadRequest(res, "Function ID tidak terdaftar");
        return;
      }

      param.permissionAPIId = uuid();
      param.action = param.action.toUpperCase();
      param.HTTPMethod = param.HTTPMethod.toUpperCase();

      await createPermissionAPI(param, who);
      Ok(res, GetMsg("create", "Permission API"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doCreate", err);
      InternalServerErr(res, "Error saat menyimpan permission api");
    }
  }

  async getById(req, res) {
    const param = req.query;
    try {
      let permissionAPI = await getPermissionAPIById(param.permissionAPIId);
      if (permissionAPI == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      Ok(res, GetMsg("found"), permissionAPI);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("getById", err);
      InternalServerErr(
        res,
        "Error saat mendapatkan permission api berdasarkan id"
      );
    }
  }

  async doDelete(req, res, next) {
    const param = req.body;
    try {
      let permissionAPI = await getPermissionAPIById(param.permissionAPIId);
      if (permissionAPI == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await deletePermissionAPIById(param.permissionAPIId);

      Ok(res, GetMsg("delete", "Permission API"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus permission api");
    }
  }

  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }

      const { page, perPage, totalPages, totalRows, result } =
        await searchPermissionAPI(param);

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
      InternalServerErr(res, "Error saat mencari permission api");
    }
  }

  async doUpdate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      let permissionAPI = await getPermissionAPIById(param.permissionAPIId);
      if (permissionAPI == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      // Cek function Id
      const func = await getFunctionById(param.functionId);
      if (func == null) {
        BadRequest(res, "Function ID tidak terdaftar");
        return;
      }

      await updatePermissionAPI(param, who);

      // Update permission to all group id
      const groupIds = await getGroupCombo({});
      groupIds.forEach(async (groupId) => {
        await updatePermission(groupId.value);
      });

      Ok(res, GetMsg("update", "Permission API"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah permission api");
    }
  }
}

module.exports = PermissionAPIController;
