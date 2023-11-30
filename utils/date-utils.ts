import moment from "moment-timezone";
moment().tz("Asia/Taipei");

const DateUtils = {
  getCurrentDate: () => {
    return moment().format("YYYY-MM-DD");
  },
  getCurrentTime: () => {
    return moment().format("HH:mm");
  },
  getCurrentDatetime: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },
};

export default DateUtils;
