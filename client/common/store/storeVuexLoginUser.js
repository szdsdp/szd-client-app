import router from "@/router";
import szdStoreSession from "./storeSession";
import szdStoreCookie from "./storeCookie";
import szdStoreLocal from "./storeLocal";
import { getUserInfo, logout, getLang, getDict, loginOthers, getMsg } from "../api/login";

//系统代码、WebSocket应用
const SYS_CODE = process.env.VUE_APP_SYS_CODE;

//view->actions->mutations->state->view  view通过dispatch提交到actions，actions通过commit提交到mutations，并最终修改state中的数据
const loginUser = {
  state: {
    token: "", //获取token
    user: {}, //用户信息
    menus: [], //菜单信息
    routesObj: {}, // 路由对象
    sysMicro: {}, //微应用
    webParams: {}, //Web参数配置
    autocomplete: [], //自动补全配置
    homeConfig: {}, //主题配置
    perParams: {} //个人参数配置
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_ROUTESOBJ: (state, routesObj) => {
      state.routesObj = routesObj;
    },
    SET_SYSMICRO: (state, sysMicro) => {
      state.sysMicro = sysMicro;
    },
    SET_WEBPARAMS: (state, webParams) => {
      state.webParams = webParams;
    },
    SET_AUTOCOMPLETE: (state, autocomplete) => {
      state.autocomplete = autocomplete;
    },
    SET_HOMECONFIG: (state, homeConfig) => {
      state.homeConfig = homeConfig;
    },
    SET_PERPARAMS: (state, perParams) => {
      state.perParams = perParams;
    }
  },
  actions: {
    //获取用户信息
    GetUserInfo({ commit }) {
      return new Promise(resolve => {
        let _loginUser = szdStoreSession.getCoreLogin();
        if (_loginUser && _loginUser.token === szdStoreCookie.getToken()) {
          setVuexLoginUser({ commit }, _loginUser); //设置vuex
          resolve(true);
        } else {
          getUserInfo().then(res => {
            if (res && res.code === 200) {
              dealUserInfo({ commit }, res).then(resLoginUser => {
                setVuexLoginUser({ commit }, resLoginUser); //设置vuex
              });
              //三方系统登录
              LoginOthers(res.user.userId);
              //下载本地存储
              downloadLocalStore(res.localMd5, res.user.language, res.user.userId);
              resolve(true);
            } else {
              szdStoreCookie.removeToken();
              szdStoreSession.removeCoreLogin();
              resolve(false);
            }
          });
        }
      });
    },
    //退出系统
    LogOut({ commit }) {
      return new Promise(resolve => {
        if (szdStoreCookie.getToken()) {
          logout(szdStoreCookie.getToken()).then(res => {
            clearStore({ commit });
            resolve(true);
          });
        } else {
          clearStore({ commit });
          resolve(true);
        }
      });
    }
  }
};

// 获取用户信息-处理
function dealUserInfo({ commit }, res) {
  return new Promise(resolve => {
    let _loginUser = {
      token: szdStoreCookie.getToken(),
      user: res.user, //用户
      menus: res.menus, //展示菜单
      routesObj: {}, //路由
      sysMicro: {}, //微应用
      webParams: {}, //web参数
      autocomplete: [], //自动补全
      homeConfig: {}, //主题配置
      perParams: res.userPer //个人参数
    };
    //路由转化对象
    _loginUser.routesObj = setRoutesObj(res.routers);
    //微应用对象
    for (let i = 0; i < res.sysMicro.length; i++) {
      const item = res.sysMicro[i];
      _loginUser.sysMicro[item.sysCode] = {
        sysCode: item.sysCode,
        sysName: item.sysName,
        sysWebIp: item.sysWebIp,
        sysWebSocket: item.sysWebSocket
      };
    }
    //web参数
    for (let i = 0; i < res.webParams.length; i++) {
      const item = res.webParams[i];
      if (item.configType && item.configKey && item.configValue) {
        try {
          if (item.configKey === "web_table_pagination") {
            let temp = JSON.parse(item.configValue);
            if (Array.isArray(temp) && temp.length > 0) {
              _loginUser.webParams[item.configKey] = JSON.parse(item.configValue);
            }
          } else if (item.configJson) {
            _loginUser.webParams[item.configKey] = JSON.parse(item.configValue);
          } else {
            _loginUser.webParams[item.configKey] = item.configValue;
          }
        } catch (e) {
          console.error("webParams JSON解析失败, configKey: " + item.configKey + " 转化内容configValue," + item.configValue, e);
        }
      }
    }
    //timeout参数
    _loginUser.webParams["timeout"] = {};
    for (let i = 0; i < res.timeout.length; i++) {
      const item = res.timeout[i];
      const numValue = Number(item.configValue);
      if (item.configKey && item.configValue && Number.isFinite(numValue) && numValue > 0) {
        _loginUser.webParams.timeout[item.configKey] = numValue;
      }
    }
    //自动补全
    _loginUser.autocomplete = res.autocomplete && res.autocomplete.length > 0 ? res.autocomplete : [];
    //home和导航配置
    _loginUser.homeConfig = setHomeConfig(res.homeConfig, _loginUser.routesObj);
    //md5参数
    _loginUser.webParams["localMd5"] = res.localMd5;
    //设置store
    szdStoreSession.setCoreLogin(_loginUser);
    //处理完成返回
    resolve(_loginUser);
  });
}

