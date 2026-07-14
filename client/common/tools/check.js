import { Snackbar } from "@varlet/ui";
import { $mR } from "../utils/globalConfig";

/**
 * 检查是否是空, 提示消息
 * @param val 检查的对象
 * @param {String,Array} msg 报错消息
 * @return {Boolean} 返回true为空，false不为空
 */
function nullMsg(val, msg) {
  if (!val) {
    showMsg(msg, false);
    return true;
  } else {
    return false;
  }
}

/**
 * 检查是否是空并翻译消息, 提示消息
 * @param val 检查的对象
 * @param  {String,Array} msg 报错消息
 * @return {Boolean} 返回true为空，false不为空
 */
function nullMsg$t(val, msg) {
  if (!val) {
    showMsg(msg, true);
    return true;
  } else {
    return false;
  }
}

/** 输出消息 **/
function showMsg(msg, t) {
  if (!msg) return;
  let _msg = $mR(msg, t);
  if (_msg) {
    Snackbar.error(_msg);
  }
}

const szdCheck = {
  nullMsg,
  nullMsg$t
};

export default szdCheck;
