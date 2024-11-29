const { insertLog } = require("../model/Log");
const uuid = require("uuid").v7;

const CreateLog = (action, screen) => {
  return async (req, res) => {
    var who;
    if (req.user?.username) {
      who = req.user.username;
    } else {
      who = req.body.username;
    }
    let act, param;
    switch (action) {
      case "view":
        param = JSON.stringify(req.query).replace(/[{}]/g, "");
        act = `Melihat list data. `;
        if (param != "") {
          act += `[${param}]`;
        }
        break;
      case "add":
        param = Object.keys(req.body);
        act = `Menambah data. [${param}]`;
        break;
      case "edit":
        param = Object.keys(req.body);
        act = `Mengubah data. [${param}]`;
        break;
      case "delete":
        param = JSON.stringify(req.body).replace(/['"]/g, "");
        act = `Menghapus data. ${param}`;
        break;
      case "download":
        param = JSON.stringify(req.query).replace(/[{}'"]/g, "");
        act = "Mengunduh data. ";
        if (param != "") {
          act += `[${param}]`;
        }
        break;
      case "upload":
        act = "Mengupload data.";
        break;
      case "login":
        act = "User logged in.";
        break;
      case "logout":
        act = "User manually logged out.";
        break;
      default:
        act = "Log tidak ter-record";
    }
    const logData = {
      logId: uuid(),
      action: act,
      screen: screen,
    };

    await insertLog(logData, who);
  };
};

module.exports = { CreateLog };
