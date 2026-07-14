import _ from "lodash";
import router from "@/router";
import szdStoreSession from "../store/storeSession";
import szdStoreCookie from "../store/storeCookie";
import { createVNode, render } from "vue";
import { $m } from "./globalConfig";
import { szdIfrDg } from "../../components/ifrDg/ifrDg.js";
import qs from "qs";

//系统代码
const SYS_CODE = process.env.VUE_APP_SYS_CODE;
const env = process.env.VUE_APP_SYS_ENV;

// 微信环境变量
const wxConfig = {
  isValidWx: false, // 是否验证微信环境
  isMiniProgram: false, // 是否是微信小程序环境
  getEnv: () => {
    if (wxConfig.isValidWx) return;
    if (!wx || !wx.miniProgram) {
      wxConfig.isValidWx = true;
      wxConfig.isMiniProgram = false;
      return;
    }
    wx.miniProgram.getEnv(res => {
      const { miniprogram } = res;
      wxConfig.isMiniProgram = !!miniprogram;
      wxConfig.isValidWx = true;
    });
  }
};
// 验证微信环境
wxConfig.getEnv();

/**
 * 获取路由代码
 * @param {Object} _route 路由对象(默认当前路由)
 * @return {String} 返回路由代码
 */
function getRouterCode(_route = undefined) {
  const currentRoute = _route ? _route : router.currentRoute.value;
  let rCode = currentRoute.name;
  return rCode ? rCode.toUpperCase() : "";
}

/**
 * 获取路由代码-根据路径
 * @param {String} path 路径
 * @return {String} 返回路由代码
 */
function getRouterCodePath(path) {
  let ls_route = undefined;
  const routesObj = szdStoreSession.getCoreLogin().routesObj;
  for (let key in routesObj) {
    if (routesObj[key].path === path.toLowerCase()) {
      ls_route = routesObj[key];
      break;
    }
  }
  return ls_route ? ls_route.routerCode : "";
}

/**
 * 获取路由对象
 * @param {String} routerCode 路由代码
 * @return {Object} 返回路由对象
 */
function getRouterObj(routerCode) {
  if (routerCode) {
    routerCode = routerCode.toUpperCase();
    const routerObj = szdStoreSession.getCoreLogin().routesObj[routerCode];
    if (routerObj) {
      return routerObj;
    } else {
      $m("CORE_CLIENT.E022", routerCode); //路由代码 & 不存在或无权限
    }
  } else {
    $m("CORE_CLIENT.E020", routerCode); //路由代码不能为空
  }
  return null;
}

/**
 * 路由跳转或弹窗页面
 * @param {String} routerCode 路由代码
 * @param {Object} params 地址参数
 * @param {Object} mode 导航模式 dialog 弹窗打开
 */
export function goNav(routerCode, params = {}, mode = { dialog: false }) {
  if (!routerCode) {
    $m("CORE_CLIENT.E020", routerCode); //路由代码不能为空
    return;
  }
  routerCode = routerCode.toUpperCase();
  //检查和获取路由对象
  const routerObj = getRouterObj(routerCode);
  if (!routerObj) return;
  //检查路由信息
  if (!routerObj.path) {
    $m("CORE_CLIENT.E024", routerCode); //路由 & 地址不存在
    return;
  }

  //打开应用
  if (routerObj.component && routerObj.sysCodeWeb === SYS_CODE) {
    if (wxConfig.isMiniProgram) {
      // 拼接完整路径
      let fullPath = location.origin + "/app-" + SYS_CODE.toLowerCase() + routerObj.path;
      wx.miniProgram.navigateTo({
        url: "/pages/h5/pageEntry?webUrl=" + encodeURIComponent(getFullPath(fullPath, params))
      });
    } else {
      if (routerObj.path.includes("/:")) {
        router.push({ name: routerObj.name, params: params }).then();
      } else {
        router.push({ path: routerObj.path, query: params }).then();
      }
    }
    return;
  }

  //访问其它应用
  let sysWebIp = "";
  //访问其他APP应用
  if (routerObj.component) {
    sysWebIp = location.protocol + "//" + location.hostname + ":" + location.port;
    //本地调用
    if (env === "development") {
      const devParam = szdStoreCookie.getDev();
      if (devParam && devParam.devIp) {
        if (
          devParam.devIp[routerObj.sysCodeWeb] &&
          devParam.devIp[routerObj.sysCodeWeb].vuePortApp &&
          devParam.devIp[routerObj.sysCodeWeb].vueActiveApp
        ) {
          sysWebIp = "http://localhost:" + devParam.devIp[routerObj.sysCodeWeb].vuePortApp;
          console.warn("调用本地应用系统-" + sysWebIp);
        } else if (devParam.devIp["CORE"] && devParam.devIp["CORE"].vuePortApp && devParam.devIp["CORE"].vueActiveApp) {
          sysWebIp = devParam.devIp["CORE"].vuePortApp;
          console.warn("调用本地应用系统-" + sysWebIp);
        }
      }
    }
    //服务增加前缀
    sysWebIp = sysWebIp + "/app-" + routerObj.sysCodeWeb.toLowerCase();
  } else {
    //用户信息
    const loginUser = szdStoreSession.getCoreLogin();

    //访问PC应用
    sysWebIp = loginUser.sysMicro["CORE"].sysWebIp;
    //本地调用
    if (env === "development") {
      const devParam = szdStoreCookie.getDev();
      if (devParam && devParam.devIp && devParam.devIp["CORE"] && devParam.devIp["CORE"].vuePort && devParam.devIp["CORE"].vueActive) {
        sysWebIp = "http://localhost:" + devParam.devIp["CORE"].vuePort;
        console.warn("调用本地应用系统-" + sysWebIp);
      }
    }
  }
  if (sysWebIp) {
    let _params = _.cloneDeep(params);
    if (!sysWebIp.toLowerCase().includes(location.hostname.toLowerCase())) {
      _params["token"] = szdStoreCookie.getToken();
    }
    sysWebIp = sysWebIp + routerObj.path;

    const fullPath = getFullPath(sysWebIp, _params);

    if (!wxConfig.isMiniProgram) return (location.href = fullPath);
    wx.miniProgram.navigateTo({
      url: "/pages/h5/pageEntry?webUrl=" + encodeURIComponent(fullPath)
    });
  }
}

