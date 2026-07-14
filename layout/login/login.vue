<template>
  <div v-if="dg.configFlag" class="login-page">
    <!--  登录抬头 -->
    <login-header :title="tranLanguage('用户登录')" :config="config" />
    <!-- 登录区域 -->
    <div class="login-page__body">
      <login-brand :slogan="tranLanguage('在线管理 方便快捷')" />
      <!-- 语言选择 -->
      <div v-if="dg.configFlag" class="login-lang">
        <div class="login-lang__label">{{ tranLanguage("语言选择") }}</div>
        <var-select
          :placeholder="tranLanguage('语言选择')"
          :hint="false"
          v-model="dg.language"
          class="login-lang__select"
          @change="handleChangeLanguage">
          <var-option :value="key" :label="val" v-for="(val, key) in langs" :key="key" />
        </var-select>
      </div>
      <!-- 账号登录 -->
      <login-user v-if="dg.loginType === 'A'" :config="config" :mDg="dg" :bindThird="bindThird" @loginResult="loginResult" />
      <!-- 短信登录 -->
      <login-phone v-if="dg.loginType === 'B'" :config="config" :mDg="dg" :bindThird="bindThird" @loginResult="loginResult" />
      <!-- 切换登录方式 -->
      <div class="login-type" v-if="config.loginTypesApp.length > 1">
        <span :style="{ color: dg.loginType === 'A' ? '#397bfe' : '' }" @click="handleClickLoginType('A')">
          {{ tranLanguage("账号密码登录") }}
        </span>
        <var-divider vertical />
        <span :style="{ color: dg.loginType === 'B' ? '#397bfe' : '' }" @click="handleClickLoginType('B')">
          {{ tranLanguage("短信验证码登录") }}
        </span>
      </div>
      <!-- 修改密码 -->
      <loginPwd ref="refLoginPwd" :config="config" :mDg="dg" />
      <!-- 登录用户清单 -->
      <loginUserLogged ref="refLoginUserLogged" :config="config" :mDg="dg" @loginReload="loginReload" />
    </div>
  </div>
</template>

