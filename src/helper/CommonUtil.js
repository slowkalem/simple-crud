const digits = process.env.OTP_DIGITS;
const OTPLength = process.env.OTP_LENGTH;
const delimiter = process.env.FILE_NAME_DELIMITER
const defaultOTP = '00100';
const env = process.env.ENV;

const generateOTP = () => {
  let OTP = "";
  for (let i = 0; i < OTPLength; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  OTP = env != "test" ? OTP : defaultOTP;
  return OTP;
};

const sleep = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const ConvertDate = (str) => {
  // Tue Jan 03 2023 07:00:00 GMT+0700 (Western Indonesia Time) 00:00:00
  // --> 2023-01-03 00:00:00
  let time = "";
  if (str.includes("Time")) {
    if (str.includes("00:00:00")) {
      time = " 00:00:00";
      str = str.split(" 00:00:00")[0];
    }
    if (str.includes("23:59:59")) {
      time = " 23:59:59";
      str = str.split(" 23:59:59")[0];
    }

    let date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);

    return [date.getFullYear(), mnth, day].join("-") + time;
  }

  return str;
};


const getFileNameFromFileNameVersion = (fileNameVersion) => {
  if (!fileNameVersion) {
    return null;
  }

  let ekstensiFile = fileNameVersion.split(".").slice(-1).pop();
  let namaFile = fileNameVersion.split(delimiter);
  namaFile = (namaFile.length > 1) ? namaFile[0] + "." + ekstensiFile : namaFile[0];

  return namaFile;
}

module.exports = {
  generateOTP,
  sleep,
  ConvertDate,
  getFileNameFromFileNameVersion
};
