<template>
  <var-form ref="refUserLoginForm" scroll-to-error="start">
    <div class="login-field">
      <div class="login-field__label">{{ tranLanguage("用户名") }}</div>
      <var-input
        :placeholder="tranLanguage('请输入您的用户名')"
        :rules="[v => !!v || tranLanguage('用户名不能为空')]"
        v-model="loginForm.userId"
        :hint="false"
        autocomplete="username"
        class="login-field__input"
        @change="handleChangeUserId()" />
    </div>
    <div class="login-field">
      <div class="login-field__label">{{ tranLanguage("密码") }}</div>
      <var-input
        type="password"
        :placeholder="tranLanguage('请输入您的密码')"
        :rules="[v => !!v || tranLanguage('密码不能为空')]"
        v-model="loginForm.password"
        :hint="false"
        autocomplete="off"
        class="login-field__input" />
    </div>

    <var-button type="primary" block size="large" class="login-form__submit" @click="handleLogin">
      <span v-if="!dg.loading">{{ tranLanguage("登 录") }}</span>
      <span v-else>{{ tranLanguage("登 录 中") }}...</span>
    </var-button>
  </var-form>
</template>

<script setup>
  import { computed, onBeforeMount, ref } from "vue";
  import Cookies from "js-cookie";
  import { login } from "../../client/common/api/login";

  const emit = defineEmits(["loginResult"]);

  const refUserLoginForm = ref();

  const props = defineProps({
    config: {
      type: Object
    },
    mDg: {
      type: Object
    },
    bindThird: {
      type: Object
    }
  });
  //窗口参数
  const dg = ref({
    loading: false //加载中
  });
  //表单对象
  const loginForm = ref({
    userId: "",
    password: "",
    appOpenUuid: ""
  });
  //初始参数
  onBeforeMount(() => {
    getCookie();
  });
  //获取Cookie信息
  const getCookie = () => {
    const userId = Cookies.get("userId");
    if (userId) loginForm.value.userId = userId;
    loginForm.value.password = "";
    props.mDg.userId = loginForm.value.userId;
  };
  //登录系统
  const handleLogin = () => {
    refUserLoginForm.value.validate().then(valid => {
      if (valid) {
        setCookie();
        dg.value.loading = true;
        loginForm.value.appOpenUuid = props.bindThird.appOpenUuid;
        login(loginForm.value)
          .then(res => {
            if (res.code === 200) {
              emit("loginResult", res);
            }
          })
          .finally(() => {
            dg.value.loading = false;
          });
      }
    });
  };
  //设置cookie
  const setCookie = () => {
    Cookies.set("userId", loginForm.value.userId, { expires: 30 });
  };
  //更新用户
  const handleChangeUserId = () => {
    props.mDg.userId = loginForm.value.userId;
  };
  //语言翻译
  const tranLanguage = t => {
    if (props.config.langTxt && props.config.langTxt[props.mDg.language] && props.config.langTxt[props.mDg.language][t]) {
      return props.config.langTxt[props.mDg.language][t];
    } else {
      return t;
    }
  };
</script>

<style lang="scss" scoped>
  .login-field {
    margin-bottom: 22px;
  }

  .login-field__label {
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .login-field__input {
    width: 100%;
  }

  .login-form__submit {
    border-radius: 10px;
  }
</style>
