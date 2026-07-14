import router from "@/router";
import axios from "axios";
import store from "~store";
import { Dialog, Snackbar } from "@varlet/ui";
import { $t } from "./globalConfig";
import errorCode from "./errorCode";
import szdStoreCookie from "../store/storeCookie";
import szdStoreSession from "../store/storeSession";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers["Accept-Language"] = szdStoreCookie.getLanguage() ? szdStoreCookie.getLanguage() : "zh-CN";

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 60000
});

// 处理多个401重复弹出重新登录的问题
window.is500 = false;
let messageBoxFlag = 0;
// request拦截器
service.interceptors.request.use(
  config => {
    //超时设置
    const timeoutConnect = szdStoreSession.getWebParams("timeout", false)?.[process.env.VUE_APP_SYS_CODE + "_WEB"];
    if (timeoutConnect && timeoutConnect > 10000) config.timeout = timeoutConnect;
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (szdStoreCookie.getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + szdStoreCookie.getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    Snackbar.error(error.message);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const message = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      if (messageBoxFlag === 0) {
        messageBoxFlag = 1;
        Dialog({
          message: $t("登录状态已过期，您可以继续留在该页面，或者重新登录"),
          title: $t("系统提示"),
          confirmButtonText: $t("重新登录"),
          cancelButtonText: $t("取消"),
          dialogStyle: { background: "#fff" }
        })
          .then(act => {
            if (act === "confirm") {
              store.dispatch("LogOut").then(() => {
                router.replace({ path: "/login" });
              });
            }
            messageBoxFlag = 0;
          })
          .catch(err => {
            messageBoxFlag = 0;
          });
      }
      return res.data;
    } else if (code === 500) {
      Snackbar.error(message);
      return res.data; //Promise.reject(new Error(message))
    } else if (code !== 200) {
      Snackbar.error(message);
      return res.data; //Promise.reject('error')
    } else {
      return res.data;
    }
  },
  error => {
    Snackbar.error(error.message);
    if (error.response && error.response.status === 401) {
      store.dispatch("LogOut").then(() => {
        router.replace({
          path: "/login"
        });
      });
    }
    return Promise.reject(error);
  }
);

export default service;