/**
 * 跳转弹窗页面
 * @param {String} routerCode 路由代码
 * @param {Object} params 地址参数
 * @param {Object} mode 导航模式 prt 打印
 */
export function goNavDg(routerCode, params = {}, mode = { prt: false }) {
  //检查和获取路由对象
  const routerObj = getRouterObj(routerCode);
  if (!routerObj) return null;

  //打开应用
  if (mode.prt) {
    //跳转打印路由
    if (routerObj.routerCodePrt) {
      szdIfrDg(routerObj.routerCodePrt, params).then();
    } else {
      $m("CORE_CLIENT.E021"); //本功能不支持打印
    }
  } else {
    szdIfrDg(routerCode, params).then();
  }
}

/**
 * 退出登录，需要预检环境
 */
export function logoutNavigate() {
  if (wxConfig.isMiniProgram) {
    wx.miniProgram.reLaunch({
      url: "/pages/login/def"
    });
  } else {
    location.reload();
  }
}

/**
 * 获取路由的全路径
 * @param {String} routerCode 路由代码
 * @param {Object} params 地址参数
 * @return {String} 返回Url地址
 */
function goNavPath(routerCode, params = {}) {
  if (!routerCode) {
    $m("CORE_CLIENT.E020"); //路由代码不能为空
    return null;
  }
  routerCode = routerCode.toUpperCase();
  //检查和获取路由对象
  const routerObj = getRouterObj(routerCode);
  if (!routerObj) return null;
  //检查路由信息
  if (!routerObj.path) {
    $m("CORE_CLIENT.E024", routerCode); //路由 & 地址不存在
    return null;
  }
  //跳转路全路径
  return getFullPath(routerObj.path, params);
}

/**
 * 参数转换为Url全路径
 * @param {String} path 路径
 * @param {Object} params 地址参数
 */
function getFullPath(path, params) {
  let fullPath = path;
  if (Object.keys(params).length === 0) return fullPath;

  if (fullPath.includes("/:")) {
    const parArr = fullPath.split("/").filter(item => item.startsWith(":"));
    parArr.forEach(item => {
      const key = item.replace(":", "");
      fullPath = fullPath.replace(`:${key}`, encodeURIComponent(params[key]));
    });
  } else {
    const query = setUrlParams(params);
    if (query) {
      fullPath = fullPath + "?" + query;
    }
  }
  return fullPath;
}

/**
 * 解析Url参数
 */
function getUrlParams(query) {
  return qs.parse(query);
}

/**
 * 转换Url参数
 */
function setUrlParams(params) {
  return qs.stringify(params);
}

/**
 * 替换URL地址
 * @param {Object|String} params 地址参数
 * @param {Boolean} replaceState 替换方式 true不刷新页面，替换当前回退地址
 */
function replaceUrl(params, replaceState = true) {
  let urlPar = "";
  if (typeof params === "string") {
    urlPar = params;
  } else {
    for (let key in params) {
      if (params[key] === undefined) continue;
      if (!urlPar) {
        urlPar = key + "=" + params[key];
      } else {
        urlPar = urlPar + "&" + key + "=" + params[key];
      }
    }
  }
  let newUrl = `${window.location.origin}${window.location.pathname}`;
  if (urlPar) {
    newUrl = newUrl + "?" + urlPar;
  }
  if (replaceState) {
    window.history.replaceState(null, "", newUrl);
  } else {
    window.location.replace(newUrl);
  }
}

/**
 * 关闭当前页签-回退
 */
function closeFrameTag() {
  window.history.back();
}

/**
 * 动态加载路由
 * @param {Object} context 上下文
 * @param {String} routerCode 路由地址
 * @param {Object} params 参数
 * @param {String} renderId 挂载位置id
 * @param callback 回调方法
 */
function renderComp({ context, routerCode, params, renderId, callback }) {
  const routesObj = getRouterObj(routerCode);
  if (!routesObj || !routesObj.componentUrl) {
    $m("CORE_CLIENT.E022", routerCode); //路由代码 & 不存在或无权限
    return;
  }
  //动态挂载路由
  import(`@/modules/${routesObj.componentUrl}`).then(res => {
    const vNode = createVNode(res.default, {
      ...params,
      onCloseDialog: () => {
        if (callback) {
          callback();
        }
      }
    });
    vNode.appContext = context;
    render(vNode, document.querySelector("#" + renderId));
  });
}

const szdRouter = {
  getRouterCode,
  getRouterCodePath,
  getRouterObj,
  goNav,
  goNavDg,
  goNavPath,
  getFullPath,
  getUrlParams,
  setUrlParams,
  replaceUrl,
  closeFrameTag,
  renderComp
};

export default szdRouter;