//设置路由对象
function setRoutesObj(routesArr) {
  let routesObj = {};
  for (let i = 0; i < routesArr.length; i++) {
    const item = routesArr[i];
    if (!item.routerCode || !item.sysCode || !item.sysCodeWeb) {
      console.error(item.routerCode + "系统代码或路由代码未配置");
      continue;
    }
    item.routerCode = item.routerCode.toUpperCase();
    //url访问地址
    let _path = "/" + item.routerCode.toLowerCase();
    //PC应用打开地址
    if (!item.compUrlApp) {
      //拼接参数
      if (item.params) _path = _path + item.params;
      //非本应用路由 微应用打开
      if (item.sysCodeWeb !== SYS_CODE && !item.destCode) _path = `/micro${_path}`;
      //三方系统使用iframe打开
      if (item.destCode) _path = "/dest" + _path;
    } else {
      //拼接参数
      if (item.paramsApp) _path = _path + item.paramsApp;
    }

    //挂载组件地址
    let _component = item.compUrlApp ? item.compUrlApp : "";
    //弹窗模式
    let _iframeMode = item.iframeMode ? item.iframeMode : "1";
    //设置参数对象
    routesObj[item.routerCode] = {
      routerCode: item.routerCode, //路由代码
      routerName: item.routerName, //路由名称
      routerType: item.routerType, //路由类型
      path: _path, //url显示的路径
      component: _component, //挂载组件地址
      componentUrl: _component,

      program: item.program, //程序代码
      sysCode: item.sysCode, //系统代码
      sysCodeWeb: item.sysCodeWeb, //前端系统代码
      destCode: item.destCode ? item.destCode : "", //三方系统
      titleApp: item.titleApp ? item.titleApp : "", //APP标题
      //工作流信息
      wfBatchApprFlag: item.wfBatchApprFlag, //批量审批
      wfRejectReasonFlag: item.wfRejectReasonFlag, //拒绝原因

      //iframe弹窗框架
      iframeMode: _iframeMode, //弹窗模式 1.组件模式 2.iframe无框架 3.iframe有框架
      iframeVue: _iframeMode === "1" && !item.destCode, //是否组件模式
      //打印路由代码和打印路由程序
      routerCodePrt: item.routerCodePrt, //打印页面
      programPrt: item.programPrt, //打印页面
      //业务类型
      bstp: item.bstp,
      bstpCount: item.bstpCount,
      //菜单权限-编辑
      authEdit: item.authEdit, //菜单权限-编辑
      //路由默认参数
      name: item.routerCode, //用于检查唯一值
      meta: {
        name: item.routerCode,
        title: item.routerName,
        sysCodeWeb: item.sysCodeWeb, //前端系统代码
        keepAlive: item.keepAlive //页面缓存
      }
    };
  }
  return routesObj;
}

//设置首页和导航配置
function setHomeConfig(homeConfig, routesObj) {
  let _param = homeConfig ? homeConfig : {};
  let _homeConfig = {
    license: _param.license //是否商业授权\
  };
  return _homeConfig;
}

