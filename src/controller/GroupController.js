const { GetMsg } = require("../helper/MessageUtil");
const {
  Ok,
  BadRequest,
  InternalServerErr,
  NotFound,
  SearchOk,
  SearchNotFound,
} = require("../helper/ResponseUtil");
const { getTimestamp } = require("../helper/StringUtil");
const {
  createGroup,
  getGroupById,
  deleteGroupById,
  searchGroup,
  updateGroup,
} = require("../model/Group");

class GroupController {
  async doCreate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      const groupGroupId = await getGroupById(param.groupId);
      if (groupGroupId) {
        BadRequest(res, "Group ID telah terdaftar");
        return;
      }

      await createGroup(param, who);
      Ok(res, GetMsg("created"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doCreate", err);
      InternalServerErr(res, "Error saat menyimpan group");
    }
  }

  async getById(req, res) {
    const param = req.query;
    try {
      let group = await getGroupById(param.groupId);
      if (group == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      Ok(res, GetMsg("found"), group);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("getById", err);
      InternalServerErr(res, "Error saat mendapatkan group dari id");
    }
  }

  async doDelete(req, res, next) {
    const param = req.body;
    try {
      let group = await getGroupById(param.groupId);
      if (group == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await deleteGroupById(param.groupId);

      Ok(res, GetMsg("deleted"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus group");
    }
  }

  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }

      const { page, perPage, totalPages, totalRows, result } =
        await searchGroup(param);

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
      InternalServerErr(res, "Error saat mencari group");
    }
  }

  async doUpdate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      let group = await getGroupById(param.groupId);
      if (group == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await updateGroup(param, who);
      Ok(res, GetMsg("updated"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah group");
    }
  }
}

module.exports = GroupController;
