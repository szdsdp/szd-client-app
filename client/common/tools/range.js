/**
 * 逻辑运算符
 */
export const logicOr = ["EQ", "SP", "CP", "BT", "EN"];

/**
 * 范围检查
 * @param val 需要检查的值
 * @param {Array} ranges 数据范围 {type:"数据类型",option:"操作符",low:低值,high:高值}
 * @return {Boolean} 返回Boolean true数据有效，否则无效
 */
export function range(val, ranges) {
  if (!ranges && ranges.length === 0) {
    return true;
  }
  let _val = val === null || val === undefined ? "" : val;
  let _logicCk = { and: true, andFlag: false };
  for (let i = 0; i < ranges.length; i++) {
    const item = ranges[i];
    // 与为假时，则继续下一行
    if (!logicOr.includes(item.option) && !_logicCk.and) continue;
    // 设置值和数据类型
    let _low = item.low === null || item.low === undefined ? "" : item.low;
    let _high = item.high === null || item.high === undefined ? "" : item.high;
    const _type = item.type ? item.type : isNumber(_low, _high);
    if (_type === "number") {
      if (["SP", "NS", "CP", "NC"].includes(item.option)) {
        _val = _val.toString();
        _low = _low.toString();
        _high = _high.toString();
      } else {
        if (_val === "") _val = 0;
        if (_low === "") _low = 0;
        if (_high === "") _high = 0;
      }
    }
    //逻辑检查
    if (logicOr.includes(item.option)) {
      //OR 逻辑
      switch (item.option) {
        case "EQ": //等于(OR)
          if (_val === _low) return true;
          break;
        case "SP": //包含(OR)
          if (!_low || _val.includes(_low)) return true;
          break;
        case "CP": //*通配符包含(OR)
          const regCp = new RegExp(_low.replaceAll("*", ".*"));
          if (regCp.test(_val)) return true;
          break;
        case "BT": //范围内(OR)
          if (_val >= _low && _val <= _high) return true;
          break;
        case "EN": //等于空(OR)
          if (_val === "" || _val === 0 || _val === undefined || _val === null) return true;
          break;
      }
    } else {
      //AND 逻辑
      _logicCk.andFlag = true;
      switch (item.option) {
        case "NE": //不等于(AND)
          if (_val === _low) _logicCk.and = false;
          break;
        case "GE": //大于等于(AND)
          if (_val < _low) _logicCk.and = false;
          break;
        case "LE": //小于等于(AND)
          if (_val > _low) _logicCk.and = false;
          break;
        case "GT": //大于(AND)
          if (_val <= _low) _logicCk.and = false;
          break;
        case "LT": //小于(AND)
          if (_val >= _low) _logicCk.and = false;
          break;
        case "NS": //不包含(AND)
          if (!_low || _val.includes(_low)) _logicCk.and = false;
          break;
        case "NC": //*通配符不包含(AND)
          const regNc = new RegExp(_low.replaceAll("*", ".*"));
          if (regNc.test(_val)) _logicCk.and = false;
          break;
        case "NB": //范围外(AND)
          if (_val >= _low && _val <= _high) _logicCk.and = false;
          break;
        case "NN": //不等于空(AND)
          if (_val === "" || _val === 0 || _val === undefined || _val === null) _logicCk.and = false;
          break;
        default:
          console.error("操作符错误");
          return true;
          break;
      }
    }
  }
  if (_logicCk.andFlag) return _logicCk.and;
  return false;
}

//先判断基础类型是 number 排除 NaN
function isNumber(low, high) {
  if (low) {
    return typeof low === "number" && !isNaN(low) ? "number" : "string";
  } else if (high) {
    return typeof high === "number" && !isNaN(high) ? "number" : "string";
  } else {
    return "string";
  }
}
