import request from "../utils/request";
import requestNoLoading from "../utils/requestNoLoading";

// 登录方法-单独
export function login(obj) {
  const data = {
    userId: obj.userId.trim(), //用户登录id
    password: obj.password, //用户密码
    appOpenUuid: obj.appOpenUuid || "" //三方系统绑定uuid
  };
  return request({
    url: "/app/core/login",
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getUserInfo() {
  return request({
    url: "/core/user/auth/getUserInfo",
    method: "get",
    params: { sysCodeWeb: "CORE", app: true }
  });
}

// 获取短信验证码
export function getSmsCode(param) {
  return request({
    url: "/core/login/smsCode?phoneNum=" + param,
    method: "get"
  });
}

// 短信登录方法-单独
export function loginSms(obj) {
  const data = {
    userId: obj.phone, //用户手机号
    code: obj.code, //验证码
    uuid: obj.uuid, //验证码对应后端uuid
    appOpenUuid: obj.appOpenUuid || "" //三方系统绑定uuid
  };
  return request({
    url: "/app/core/login/sms",
    method: "post",
    data: data
  });
}

//外围系统集成登录
export function loginOthers(userId) {
  return requestNoLoading({
    url: "/core/login/others/" + userId,
    method: "get"
  });
}

// 外围系统功能穿透-用户登录
// 返回：{token:"", userId:'', appOpenUuid:'',  routerCode:'', params:{}}
export function ssoLogin(data = {}) {
  return request({
    url: "/core/login/sso",
    method: "post",
    data: data
  });
}

// 获取LOGO等配置信息
export function getLoginConfig() {
  return request({
    url: "/core/login/config",
    method: "get"
  });
}

// 更改密码
export function changePwd(data) {
  return request({
    url: "/core/login/changePwd",
    method: "post",
    data: data
  });
}

// 退出方法
export function logout() {
  return request({
    url: "/app/core/logout",
    method: "post"
  });
}

// 移除已登录的用户
export function removeLogged(data) {
  return request({
    url: "/core/user/auth/remove/logged",
    method: "post",
    data: data
  });
}

// 获取语言字典
export function getLang(lang) {
  return request({
    url: "/core/dev/lang/bundle/" + lang,
    method: "get"
  });
}

export function getSvg() {
  return request({
    url: "/core/dev/svg/download",
    method: "get"
  });
}

export function getDict() {
  return request({
    url: "/core/dev/baseField/dict",
    method: "get"
  });
}

export function getMsg() {
  return request({
    url: "/core/dev/msg/download",
    method: "get"
  });
}

// 获取白名单
export function getWhiteList() {
  return requestNoLoading({
    url: "/core/dev/whitelist/app",
    method: "get"
  });
}
