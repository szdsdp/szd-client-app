<template>
  <var-form ref="refPhoneLoginForm" scroll-to-error="start">
    <div class="login-field">
      <div class="login-field__label">{{ tranLanguage("手机号") }}</div>
      <var-input
        :placeholder="tranLanguage('请输入手机号')"
        :rules="[v => !!v || tranLanguage('手机号不能为空')]"
        v-model="loginForm.phone"
        :hint="false"
        autocomplete="tel"
        class="login-field__input" />
    </div>
    <div class="login-field">
      <div class="login-field__label">{{ tranLanguage("验证码") }}</div>
      <var-row>
        <var-col :span="14">
          <var-input
            :placeholder="tranLanguage('请输入验证码')"
            :rules="[v => !!v || tranLanguage('验证码不能为空')]"
            v-model="loginForm.code"
            :hint="false"
            class="login-field__input" />
        </var-col>
        <var-col :span="10" style="padding: 0 0 0 8px">
          <var-button block :type="dg.btnType" :disabled="dg.btnDisabled" @click="getCode">
            {{ tranLanguage(dg.codeText) }}
          </var-button>
        </var-col>
      </var-row>
    </div>

    <var-button type="primary" block size="large" class="login-form__submit" @click="handleLogin">
      <span v-if="!dg.loading">{{ tranLanguage("登 录") }}</span>
      <span v-else>{{ tranLanguage("登 录 中") }}...</span>
    </var-button>
  </var-form>
</template>

<script setup>
  import { onBeforeMount, ref } from "vue";
  import { Snackbar } from "@varlet/ui";
  import Cookies from "js-cookie";
  import { getSmsCode, loginSms } from "../../client/common/api/login";

  const emit = defineEmits(["loginResult"]);

  const refPhoneLoginForm = ref();

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
    loading: false, //加载中
    codeText: "获取验证码",
    btnType: "primary",
    btnDisabled: false
  });
  //表单对象
  const loginForm = ref({
    uuid: "",
    phone: "",
    code: "",
    region: "+86",
    appOpenUuid: ""
  });
  //初始参数
  onBeforeMount(() => {
    getCookie();
  });
  //获取Cookie信息
  const getCookie = () => {
    const phone = Cookies.get("phone");
    if (phone) loginForm.value.phone = phone;
  };
  //验证码
  const getCode = () => {
    if (!loginForm.value.phone) {
      Snackbar.error(tranLanguage("手机号不能为空"));
      return;
    }
    if (!/^1[3456789]\d{9}$/.test(loginForm.value.phone)) {
      Snackbar.error(tranLanguage("手机号格式错误"));
      return;
    }
    dg.value.btnDisabled = true;
    getSmsCode(loginForm.value.phone)
      .then(res => {
        if (res.code === 200) {
          loginForm.value.uuid = res.uuid;
          let time = 60;
          dg.value.codeText = `${time}s`;
          dg.value.btnType = "info";
          let timer = setInterval(() => {
            time -= 1;
            dg.value.codeText = `${time}s`;
            if (time === 0) {
              dg.value.btnType = "primary";
              dg.value.codeText = "重新获取";
              clearInterval(timer);
              timer = null;
              dg.value.btnDisabled = false;
            }
          }, 1000);
        } else {
          dg.value.btnDisabled = false;
        }
      })
      .catch(() => {
        dg.value.btnDisabled = false;
      });
  };
  //手机登录
  const handleLogin = () => {
    refPhoneLoginForm.value.validate().then(valid => {
      if (valid) {
        if (!/^1[3456789]\d{9}$/.test(loginForm.value.phone)) {
          Snackbar.error(tranLanguage("手机号格式错误"));
          return;
        }
        setCookie();
        dg.value.loading = true;
        loginForm.value.appOpenUuid = props.bindThird.appOpenUuid;
        loginSms(loginForm.value)
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
  //记录手机号
  const setCookie = () => {
    Cookies.set("phone", loginForm.value.phone, { expires: 30 });
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
