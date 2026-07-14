import router from "@/router";
import axios from "axios";
import store from "~store";
import { Dialog, Snackbar } from "@varlet/ui";
import { $t } from "./globalConfig";
import errorCode from "./errorCode";
import szdStoreCookie from "../store/storeCookie";
import szdStoreSession from "../store/storeSession";
import szdLoading from "../message/loading";

let loadingNum = 0;

function startLoading() {
  if (loadingNum === 0) {
    szdLoading.show();
  }
  loadingNum++;
}

function endLoading() {
  if (loadingNum > 0) {
    loadingNum--;
    if (loadingNum <= 0) {
      szdLoading.close();
      loadingNum = 0;
    }
  }
}

axios.defaults.headers["Content-Type"] = "multipart/form-data";
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
    if (timeoutConnect && timeoutConnect > 60000) config.timeout = timeoutConnect;
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (szdStoreCookie.getToken() && !isToken) {
      config.headers["Authorization"] = "Bearer " + szdStoreCookie.getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    Snackbar.error(error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    endLoading();
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
    endLoading();
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

/**
 * 文件上传
 * @param {String} url 上传接口地址
 * @param {FormData} formData 包含文件的FormData对象
 * @param {Function} onProgress 进度回调 (progress: {percent：number}) => void
 * @param {Object} options 可选配置（headers等）
 * @param {Boolean} loadingFlag 显示loading
 * @returns {Promise} 上传结果
 */
export const requestUploadFile = (url, formData, onProgress, options = {}, loadingFlag = false) => {
  if (loadingFlag) startLoading();
  const requestConfig = {
    method: "post",
    url: url,
    data: formData,
    //进度监听 计算进度百分比（0-100）
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable && typeof onProgress === "function" && progressEvent.total > 0) {
        const progress = {
          event: progressEvent,
          percent: Math.round((progressEvent.loaded / progressEvent.total) * 100)
        };
        onProgress(progress);
      }
    },
    ...options
  };
  //执行上传请求
  return service.request(requestConfig);
};

export default {
  requestUploadFile
};
