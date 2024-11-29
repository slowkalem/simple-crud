const { Ok, SearchOk, NotFound } = require("../helper/ResponseUtil");
const { GetNotification } = require("../helper/NotificationUtil");
const { GetMsg } = require("../helper/MessageUtil");

const checkCache = () => {
  return async (req, res, next) => {
    try {
      const param = req.query;
      param.userId = req.user.userId;

      // Get notification cache from Redis
      let notification = await GetNotification(param);
      // Check if cache exist
      if (notification.length != 0) {
        // Pagination
        var totalRows, totalPages, data, offset;

        if (!param.page) {
          param.page = 1;
        }

        if (!param.perPage || param.perPage === "") {
          param.perPage = parseInt(process.env.ROW_PAGE);
        }

        offset = (param.page - 1) * param.perPage;

        data = notification.slice(offset).slice(0, param.perPage);
        if (data.length == 0) {
          return NotFound(res, GetMsg("not.found"));
        }

        totalRows = notification.length;

        totalPages = Math.ceil(notification.length / param.perPage);

        return SearchOk(
          res,
          param.page,
          param.perPage,
          totalRows,
          totalPages,
          data
        );
      } else {
        next();
      }
    } catch (error) {
      console.log("Cache Filter", error);
      return InternalServerErr(res, "Error saat mendapatkan data");
    }
  };
};

module.exports = { checkCache };
