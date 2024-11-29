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
  createPermissionAPIGroup,
  getPermissionAPIGroupById,
  deletePermissionAPIGroupById,
  searchPermissionAPIGroup,
  updatePermissionAPIGroup,
  deleteManyPermissionAPIGroup,
  createManyPermissionAPIGroup,
} = require("../model/PermissionAPIGroup");
const { getGroupById } = require("../model/Group");
const { getPermissionAPIById } = require("../model/PermissionAPI");
const { updatePermission } = require("../helper/PermissionUtil");
const { getTimestamp } = require("../helper/StringUtil");
const uuid = require("uuid").v7;

class PermissionAPIGroupController {
  async doCreate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      // Cek group id
      const group = await getGroupById(param.groupId);
      if (group == null) {
        BadRequest(res, "Group ID tidak terdaftar");
        return;
      }

      // Cek permission api id
      const permissionAPI = await getPermissionAPIById(param.permissionAPIId);
      if (permissionAPI == null) {
        BadRequest(res, "Permission API ID tidak terdaftar");
        return;
      }

      param.permissionAPIGroupId = uuid();

      await createPermissionAPIGroup(param, who);

      await updatePermission(param.groupId);

      Ok(res, GetMsg("create", "Permission API Group"));
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
      let permissionAPIGroup = await getPermissionAPIGroupById(
        param.permissionAPIGroupId
      );
      if (permissionAPIGroup == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      Ok(res, GetMsg("found"), permissionAPIGroup);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("getById", err);
      InternalServerErr(
        res,
        "Error saat mendapatkan permission api group berdasarkan id"
      );
    }
  }

  async doDelete(req, res, next) {
    const param = req.body;
    try {
      let permissionAPIGroup = await getPermissionAPIGroupById(
        param.permissionAPIGroupId
      );
      if (permissionAPIGroup == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      const groupId = (
        await getPermissionAPIGroupById(param.permissionAPIGroupId)
      ).groupId; // prevent null data
      await deletePermissionAPIGroupById(param.permissionAPIGroupId);
      await updatePermission(groupId);

      Ok(res, GetMsg("delete", "Permission API Group"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus permission api group");
    }
  }

  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }

      const { page, perPage, totalPages, totalRows, result } =
        await searchPermissionAPIGroup(param);

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
      InternalServerErr(res, "Error saat mencari permission api group");
    }
  }

  async doUpdate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      let permissionAPIGroup = await getPermissionAPIGroupById(
        param.permissionAPIGroupId
      );
      if (permissionAPIGroup == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      // Cek group id
      const group = await getGroupById(param.groupId);
      if (group == null) {
        BadRequest(res, "Group ID tidak terdaftar");
        return;
      }

      // Cek permission api id
      const permissionAPI = await getPermissionAPIById(param.permissionAPIId);
      if (permissionAPI == null) {
        BadRequest(res, "Permission API ID tidak terdaftar");
        return;
      }

      await updatePermissionAPIGroup(param, who);

      await updatePermission(param.groupId);

      Ok(res, GetMsg("update", "Permission API Group"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah permission api group");
    }
  }

  async doBulkCreate(req, res, next) {
    let params = req.body;
    try {
      let arrays = [];
      let who = req.user.email;
      let dt = new Date();

      for (let i = 0; i < params.length; i++) {
        let param = params[i];

        // Cek group id
        const group = await getGroupById(param.groupId);
        if (group == null) {
          BadRequest(res, "Group ID tidak terdaftar");
          return;
        }

        // Cek permission api id
        const permissionAPI = await getPermissionAPIById(param.permissionAPIId);
        if (permissionAPI == null) {
          BadRequest(res, "Permission API ID tidak terdaftar");
          return;
        }

        const permissionAPIGroupId = uuid();
        arrays.push([
          permissionAPIGroupId,
          param.groupId,
          param.permissionAPIId,
          who,
          dt,
          who,
          dt,
        ]);
      }

      await createManyPermissionAPIGroup(arrays);

      const groupId = params[0].groupId;
      await updatePermission(groupId);

      Ok(res, GetMsg("create", "Permission API Group"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doBulkCreate", err);
      InternalServerErr(res, "Error saat  menyimpan permission api group");
    }
  }

  async doBulkDelete(req, res, next) {
    let params = req.body;
    try {
      let arrays = [];

      for (let i = 0; i < params.length; i++) {
        let param = params[i];

        // Cek permission api group
        const permissionAPIGroup = await getPermissionAPIGroupById(
          param.permissionAPIGroupId
        );
        if (permissionAPIGroup == null) {
          NotFound(res, GetMsg("not.found"));
          return;
        }

        arrays.push(param.permissionAPIGroupId);
      }

      const groupId = (
        await getPermissionAPIGroupById(params[0].permissionAPIGroupId)
      ).groupId; // prevent null data
      await deleteManyPermissionAPIGroup(arrays);
      await updatePermission(groupId);

      Ok(res, GetMsg("delete", "Permission API Group"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat  menghapus permission api group");
    }
  }
}

module.exports = PermissionAPIGroupController;