<script setup>
  import { onBeforeMount, ref } from "vue";
  import store from "~store";
  import { useRoute } from "vue-router";
  import { Snackbar } from "@varlet/ui";
  import szdRouter from "../../client/common/utils/goRouter";
  import szdStoreCookie from "../../client/common/store/storeCookie";
  import szdStoreLocal from "../../client/common/store/storeLocal";
  import szdStoreSession from "../../client/common/store/storeSession";
  import { getLoginConfig, getSvg } from "../../client/common/api/login";
  import loginHeader from "./loginHeader.vue";
  import loginBrand from "./loginBrand.vue";
  import loginUser from "./loginUser.vue";
  import loginPhone from "./loginPhone.vue";
  import loginUserLogged from "./loginUserLogged.vue";
  import loginPwd from "./loginPwd.vue";
  //子屏幕
  const refLoginPwd = ref();
  const refLoginUserLogged = ref();
  //当前路由
  const route = useRoute();
  //窗口参数
  const dg = ref({
    loginType: "A", //登录类型
    language: "",
    isMobile: true, //设备类型
    configFlag: false, //获取配置
    device: "",
    userId: "",
    token: ""
  });
  //多语言选择
  const langs = ref({});
  //文件地址
  const ftpUrl = ref("");
  //配置参数
  const config = ref({
    logoApp: { status: "1", fileName: "", imgUrl: "", bgColor: "", radius: "" }, //LOGO图片显示
    version: "河北尚智得信息技术有限公司版权所有", //版权信息
    loginTypesApp: ["A"], //登录方式
    langTxt: {}, //多语言文本
    pwdTip: "" //密码复杂度
  });
  //三方登录
  const bindThird = ref({
    appOpenUuid: "", //三方系统绑定uuid
    routerCode: "",
    params: {},
    callType: ""
  });
  //初始化参数
  onBeforeMount(() => {
    getUrlQuery();
    getCookie();
    getDevice();
    getConfig();
  });
  //获取url参数
  const getUrlQuery = () => {
    bindThird.value.appOpenUuid = route.query.appOpenUuid || "";
    bindThird.value.routerCode = route.query.routerCode || "";
    bindThird.value.params = {};
    if (bindThird.value.routerCode && route.query.params) {
      try {
        const parsed = JSON.parse(decodeURIComponent(atob(route.query.params)));
        bindThird.value.params = typeof parsed === "object" && parsed !== null ? parsed : {};
      } catch (e) {}
    }
    bindThird.value.callType = route.query.callType || "";
  };
  //Cookie信息
  const getCookie = () => {
    dg.value.language = szdStoreCookie.getLanguage();
    if (!dg.value.language) dg.value.language = "zh-CN";
  };
  //设备类型
  const getDevice = () => {
    dg.value.device = navigator.userAgent;
  };
  //登录配置
  const getConfig = () => {
    getLoginConfig().then(res => {
      if (res.data.langs) langs.value = res.data.langs;
      if (res.data.langTxt) config.value.langTxt = res.data.langTxt;
      if (res.data.ftpUrl) ftpUrl.value = res.data.ftpUrl;
      if (res.data.config) {
        config.value = res.data.config;
        setImgUrl(config.value.logoApp);
      }
      if (!config.value.version) {
        config.value.version = "河北尚智得信息技术有限公司版权所有";
      }
      //下载svg图标库
      downloadSvg(res.data.svgMd5);
      dg.value.configFlag = true;
    });
  };
  //设置图片地址
  const setImgUrl = param => {
    if (!param) return;
    if (param.status === "2") {
      if (ftpUrl.value && param.fileName) {
        param["imgUrl"] = ftpUrl.value + param.fileName;
      } else {
        param.status = "3";
      }
    }
    if (!param.radius || param.radius < 0 || param.radius >= 50) {
      param.radius = "50%";
    } else {
      param.radius = param.radius.toString() + "%";
    }
  };
  //设置Cookie登录语言
  const handleChangeLanguage = () => {
    szdStoreCookie.setLanguage(dg.value.language);
  };
  //更改登录方式
  const handleClickLoginType = type => {
    dg.value.loginType = type;
  };
  //语言翻译
  const tranLanguage = t => {
    if (config.value.langTxt && config.value.langTxt[dg.value.language] && config.value.langTxt[dg.value.language][t]) {
      return config.value.langTxt[dg.value.language][t];
    } else {
      return t;
    }
  };
  //下载svg图标库
  const downloadSvg = svgMd5 => {
    if (szdStoreLocal.getSvgMd5(svgMd5) || !szdStoreLocal.getSvg()) {
      getSvg().then(res => {
        szdStoreLocal.setSvg(res);
        szdStoreLocal.setSvgMd5(svgMd5);
      });
    }
  };
  //登录结果
  const loginResult = res => {
    if (res.type === "PWD_INIT") {
      Snackbar.error(tranLanguage("请先修改密码再登录"));
      refLoginPwd.value.callLoginPwd(dg.value.userId);
    } else if (!res.token) {
      Snackbar.error(tranLanguage("登录失败"));
    } else {
      if (res.type === "PWD_EXPIRE_W") {
        Snackbar.warning(tranLanguage("密码还剩&天到期，请及时修改密码").replace("&", res.days));
      }
      szdStoreSession.removeCoreLogin();
      szdStoreCookie.setToken(res.token); //给token赋值
      dg.value.token = res.token;
      // 已登录用户清单
      if (res.loggedList && res.loggedList.length > 0) {
        refLoginUserLogged.value.callLoginUserLogged(res.loggedList);
      } else {
        loginReload();
      }
    }
  };
  //加载应用
  const loginReload = () => {
    //微信小程序
    if (bindThird.value.callType === "scanSocket") {
      wx.miniProgram.postMessage({ data: { type: "loginSuccess", token: dg.value.token } });
      wx.miniProgram.redirectTo({
        url: "/pages/login/def"
      });
      return;
    }
    //跳转应用
    if (bindThird.value.routerCode) {
      store.dispatch("GetUserInfo").then(res => {
        if (res) {
          szdRouter.goNav(bindThird.value.routerCode, bindThird.value.params);
        } else {
          location.reload(); //重新加载当前页面
        }
      });
    } else {
      location.reload(); //重新加载当前页面
    }
  };
</script>

<style lang="scss" scoped>
  .login-page {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .login-page__body {
    flex: 1;
    position: relative;
    z-index: 1;
    margin-top: 44px;
    padding: 0 20px 32px;
    padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
  }

  .login-lang {
    margin-bottom: 20px;
  }

  .login-lang__label {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .login-lang__select {
    width: 100%;
  }

  .login-type {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    margin-top: 20px;

    span {
      font-size: 14px;
      color: #888;
      padding: 0 8px;
    }
  }
</style>
