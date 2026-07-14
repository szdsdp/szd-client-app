import _ from "lodash";
import szdStoreSession from "../store/storeSession";

/**
 * 打开SAP事务代码
 * @param {String} tCode 事务代码
 * @param {Object} params 地址参数
 * @param {String} okCode 功能码
 */
function goSapTCode(tCode, params = {}, okCode = " ") {
  if (!tCode) return;
  const sapWebguiUrl = szdStoreSession.getWebParams("sap_webgui_url");
  if (sapWebguiUrl) {
    let _par = "";
    for (let key in params) {
      if (_par) {
        _par = _par + ";";
      } else {
        _par = _par + encodeURIComponent(" ");
      }
      _par = _par + key + "=" + encodeURIComponent(params[key]);
    }
    let url = sapWebguiUrl + tCode + _par + "&~OKCODE=" + encodeURIComponent(okCode);
    window.open(url, "_blank");
  }
}

/**
 * 转化range到sap的range参数
 * @param {Object} ranges 数据范围
 * {
 *   字段1: { type:"数据类型", option:"操作符", low:低值, high:高值 },
 *   字段2: { type:"数据类型", option:"操作符", low:低值, high:高值 },
 * }
 * 数据类型：string number date, datetime, month, time
 * 操作符包括：EQ 等于、NE 不等于、BT 在 ... 与 ... 之间、LE 小于或等于、GE 大于或等于、CP 包含模式、NP 不包含模式、
 * GT 大于、LT 小于、NC *通配符不包含、SP 包含、NS 不包含、EN 等于空、NN 不等于空
 * @return {Array} 返回数组
 */
function sapRange(ranges) {
  let itemsRanges = [];
  if (!ranges || !_.isObject(ranges)) return itemsRanges;
  let keys = Object.keys(ranges);
  if (keys.length === 0) return itemsRanges;

  //对应关系
  // EQ	等于  // { value: "EQ", label: $t("等于") },
  // NE	不等于 // { value: "NE", label: $t("不等于") },
  // BT	在 ... 与 ... 之间 // { value: "BT", label: $t("范围内") },
  // NB	不在 ... 与 ... 之间  // { value: "NB", label: $t("范围外") },
  // LE	小于或等于  // { value: "LE", label: $t("小于或等于") },
  // GE	大于或等于   // { value: "GE", label: $t("大于或等于") },
  // CP	包含模式  // { value: "CP", label: $t("*通配符包含") },
  // NP	不包含模式
  // GT	大于 // { value: "GT", label: $t("大于") },
  // LT	小于 // { value: "LT", label: $t("小于") },'
  // { value: "NC", label: $t("*通配符不包含") },
  // { value: "SP", label: $t("包含") },
  // { value: "NS", label: $t("不包含") },
  // { value: "EN", label: $t("等于空") },
  // { value: "NN", label: $t("不等于空") }

  // 赋值
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!Array.isArray(ranges[key])) continue;
    for (let j = 0; j < ranges[key].length; j++) {
      const item = ranges[key][j];
      if (item && _.isObject(item) && item.option) {
        let _option = "";
        let _low = item.low ? item.low : "";
        let _high = item.high ? item.high : "";

        // 操作符转化
        if (["EQ", "NE", "BT", "NB", "LE", "GE", "CP", "GT", "LT"].includes(item.option)) {
          _option = item.option;
        } else if ("NC" === item.option) {
          _option = "NP";
        } else if ("SP" === item.option) {
          _option = "CP";
          _low = "*" + _low + "*";
        } else if ("NS" === item.option) {
          _option = "NP";
          _low = "*" + _low + "*";
        } else if ("EN" === item.option) {
          _option = "EQ";
          _low = "";
        } else if ("NN" === item.option) {
          _option = "NE";
          _low = "";
        }

        // 日期和时间 改变格式转化
        if (["date", "datetime", "month"].includes(item.type)) {
          _low = sapDateToStr(_low);
          _high = sapDateToStr(_high);
        } else if (["time"].includes(item.type)) {
          _low = sapTimeToStr(_low);
          _high = sapTimeToStr(_high);
        }

        itemsRanges.push({ filename: key, sign: "I", option: _option, low: _low, high: _high });
      }
    }
  }
  return itemsRanges;
}

/**
 * 转化日期到字符串YYYYMMDD
 * @param {Date} date 日期
 * @return {String} 返回字符串
 */
function sapDateToStr(date) {
  if (!date) return "";
  let dateStr = date.toString();
  dateStr = dateStr.replaceAll("-", "");
  if (dateStr.length > 8) {
    dateStr = dateStr.substring(0, 8);
  }
  return dateStr;
}

/**
 * 转化时间到字符串HHMMSS
 * @param {Time} time 时间
 * @return {String} 返回字符串
 */
function sapTimeToStr(time) {
  if (!time) return "";
  let dateStr = time.toString();
  dateStr = dateStr.replaceAll(":", "");
  return dateStr;
}

const szdSapTool = {
  goSapTCode,
  sapRange,
  sapDateToStr,
  sapTimeToStr
};

export default szdSapTool;
