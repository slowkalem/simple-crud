const {
  BadRequest,
  SearchOk,
  SearchNotFound,
  InternalServerErr,
} = require("../helper/ResponseUtil");
const { getTimestamp } = require("../helper/StringUtil");

const { searchLog } = require("../model/Log");

class LogController {
  async doSearch(req, res, next) {
    const param = req.query;
    try {
      if (!param.page) {
        param.page = 1;
      }
      const { page, perPage, totalPages, totalRows, result } = await searchLog(
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
      InternalServerErr(res, "Error saat mencari Log");
    }
  }
}

module.exports = new LogController();
