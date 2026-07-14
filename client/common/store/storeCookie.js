//存储token
import Cookies from "js-cookie";
import szdStoreSession from "./storeSession";

/*************************************************
 * token
 */

const tokenKey = "SZDCORE-Admin-Token";

/**
 * 获取登录token
 * @return {String} 返回路由代码
 */
function getToken() {
  return Cookies.get(tokenKey);
}

/**
 * 设置登录token
 * @param {String} token 传入token
 */
function setToken(token) {
  Cookies.set(tokenKey, token);
}

/** 删除登录token */
function removeToken() {
  Cookies.remove(tokenKey);
  szdStoreSession.removeLock();
}

/*************************************************
 * 登录语言
 */

const const_language = "SZDCORE-Language";
let language_val;

/**
 * 获取登录语言
 * @return {String} 返回语言代码
 */
function getLanguage() {
  if (!language_val) {
    language_val = Cookies.get(const_language);
    if (!language_val) {
      language_val = "zh-CN";
      setLanguage(language_val);
    }
  }
  return language_val;
}

/** 设置登录语言
 * @param {String} language 语言代码
 */
function setLanguage(language) {
  language_val = language ? language : "zh-CN";
  Cookies.set(const_language, language_val, { expires: 30, SameSite: "Strict", httpOnly: true });
}

/*************************************************
 * 外围系统token赋值
 */
function setTokenOther(loginOther) {
  if (loginOther) {
    try {
      Cookies.set(loginOther.tokenInfo.tokenName, encodeURIComponent(loginOther.tokenInfo.token), {
        domain: loginOther.tokenInfo.tokenDomain,
        path: "/"
      });
    } catch (e) {
      console.error(loginOther.destCode + "登录失败:浏览器Cookie写入异常");
    }
  }
}

/*************************************************
 * dev APP开发参数设置
 */

/** dev */
const szdDev = "szdDevApp";

/** 获取dev */
function getDev() {
  const dbDev = Cookies.get(szdDev);
  return dbDev ? JSON.parse(dbDev) : {};
}

/** 设置dev */
function setDev(val) {
  if (!val || Object.keys(val).length === 0) {
    Cookies.remove(szdDev);
  } else {
    Cookies.set(szdDev, JSON.stringify(val));
  }
}

const szdStoreCookie = {
  getToken,
  setToken,
  removeToken,
  getLanguage,
  setLanguage,
  setTokenOther,
  getDev,
  setDev
};

export default szdStoreCookie;
