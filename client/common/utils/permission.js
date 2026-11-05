import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "~store";
import szdStoreSession from "../store/storeSession";
import szdStoreCookie from "../store/storeCookie";
import szdRouter from "./goRouter";
import { $m, $t } from "./globalConfig";
import { ssoLogin } from "../api/login";
import szdStoreLocal from "../store/storeLocal";
import { Dialog } from "@varlet/ui";

//进度条
NProgress.configure({ showSpinner: false });
//白名单
let whiteList = ["/login"];
//路由拦截器
router.beforeEach((to, from, next) => {
  NProgress.start();
  store.dispatch("setVuexDataWhiteList").then(() => {
    let toPath = to.path.toLowerCase();
    let token = szdStoreCookie.getToken();
    //白名单
    if (store.state.vuexData.whiteList && store.state.vuexData.whiteList.length > 0) {
      whiteList = store.state.vuexData.whiteList;
    }
    //单点登录，要打开的页面是core/sso, 虚拟路由
    if (toPath === "/core/sso") {
      ssoLoginCheck(to, from, next, token);
      return;
    }
    //单点登录，url携带token，进行比较是否和当前一致，不一致进行token重新取值
    if (to.query.token && to.query.token.length > 20 && (!token || token !== to.query.token)) {
      ssoLoginUrlToken(to, from, next, token);
      return;
    }

    if (szdStoreCookie.getToken()) {
      if (toPath === "/login") {
        next({ path: "/" });
      } else if (isWhiteList(toPath)) {
        next();
      } else if (store.state.loginUser.user.userId === undefined) {
        store.dispatch("GetUserInfo").then(res => {
          if (res) {
            next({ ...to, replace: true });
          } else {
            store.dispatch("LogOut").then(() => {
              next({ path: "/" });
            });
          }
        });
      } else {
        if (!router.hasRoute(to.name)) {
          NProgress.done();
          return;
        }
        next();
      }
    } else if (isWhiteList(toPath)) {
      next(); //免登录白名单
    } else {
      next(`/login`); //重定向到登录页
    }
  });
});

router.afterEach(() => {
  NProgress.done();
});

//检查白名单
function isWhiteList(toPath) {
  return whiteList.some(w => toPath === w || toPath.startsWith(w + "/"));
}

//单点登录检查
function ssoLoginCheck(to, from, next, token) {
  let _ssoParams = { path: to.path, query: to.query || {} };
  //将SSO单点登录，同时刷新有效期
  ssoLogin(_ssoParams).then(res => {
    if (res.code === 200 && res.data) {
      if (res.data.token) {
        if (token) {
          if (res.data.userId !== szdStoreLocal.getUserId()) {
            Dialog({
              message: $t("不同用户登录，登录信息将被重置, 是否继续?"),
              title: $t("提示"),
              confirmButtonText: $t("确认"),
              cancelButtonText: $t("取消"),
              dialogStyle: { background: "#fff" }
            })
              .then(act => {
                if (act === "confirm") {
                  ssoLoginNext(res.data, next, res.data.token);
                } else {
                  ssoLoginNext(res.data, next, token);
                }
              })
              .catch(() => {
                ssoLoginNext(res.data, next, token);
              });
          } else {
            ssoLoginNext(res.data, next, token);
          }
        } else {
          ssoLoginNext(res.data, next, res.data.token);
        }
      } else if (res.data.appOpenUuid) {
        Dialog({
          message: $t("用户未绑定, 是否进行用户绑定?"),
          title: $t("提示"),
          confirmButtonText: $t("确认"),
          cancelButtonText: $t("取消"),
          dialogStyle: { background: "#fff" }
        })
          .then(act => {
            if (act === "confirm") {
              ssoLoginBind(res.data, next, true);
            } else {
              ssoLoginBind(res.data, next, false);
            }
          })
          .catch(() => {
            ssoLoginBind(res.data, next, false);
          });
      } else {
        next({ path: "/" });
      }
    } else {
      $m("CORE_CLIENT.E017"); //单点登录未携带token信息，请联系对应系统技术人员
      next({ path: "/" });
    }
  });
}

//单点登录刷新登录有效期
function ssoLoginNext(urlQuery, next, resToken) {
  szdStoreSession.removeCoreLogin();
  szdStoreCookie.setToken(resToken);
  store.dispatch("GetUserInfo").then(res => {
    if (res) {
      ssoLoginRedirect(urlQuery, next);
    } else {
      store.dispatch("LogOut").then(() => {
        $m("CORE_CLIENT.E015"); //单点登录token已过期,请重新登录
        next({ path: "/" });
      });
    }
  });
}

//单点登录绑定三方应用
function ssoLoginBind(urlQuery, next, isBind) {
  szdStoreSession.removeCoreLogin();
  let loginUrlQuery = {};
  if (isBind) loginUrlQuery.appOpenUuid = urlQuery.appOpenUuid;
  if (urlQuery.routerCode) {
    loginUrlQuery.routerCode = urlQuery.routerCode;
    if (urlQuery.params) loginUrlQuery.params = btoa(encodeURIComponent(JSON.stringify(urlQuery.params)));
  }
  next({ path: "/login", query: loginUrlQuery });
}

//单点登录重新定向
function ssoLoginRedirect(urlQuery, next) {
  const routerCode = urlQuery.routerCode;
  if (!routerCode) {
    next({ path: "/" });
  } else {
    const routerObj = szdRouter.getRouterObj(routerCode);
    if (routerObj) {
      szdRouter.goNav(routerCode, urlQuery.params);
    } else {
      next({ path: "/" });
    }
  }
}

//单点登录，url携带token，进行比较是否和当前一致，不一致进行token重新取值
function ssoLoginUrlToken(to, from, next, token) {
  szdStoreSession.removeCoreLogin();
  szdStoreCookie.setToken(to.query.token);
  store.dispatch("GetUserInfo").then(res => {
    if (res) {
      next({ ...to, replace: true });
    } else {
      store.dispatch("LogOut").then(() => {
        $m("CORE_CLIENT.E015"); //单点登录token已过期,请重新登录
        next({ path: "/" });
      });
    }
  });
}
