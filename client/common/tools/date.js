import dayjs from "dayjs";

/**
 * 获取当天日期 YYYY-MM-DD
 */
function getDay() {
  return dayjs(new Date()).format("YYYY-MM-DD");
}

/**
 * 获取当前年 YYYY
 */
function getYear() {
  return dayjs(new Date()).format("YYYY");
}

/**
 * 获取当前月 MM
 */
function getMonth() {
  return dayjs(new Date()).format("MM");
}

/**
 * 获取当前年月 YYYY-MM
 */
function getYearMonth() {
  return dayjs(new Date()).format("YYYY-MM");
}

/**
 * 获取下一年月 YYYY-MM
 */
function getYearMonthNext() {
  return dayjs(new Date()).add(1, "month").format("YYYY-MM");
}

/**
 * 获取时间 YYYY-MM-DD HH:mm:ss
 */
function getDateTime() {
  return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 获取当前时间 HH:mm:ss
 */

function getTime() {
  return dayjs(new Date()).format("HH:mm:ss");
}

/**
 * 获取本月第一天
 */
function getMonthFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(d.setDate(1)).format(format);
}

/**
 * 获取本月最后一天
 */
function getMonthLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(d.setMonth(d.getMonth() + 1, 0)).format(format);
}

/**
 * 获取上月月第一天
 */
function getLastMonthFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), d.getMonth() - 1, 1)).format(format);
}

/**
 * 获取上月最后一天
 */
function getLastMonthLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), d.getMonth(), 0)).format(format);
}

/**
 * 获取下月月第一天
 */
function getNextMonthFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), d.getMonth() + 1, 1)).format(format);
}

/**
 * 获取下月最后一天
 */

function getNextMonthLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), d.getMonth() + 2, 0)).format(format);
}

/**
 * 获取本年第一天
 */
function getYearFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), 0, 1)).format(format);
}

/**
 * 获取本年最后一天
 */
function getYearLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear(), 12, 31)).format(format);
}

/**
 * 获取上年第一天
 */
function getLastYearFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear() - 1, 0, 1)).format(format);
}

/**
 * 获取上年最后一天
 */
function getLastYearLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear() - 1, 12, 31)).format(format);
}

/**
 * 获取下年第一天
 */
function getNextYearFirstDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear() + 1, 0, 1)).format(format);
}

/**
 * 获取下年最后一天
 */
function getNextYearLastDay(time = undefined, format = "YYYY-MM-DD") {
  const d = time ? new Date(time) : new Date();
  return dayjs(new Date(d.getFullYear() + 1, 12, 31)).format(format);
}

/**
 * 获取周几
 * @param {Date} time 日期时间 可选
 */
function getWeek(time = undefined) {
  const d = time ? new Date(time) : new Date();
  const wkDay = d.getDay();
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekday[wkDay];
}

/**
 * 日期格式化
 * @param {Date} time 日期时间 可选
 * @param {String} format 需要转换的格式 如 YYYY-MM-DD YYYY-MM-DD HH:mm:ss:SS
 */
function format(time = undefined, format = "YYYY-MM-DD") {
  return time ? dayjs(time).format(format) : dayjs(new Date()).format(format);
}

/**
 * 获取两个时间差
 * @param {Date|String} begDate 开始时间
 * @param {Date|String} endDate 结束时间
 * @param {String} unit 单位类型 day、d-天 hour、h-小时 minute、m-分钟 second、s-秒 millisecond、ms-毫秒
 */
function subtract(begDate, endDate, unit = "day") {
  //将两个日期字符串转化为日期对象
  const s = new Date(begDate);
  const e = new Date(endDate);
  //计算两个日期相差的毫秒数
  const mSec = e.getTime() - s.getTime();
  //获取转化比
  let unitNum;
  if (unit === "hour" || unit === "h") {
    unitNum = 60 * 60 * 1000;
  } else if (unit === "minute" || unit === "m") {
    unitNum = 60 * 1000;
  } else if (unit === "second" || unit === "s") {
    unitNum = 1000;
  } else if (unit === "millisecond" || unit === "ms") {
    unitNum = 1;
  } else {
    unitNum = 24 * 60 * 60 * 1000;
  }
  //相差时间
  return Math.floor(mSec / unitNum);
}

/**
 * 日期加减天数计算
 * @param {Date|String} inputDate 基准日期
 * @param {number} days 要增加的天数（负数为减）
 * @return {Date} 计算后的新日期
 */
function addDays(inputDate, days) {
  const date = new Date(inputDate);
  date.setDate(date.getDate() + days);
  return date;
}

const szdDate = {
  getDay,
  getYear,
  getMonth,
  getYearMonth,
  getYearMonthNext,
  getDateTime,
  getTime,
  getMonthFirstDay,
  getMonthLastDay,
  getLastMonthFirstDay,
  getLastMonthLastDay,
  getNextMonthFirstDay,
  getNextMonthLastDay,
  getYearFirstDay,
  getYearLastDay,
  getLastYearFirstDay,
  getLastYearLastDay,
  getNextYearFirstDay,
  getNextYearLastDay,
  getWeek,
  format,
  subtract,
  addDays
};

export default szdDate;
