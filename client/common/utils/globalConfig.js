import { Snackbar } from "@varlet/ui";
import szdStoreLocal from "../store/storeLocal";

/**
 * 减少频繁调用缓存
 * */
const getSingleDbLang = (function () {
  let ret;
  return function () {
    return ret || (ret = szdStoreLocal.getLang());
  };
})();

/**
 * 语言转换
 * */
export function $t(val) {
  if (!val) return "";
  const dbLang = getSingleDbLang();
  return dbLang[val] ? dbLang[val] : val;
}

/**
 * 消息提示
 * @param {String} msgCode 消息类.状态及消息号 状态枚举[E-错误 W-警告 S-成功 I-消息],消息号3位数字
 * @param {Array,String,Number,Boolean} param 参数，[p1替换消息第一个&,p2替换消息第二个&,pn替换消息第n个]，未替换的直接拼接到一块
 * @param {Boolean} showNull 显示空
 * @param {Boolean} retMsg 是否返回消息内容，否则提醒
 */
export function $m(msgCode, param = [], showNull = false, retMsg = false) {
  if (!msgCode) return "";
  let _configArr = msgCode.split(".");
  if ((_configArr.length !== 2 && !_configArr[0]) || !_configArr[1] || _configArr[1].length !== 4) {
    Snackbar.error($t("消息类参数错误") + msgCode);
    return "";
  }
  const _mPar = {
    msgCode: _configArr[0],
    msgNo: _configArr[1].substring(1),
    msgType: _configArr[1].substring(0, 1)
  };

  //获取消息信息
  let message = "";
  const msgObj = szdStoreLocal.getMsg();
  if (msgObj[_mPar.msgCode] && msgObj[_mPar.msgCode][_mPar.msgNo]) {
    message = msgObj[_mPar.msgCode][_mPar.msgNo];
  }

  let _param = param !== undefined && param !== null ? (Array.isArray(param) ? param : [param]) : [];
  const _paramLen = _param.length;
  //替换&,组装消息
  let mArr = message.split("&");
  const mArrLen = mArr.length;
  message = msgCode + ": ";

  for (let i = 0; i < mArrLen; i++) {
    if (_paramLen > i) {
      if (showNull || (_param[i] !== null && _param[i] !== undefined)) {
        message = message + mArr[i] + _param[i];
      } else {
        message = message + mArr[i];
      }
    } else if (mArr[i]) {
      if (_paramLen === i) {
        message = message + mArr[i];
      } else {
        message = message + "&" + mArr[i];
      }
    }
  }

  //多余参数拼接到后边
  if (_paramLen > mArrLen) {
    for (let j = mArrLen; j < _paramLen; j++) {
      if (showNull || (_param[j] !== null && _param[j] !== undefined)) {
        message = message + " " + _param[j];
      }
    }
  }

  if (retMsg) return message;

  if (_mPar.msgType === "S") {
    Snackbar.success(message);
  } else if (_mPar.msgType === "W") {
    Snackbar.warning(message);
  } else if (_mPar.msgType === "E") {
    Snackbar.error(message);
  } else {
    Snackbar.info(message);
  }
}

/**
 * 提示成功
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mS(message, t = true, split = "") {
  let msg = $mR(message, t, split);
  Snackbar.success(msg);
}

/**
 * 提示警告
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mW(message, t = true, split = "") {
  let msg = $mR(message, t, split);
  Snackbar.warning(msg);
}

/**
 * 提示错误
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mE(message, t = true, split = "") {
  let msg = $mR(message, t, split);
  Snackbar.error(msg);
}

/**
 * 提示消息
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mI(message, t = true, split = "") {
  let msg = $mR(message, t, split);
  Snackbar.info(msg);
}

/**
 * 获得消息组合
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 * @return {String} 返回组合的消息
 */
export function $mR(message, t = true, split = "") {
  if (!message) return "";
  let _msg = "";
  if (Array.isArray(message)) {
    for (let i = 0; i < message.length; i++) {
      if (message[i] !== null && message[i] !== undefined) {
        if (split && _msg) {
          _msg = _msg + split;
        }
        if (t) {
          _msg = _msg + $t(message[i]);
        } else {
          _msg = _msg + message[i];
        }
      }
    }
  } else {
    if (t) {
      _msg = $t(message);
    } else {
      _msg = message;
    }
  }
  return _msg;
}

/**
 * 检查是否空, 提示消息
 * @param val 检查的对象
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 * @return {Boolean} 返回Bool
 */
export function $mNull(val, message, t = true, split = "") {
  if (!val) {
    let msg = $mR(message, t, split);
    Snackbar.error(msg);
    return true;
  } else {
    return false;
  }
}

/**
 * 检查是否是空, 添加消息列表
 * @param {Array}  msgList 消息列表 [{ light:指示灯 枚举：1.红灯 2.黄灯 3.绿灯 其它灰灯 retCode:消息码 retMsg:消息内容}]
 * @param val 检查的对象
 * @param {String|Array} message 消息
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mListNull(msgList, val, message, t = true, split = "") {
  if (!val) {
    let msg = $mR(message, t, split);
    msgList.push({ light: "1", retCode: "E", retMsg: msg });
  }
}

/**
 * 添加消息列表
 * @param {Array}  msgList 消息列表 [{ light:指示灯 枚举：1.红灯 2.黄灯 3.绿灯 其它灰灯 retCode:消息码 retMsg:消息内容}]
 * @param {String|Array} message 消息
 * @param {String} retCode 消息码  S成功 W警告 E失败 默认E
 * @param {Boolean} t 翻译
 * @param {String} split 分割符
 */
export function $mList(msgList, message, retCode = "E", t = true, split = "") {
  let msg = $mR(message, t, split);
  const _f = retCode ? retCode[0].toUpperCase() : "E";
  msgList.push({ light: _f === "S" ? "3" : _f === "W" ? "2" : "1", retCode: retCode, retMsg: msg });
}
