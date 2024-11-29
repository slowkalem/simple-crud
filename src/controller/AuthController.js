const {
  Ok,
  BadRequest,
  Unauthorized,
  InternalServerErr,
  NotFound,
} = require("../helper/ResponseUtil");
const {
  getUserByEmail,
  getUserByUsername,
  changePassword,
  updateOTPDB,
  updateIncorrectPasswordCounter,
  getIncorrectPassword,
  updateIncorrectPasswordValidTime,
  updateOTPVerificationDB,
} = require("../model/User");
const {
  createJwtToken,
  updateJwtToken,
  deleteJwtToken,
} = require("../helper/JwtUtil");

const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUND);
const { generateOTP } = require("../helper/CommonUtil");
const { getOTPValidTime } = require("../middleware/OTPFilter");
const {
  GetFileBuffer,
  GetFileBufferByManualPath,
} = require("../helper/FileUtil");
const { GetMsg } = require("../helper/MessageUtil");
const {
  getPermissionAPIGroupByGroupId,
} = require("../model/PermissionAPIGroup");
const { sendHTMLTemplateWithAttachmentEmail } = require("../helper/EmailUtil");
const { getTimestamp } = require("../helper/StringUtil");

class AuthController {
  async login(req, res, next) {
    const param = req.body;
    try {
      let user;
      user = await getUserByUsername(param.username);

      if (user == null) {
        Unauthorized(res, 'Username / Password Salah Silahkan Coba Lagi')
      } else {
        // compare password
        const match = bcrypt.compareSync(param.password, user.password);
        if (match && user.status == "Active") {
          let data = {
            userId: user.userId,
            groupId: user.groupId,
            email: user.email,
            status: user.status,
            username: user.username,
            fullName: user.fullName,
            phone: user.phone,
          };
          data.token = createJwtToken(data, false);

          // Get permission
          data.permissions = await getPermissionAPIGroupByGroupId(data.groupId);

          // Get foto berdasarkan path di DB, jika tidak ada, maka null
          if (user.profilePhoto) {
            let profilePhotoBuffer = GetFileBuffer(user.profilePhoto);
            data.profilePhotoBase64 = !profilePhotoBuffer
              ? null
              : profilePhotoBuffer.toString("base64");
          } else {
            data.profilePhotoBase64 = null;
          }

          // Update token di DB
          await updateJwtToken(data.userId, data.token);

          Ok(res, 'Login sukses', data)
        } else {
          Unauthorized(res, 'Username / Password Salah Silahkan Coba Lagi')
        }
      }
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("login", err)
      InternalServerErr(res, "Error saat login")
    }
  }

  async logout(req, res, next) {
    try {
      let data = {
        token: null,
        userId: req.user.userId,
      };

      await deleteJwtToken(data.userId)
      Ok(res, 'Logout sukses', undefined)
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("logout", err)
      InternalServerErr(res, "Error saat logout")
    }
  }

  async sendOTP(req, res) {
    const param = req.body;
    try {
      let user = await getUserByEmail(param.email);
      if (user == null) {
        // Untuk security, dijadikan 'OK' semua
        Ok(res, 'Kode OTP telah dikirimkan ke email anda!', undefined)
      } else {

        // Send OTP bisa dilakukan ketika waktu valid OTP sudah lewat
        param.OTP = generateOTP();
        const OTPValidTime = getOTPValidTime();
        let expiredDate = moment(new Date())
          .add(OTPValidTime, "m")
          .format("DD-MMM-YY HH:mm");
        param.OTPValidTime = moment(new Date()).add(OTPValidTime, "m").toDate(); // set 2 menit, baru harus OTP lagi

        // Email options
        let replacements = {
          fullName: user.fullName || user.email,
          OTP: param.OTP.split("").join(" "),
          expiredDate: expiredDate,
        };

        let mailOptions = {
          from: "Siber Case Management",
          to: param.email,
          subject: "Reset Password",
          replacements: replacements,
          filename: "OTP.html",
          attachments: [
            {
              filename: "SCM-Logo.png",
              cid: "unique@logo",
            },
          ],
        };

        // Send email
        await sendHTMLTemplateWithAttachmentEmail(mailOptions);

        // Change OTP in DB
        param.userId = user.userId;
        let who = user.email;
        await updateOTPDB(param, who);

        // Update is OTP verified in DB
        param.isOTPVerified = '0'
        await updateOTPVerificationDB(param, who)

        Ok(res, 'Kode OTP telah dikirimkan ke email anda!', undefined)
      }
    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("sendOTP", err)
      InternalServerErr(res, "Network error saat mengirim OTP")
    }
  }

  async resetPassword(req, res) {
    const param = req.body;
    try {
      let who = req.body.email;
      let user = await getUserByEmail(who);

      let salt = bcrypt.genSaltSync(saltRounds);
      param.newPassword = bcrypt.hashSync(param.password, salt);
      param.userId = user.userId;
      await changePassword(param, who);

      // Ketika reset password berhasil, hapus OTP verified
      param.isOTPVerified = '0'
      await updateOTPVerificationDB(param, who)

      // Update incorrect password
      param.userId = user.userId;
      param.incorrectPasswordCounter = 0;
      param.incorrectPasswordValidTime = null;
      await updateIncorrectPasswordCounter(param, who);
      await updateIncorrectPasswordValidTime(param, who);

      Ok(res, "Reset password sukses")

    } catch (err) {
      console.log("----------------------", getTimestamp());
      console.log("resetPassword", err)
      InternalServerErr(res, "Error saat reset password")
    }
  }
}

module.exports = AuthController;
