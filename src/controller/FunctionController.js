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
  createFunction,
  getFunctionById,
  deleteFunctionById,
  searchFunction,
  updateFunction,
} = require("../model/Function");
const uuid = require("uuid").v7;
const { getTimestamp } = require("../helper/StringUtil");
class FunctionController {
  async doCreate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;
      param.functionId = uuid();

      await createFunction(param, who);
      Ok(res, GetMsg("create", "Function"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doCreate", err);
      InternalServerErr(res, "Error saat menyimpan function");
    }
  }

  async getById(req, res) {
    const param = req.query;
    try {
      let func = await getFunctionById(param.functionId);
      if (func == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      Ok(res, GetMsg("found"), func);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("getById", err);
      InternalServerErr(res, "Error saat mendapatkan function berdasarkan id");
    }
  }

  async doDelete(req, res, next) {
    const param = req.body;
    try {
      let func = await getFunctionById(param.functionId);
      if (func == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await deleteFunctionById(param.functionId);

      Ok(res, GetMsg("delete", "Function"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus function");
    }
  }

  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }

      const { page, perPage, totalPages, totalRows, result } =
        await searchFunction(param);

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
      InternalServerErr(res, "Error saat mencari function");
    }
  }

  async doUpdate(req, res, next) {
    const param = req.body;
    try {
      let who = req.user.email;

      let func = await getFunctionById(param.functionId);
      if (func == null) {
        return NotFound(res, GetMsg("not.found"));
      }

      await updateFunction(param, who);
      Ok(res, GetMsg("update", "Function"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah function");
    }
  }
}

module.exports = FunctionController;