//设置Vuex和加载路由
function setVuexLoginUser({ commit }, _loginUser) {
  commit("SET_TOKEN", szdStoreCookie.getToken());
  commit("SET_USER", _loginUser.user);
  commit("SET_MENUS", _loginUser.menus);
  commit("SET_ROUTESOBJ", _loginUser.routesObj);
  commit("SET_SYSMICRO", _loginUser.sysMicro);
  commit("SET_WEBPARAMS", _loginUser.webParams);
  commit("SET_AUTOCOMPLETE", _loginUser.autocomplete);
  commit("SET_HOMECONFIG", _loginUser.homeConfig);
  commit("SET_PERPARAMS", _loginUser.perParams);
  //加载路由: 三方系统的不加载 仅加载自己的微应用，其它微应用各自加载
  for (let key in _loginUser.routesObj) {
    let item = _loginUser.routesObj[key];
    //挂载组件
    if (item.component && !router.hasRoute(item.routerCode) && item.sysCodeWeb === SYS_CODE) {
      item.component = loadView(item.component);
      router.addRoute("Layout", item); //带框架
    }
  }
  //安装svg
  installSvg();
  //设置字体
  setFontSize(_loginUser.user);
}

//路由懒加载，需要的时候进行加载
export const loadView = view => {
  return () => import(`@/modules/${view}`);
};

//清空存储
function clearStore({ commit }) {
  szdStoreCookie.removeToken();
  szdStoreSession.removeCoreLogin();
  commit("SET_TOKEN", "");
  commit("SET_USER", {});
  commit("SET_MENUS", []);
  commit("SET_ROUTESOBJ", {});
  commit("SET_SYSMICRO", {});
  commit("SET_WEBPARAMS", {});
  commit("SET_AUTOCOMPLETE", []);
  commit("SET_HOMECONFIG", {});
  commit("SET_PERPARAMS", {});
}

//下载本地存储
function downloadLocalStore(localMd5, language, userId) {
  //语言包下载
  if (szdStoreLocal.getLangMd5(localMd5.lang + "_" + language) || !szdStoreLocal.getLang()) {
    getLang(szdStoreCookie.getLanguage()).then(res => {
      if (res.data) {
        szdStoreLocal.setLang(res.data);
        szdStoreLocal.setLangMd5(localMd5.lang + "_" + language);
      }
    });
  }
  //数据字典下载
  if (szdStoreLocal.getDictMd5(localMd5.dict + "_" + language) || !szdStoreLocal.getDict()) {
    getDict().then(res => {
      if (res.data) {
        szdStoreLocal.setDict(res.data);
        szdStoreLocal.setDictMd5(localMd5.dict + "_" + language);
      }
    });
  }
  //消息信息下载
  if (szdStoreLocal.getMsgMd5(localMd5.msg + "_" + language) || !szdStoreLocal.getMsg()) {
    getMsg().then(res => {
      if (res.data) {
        szdStoreLocal.setMsg(res.data);
        szdStoreLocal.setMsgMd5(localMd5.msg + "_" + language);
      }
    });
  }
  // 登录用户
  szdStoreLocal.setUserId(userId);
}

//安装svg内容
function installSvg() {
  if (document.getElementById("szdSvgId")) return;
  const svgWrap = document.createElement("div");
  svgWrap.id = "szdSvgId";
  svgWrap.style.cssText = "position:absolute;left:0;height:0;display:none;";
  svgWrap.innerHTML = szdStoreLocal.getSvg();
  document.body.insertBefore(svgWrap, document.getElementById("app"));
}

//设置字体
function setFontSize(user) {}

//三方系统登录
function LoginOthers(userId) {
  loginOthers(userId).then(res => {
    if (res.code === 200) {
      if (res.data !== null && res.data !== undefined && res.data.length > 0) {
        res.data.forEach(item => {
          if (item.retCode === "S") {
            szdStoreCookie.setTokenOther(item); //token赋值
          } else if (item.retCode === "E") {
            console.error(item.destCode + ":" + item.retMsg);
          }
        });
      }
    }
  });
}

export default loginUser;
