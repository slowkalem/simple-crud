const moment = require("moment");

class StringUtil {
  formatDateToString(date, format = "YYYY-MM-DD", locale) {
    if (locale) {
      return moment(date).locale(locale).format(format);
    }
    return moment(moment(date, "DD-MM-YYYY")).format(format);
  }

  formatDateTimeToStringDetailKasus(date) {
    return moment(date).locale("id").format("D MMMM YYYY");
  }

  formatDateTimeToStringKasusRiwayat(date) {
    return moment(date).locale("id").format("D MMMM YYYY HH:mm");
  }

  getTimestamp() {
    return moment().format('DD-MM-YYYY HH:mm:ss');
  }
}

module.exports = new StringUtil();
