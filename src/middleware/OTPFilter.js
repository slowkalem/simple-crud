const { getUserByEmail, updateOTPDB, getOTPVerificationDB, updateOTPVerificationDB } = require("../model/User");
const { BadRequest, Ok, InternalServerErr } = require("../helper/ResponseUtil");

const moment = require('moment');
const env = process.env.ENV

const getOTPValidTime = () => {
  // Dalam menit
  return env != "test" ? process.env.OTP_VALID_TIME : process.env.OTP_TEST_VALID_TIME
}

const verifyOTP = async (req, res, next) => {
  const param = req.body
  try {
    let who = param.email
    let user = await getUserByEmail(param.email);
    if (user == null) {
      // Return OTP not valid for security
      return BadRequest(res, 'Kode OTP Tidak Valid')
    }

    param.userId = user.userId
    param.email = user.email
    if(param.isVerifyOTP){

      // console.log('--------------------------- !!')
      // console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
      // console.log(moment(user.OTPValidTime).format("YYYY-MM-DD HH:mm:ss"))
      // console.log('--------------------------- !!')
      if (user.OTPValidTime < new Date()) { // can be null
        return BadRequest(res, 'Kode OTP Sudah Tidak Berlaku')
      } 
  
      if (user.OTP != param.OTP) {
        return BadRequest(res, 'Kode OTP Tidak Valid')
      } 
  
        // Ketika verify OTP berhasil, nyatakan berhasil terverifikasi
        param.userId = user.userId
        param.OTP = null
        param.OTPValidDate = null
        await updateOTPDB(param, who)
  
        // Ketika verify OTP berhasil, update is OTP verified  
        param.isOTPVerified = '1'
        await updateOTPVerificationDB(param, who)
        return Ok(res, 'Kode OTP Telah Diverifikasi', undefined)
    }

    let userOTPVerification = (await getOTPVerificationDB(param.email)).isOTPVerified
    if (userOTPVerification == '0') {
      return BadRequest(res, "Tidak Dapat Mengatur Ulang Password, Kode OTP Tidak Terverifikasi!")
    }

    next()
  } catch (err) {
    console.log("verifyOTP", err)
    InternalServerErr(res, "Error saat verifikasi OTP")
  }
};



module.exports = { verifyOTP, getOTPValidTime };
