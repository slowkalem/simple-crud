const {
  Ok,
  BadRequest,
  InternalServerErr,
  NotFound,
  SearchOk,
  SearchNotFound,
} = require("../helper/ResponseUtil");
const { GetMsg } = require("../helper/MessageUtil");

const {
  searchSystem,
  getOneSystem,
  insertSystem,
  updateSystem,
  deleteSystem,
} = require("../model/System");
const { getTimestamp } = require("../helper/StringUtil");

class SystemController {
  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }
      const { page, perPage, totalPages, totalRows, result } =
        await searchSystem(param);
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
      InternalServerErr(res, "Error saat mencari system");
    }
  }

  async doGetById(req, res) {
    const param = req.query;
    try {
      const system = await getOneSystem(param);
      if (system == null) {
        NotFound(res, GetMsg("not.found"));
        return;
      }

      Ok(res, GetMsg("found"), system);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetById", err);
      InternalServerErr(res, "Error saat mendapatkan system berdasarkan Id");
    }
  }

  async doCreate(req, res, next) {
    const param = req.body;
    const who = req.user.username;
    try {
      const system = await getOneSystem(param);
      if (system) {
        BadRequest(res, GetMsg("found.duplicate.entry", "system data"));
        return;
      }
      if (
        param.sysCat.toLowerCase() == param.sysSubCat.toLowerCase() &&
        param.sysSubCat.toLowerCase() == param.sysCode.toLowerCase()
      ) {
        return BadRequest(
          res,
          "Kombinasi Category, Sub Category, dan Code tidak boleh sama"
        );
      }
      param.sysCat = param.sysCat.toUpperCase();
      param.sysSubCat = param.sysSubCat.toUpperCase();

      await insertSystem(param, who);
      Ok(res, GetMsg("created"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doCreate", err);
      InternalServerErr(res, "Error saat menyimpan system");
    }
  }

  async doUpdate(req, res, next) {
    let param = req.body;
    const who = req.user.userId;
    try {
      const system = await getOneSystem(param);
      if (system == null) {
        NotFound(res, GetMsg("not.found"));
        return;
      }
      param.sysCat = param.sysCat.toUpperCase();
      param.sysSubCat = param.sysSubCat.toUpperCase();

      await updateSystem(param, who);
      Ok(res, GetMsg("updated"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doUpdate", err);
      InternalServerErr(res, "Error saat mengubah system");
    }
  }

  async doDelete(req, res, next) {
    let params = req.body;
    try {
      let arrays = [],
        valids = true;
      for (let i = 0; i < params.length; i++) {
        let param = params[i];

        const system = await getOneSystem(param);
        if (!system) {
          valids = false;
        } else {
          arrays.push([
            param.sysCat.toUpperCase(),
            param.sysSubCat.toUpperCase(),
            param.sysCode,
          ]);
        }

        if (!valids) {
          NotFound(res, GetMsg("not.found"));
          return;
        }
      }
      await deleteSystem(arrays);
      Ok(res, GetMsg("deleted"));
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doDelete", err);
      InternalServerErr(res, "Error saat menghapus system");
    }
  }
}

module.exports = new SystemController();
