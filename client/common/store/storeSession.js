import { $m } from "../utils/globalConfig";

//存储登录用户信息
const coreLoginKey = "SZDCORE-Admin-CoreLogin-App";

/**
 * 获取登录Session
 * @return {Object} loginUser 返回对象
 * {
 *  token,
 *  appWeb, //app端访问
 *  user, //用户
 *  menus, //展示菜单
 *  routesObj, //路由
 *  sysMicro, //微应用
 *  webParams, //web参数
 *  autocomplete, //自动补全
 *  homeConfig, //主题配置
 *  perParams //个人参数
 * }
 * */
function getCoreLogin() {
  return JSON.parse(sessionStorage.getItem(coreLoginKey));
}

/**
 * 设置登录Session
 * @param {Object} loginUser 设置Session
 * {
 *  token,
 *  appWeb, //app端访问
 *  user, //用户
 *  menus, //展示菜单
 *  routesObj, //路由
 *  sysMicro, //微应用
 *  webParams, //web参数
 *  autocomplete, //自动补全
 *  homeConfig, //主题配置
 *  perParams //个人参数
 * }
 * */
function setCoreLogin(loginUser) {
  sessionStorage.setItem(coreLoginKey, JSON.stringify(loginUser));
}

/** 删除登录session */
function removeCoreLogin() {
  sessionStorage.removeItem(coreLoginKey);
}

/*************************************************
 * 数据锁
 */
const szdLockKey = "szdLock";

/** 获取锁数据 */
function getLock() {
  let _lock = JSON.parse(sessionStorage.getItem(szdLockKey));
  if (_lock) {
    return _lock;
  } else {
    return [];
  }
}

/** 添加锁数据 */
function setLockAdd(data) {
  let _lock = getLock();
  _lock.push(data);
  sessionStorage.setItem(szdLockKey, JSON.stringify(_lock));
}

/** 删除锁数据 */
function setLockDel(data) {
  let _lock = getLock();
  if (_lock.length > 0) {
    const _index = _lock.findIndex(r => r.lockCode === data.lockCode && JSON.stringify(r.lockData) === JSON.stringify(data.lockData));
    if (_index !== -1) {
      _lock.splice(_index, 1);
      sessionStorage.setItem(szdLockKey, JSON.stringify(_lock));
      return true;
    }
  }
  return false;
}

/** 移除锁数据 */
function removeLock() {
  sessionStorage.removeItem(szdLockKey);
}

/*************************************************
 * 获取Web端参数 【在全局参数中 CORE_SYS_WEB 配置】
 * @param {String} key 参数键值
 * @param {Boolean} showError 未配置显示错误消息
 * @return {String} 返回参数
 */
function getWebParams(key, showError = true) {
  const webParams = JSON.parse(sessionStorage.getItem(coreLoginKey))?.webParams;
  if (webParams && webParams[key]) {
    return webParams[key];
  } else {
    if (showError && webParams) {
      $m("CORE_CLIENT.E025", key); //获取web端参数 & 不存在
    }
  }
}

const szdStoreSession = {
  getCoreLogin,
  setCoreLogin,
  removeCoreLogin,
  getLock,
  setLockAdd,
  setLockDel,
  removeLock,
  getWebParams
};

export default szdStoreSession;
