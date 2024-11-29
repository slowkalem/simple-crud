const {
  Ok,
  BadRequest,
  InternalServerErr,
  NotFound,
  SearchOk,
} = require("../helper/ResponseUtil");
const { GetMsg } = require("../helper/MessageUtil");
const { UpdateNotification } = require("../helper/NotificationUtil");

const uuid = require("uuid").v7;

const {
  getNotification,
  readNotification,
  readManyNotification,
  countUnreadNotification,
} = require("../model/Notification");
const { getTimestamp } = require("../helper/StringUtil");

class NotificationController {
  async doSearch(req, res, next) {
    const param = req.query;
    param.userId = req.user.userId;
    try {
      if (!param.page) {
        param.page = 1;
      }
      let { page, perPage, totalPages, totalRows, result } =
        await getNotification(param);

      const offset = (page - 1) * perPage;

      result = result.slice(offset).slice(0, perPage);
      if (result == 0) {
        NotFound(res, GetMsg("not.found"));
        return;
      }
      // set latest notification into redis as acache
      await UpdateNotification(param);

      SearchOk(res, page, perPage, totalRows, totalPages, result);
      next();
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doSearch", err);
      InternalServerErr(res, "Error saat mencari Log");
    }
  }

  async doRead(req, res) {
    const param = req.body;
    const who = req.user.username;
    param.userId = req.user.userId;
    try {
      const { result } = await getNotification(param);
      if (result.length != 0) {
        param.notificationReadId = uuid();
        await readNotification(param, who);

        // set latest notification into redis as acache
        await UpdateNotification(param);
      } else {
        return NotFound(res, "Data Notifikasi tidak ditemukan");
      }
      Ok(res, "Notification read data berhasil dibuat!");
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doRead", err);
      InternalServerErr(res, "Error saat menyimpan data");
    }
  }

  async doReadAll(req, res) {
    const param = req.body;
    const who = req.user.username;
    param.userId = req.user.userId;
    try {
      param.isRead = false;

      let { result } = await getNotification(param);

      if (result.length !== 0) {
        const arrays = [];
        result.forEach((notification) => {
          arrays.push([
            uuid(),
            notification.notificationId,
            param.userId,
            new Date(),
            who,
            new Date(),
            who,
          ]);
        });
        await readManyNotification(arrays);
        param.isRead = null;

        // set latest notification into redis as acache
        await UpdateNotification(param);
      }

      Ok(res, "Notification read data berhasil dibuat!");
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doRead", err);
      InternalServerErr(res, "Error saat menyimpan data");
    }
  }

  async doCountUnreadNotification(req, res, next) {
    const param = req.query;
    param.userId = req.user.userId;
    try {
      let result = await countUnreadNotification(param);
      Ok(
        res,
        "Menghitung Total Unread Notification berhasil",
        result.toString()
      );
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doCountUnreadNotification", err);
      InternalServerErr(
        res,
        "Error saat menghitung notifikasi yang belum dibaca"
      );
    }
  }
}

module.exports = new NotificationController();
