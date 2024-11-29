const { getUserByEmail, getOneUser } = require("../model/User");
const { BadRequest, InternalServerErr } = require("../helper/ResponseUtil");

const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUND);

const checkPassword = async (req, res, next) => {
  const param = req.body;
  try {
    let userUserId = req.user.userId;
    let user = await getOneUser(userUserId);

    const match = bcrypt.compareSync(param.currentPassword, user.password);
    if (!match) {
      return BadRequest(res, "Password tidak sama");
    }

    next();
  } catch (err) {
    console.log("checkPassword", err);
    InternalServerErr(res, "Error saat check password");
  }
};

module.exports = {
  checkPassword,
};
