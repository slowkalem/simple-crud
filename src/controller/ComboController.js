const { GetMsg } = require("../helper/MessageUtil");
const { Ok, InternalServerErr, NotFound } = require("../helper/ResponseUtil");
const { getTimestamp } = require("../helper/StringUtil");

require("dotenv").config();
const {
  getCombo,
  getGroupCombo,
  getFunctionCombo,
  getFilterSystemCatCombo,
  getFilterSystemSubCatCombo,
  getFilterSystemCodeCombo,
} = require("../model/Combo");

class ComboController {
  async doGetComboStatus(req, res) {
    let param = req.query;
    try {
      param.sysCat = "COMMON";
      param.sysSubCat = "STATUS";
      const combos = await getCombo(param);
      // if (combos.length == 0) return NotFound(res, GetMsg("not.found"));
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboStatus", err);
      InternalServerErr(res, "Error saat mendapatkan combobox data");
    }
  }

  async doGetComboGroup(req, res) {
    let param = req.query;
    try {
      const combos = await getGroupCombo(param);
      if (combos.length == 0) return NotFound(res, GetMsg("not.found"));
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboGroup", err);
      InternalServerErr(res, "Error saat mendapatkan combobox data");
    }
  }

  async doGetComboFunction(req, res) {
    let param = req.query;
    try {
      const combos = await getFunctionCombo(param);
      if (combos.length == 0) return NotFound(res, GetMsg("not.found"));
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboFunction", err);
      InternalServerErr(res, "Error saat mendapatkan combobox data");
    }
  }

  async doGetMaxFileSize(req, res) {
    let param = req.query;
    try {
      param.sysCat = "FILTER";
      param.sysSubCat = "FILE";
      param.sysCode = "MAX_SIZE";
      const combos = await getCombo(param);
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetMaxFileSize", err);
      InternalServerErr(res, "Error saat mendapatkan maksimal ukuran data");
    }
  }

  async doGetComboFilterSystemCat(req, res) {
    let param = req.query;
    try {
      const combos = await getFilterSystemCatCombo(param);
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboFilterSystemCat", err);
      InternalServerErr(res, "Error saat mendapatkan filter combo sistem");
    }
  }

  async doGetComboFilterSystemSubCat(req, res) {
    let param = req.query;
    try {
      const combos = await getFilterSystemSubCatCombo(param);
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboFilterSystemSubCat", err);
      InternalServerErr(res, "Error saat mendapatkan filter combo sistem");
    }
  }

  async doGetComboFilterSystemCode(req, res) {
    let param = req.query;
    try {
      const combos = await getFilterSystemCodeCombo(param);
      Ok(res, GetMsg("found"), combos);
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("doGetComboFilterSystemCode", err);
      InternalServerErr(res, "Error saat mendapatkan filter combo sistem");
    }
  }
}

module.exports = new ComboController();
