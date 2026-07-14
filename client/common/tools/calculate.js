import { $m } from "../utils/globalConfig";

/**
 * 除法-固定小数位
 * @param {Number,String} dividend  被除数
 * @param {Number,String} divisor  除数
 * @param {Number,String} decimalPlace  小数位
 * @param {String} rounding  小数位进位 up向上 down向下 空 四舍五入
 * @return {Number} 返回计算结果
 */
function division(dividend, divisor, decimalPlace, rounding = "") {
  if (divisor) {
    let val = Number(dividend) / Number(divisor);
    if (rounding === "up") {
      const pow = Math.pow(10, Number(decimalPlace)); //向上进位
      return Math.ceil(val * pow) / pow;
    } else if (rounding === "down") {
      const pow = Math.pow(10, Number(decimalPlace)); //向下舍位
      return Math.floor(val * pow) / pow;
    } else {
      return Number(val.toFixed(Number(decimalPlace))); //固定小数位;
    }
  } else {
    $m("CORE_CLIENT.E045"); //除数不能为0
    return Infinity;
  }
}

/**
 * 乘法-固定小数位
 * @param {Number,String} num1  被乘数
 * @param {Number,String} num2  乘数
 * @param {Number,String} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下 空 四舍五入
 * @return {Number} 返回计算结果
 */
function multiply(num1, num2, decimalPlace, rounding = "") {
  let val = Number(num1) * Number(num2);
  if (rounding === "up") {
    const pow = Math.pow(10, Number(decimalPlace)); //向上进位
    return Math.ceil(val * pow) / pow;
  } else if (rounding === "down") {
    const pow = Math.pow(10, Number(decimalPlace)); //向下舍位
    return Math.floor(val * pow) / pow;
  } else {
    return Number(val.toFixed(Number(decimalPlace))); //固定小数位;
  }
}

/**
 * 计算税额-金额(不含税)
 * @param {Number,String} amt  金额(不含税)
 * @param {Number,String} tax  税率 单位%
 * @param {Number,String} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下 空 四舍五入
 * @return {Number} 返回计算结果
 */
export function taxNet(amt, tax, decimalPlace = 2, rounding = "") {
  const taxVal = Number(tax) / 100;
  const _pos = decimalPlace === null || decimalPlace === undefined ? 2 : Number(decimalPlace);
  return multiply(amt, taxVal, _pos, rounding);
}

/**
 * 计算税额-金额(含税)
 * @param {Number,String} amt  金额(含税)
 * @param {Number,String} tax  税率 单位%
 * @param {Number,String} decimalPlace  小数位
 * @param {String} rounding 小数位进位 up向上 down向下 空 四舍五入
 * @return {Number} 返回计算结果
 */
export function taxInc(amt, tax, decimalPlace = 2, rounding = "") {
  const taxVal1 = Number(tax) / 100;
  const taxVal2 = 1 + taxVal1;
  const _pos = decimalPlace === null || decimalPlace === undefined ? 2 : Number(decimalPlace);
  const net = division(amt, taxVal2, _pos, rounding);
  return multiply(net, taxVal1, _pos, rounding);
}

/**
 * 表格汇总
 */
function tableSum(obj, fCatCol, posIndex = 0) {}

const szdCalc = {
  division,
  multiply,
  taxNet,
  taxInc
};

export default szdCalc;
