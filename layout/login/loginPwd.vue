<template>
  <var-dialog
    :title="tranLanguage('修改密码')"
    v-model:show="dg.open"
    :close-on-click-overlay="false"
    @close="closeForm"
    :confirm-button="false"
    :cancel-button="false">
    <template #title>
      <szd-dialog-title :title="tranLanguage('修改密码')" v-model="dg.open" @close="closeForm" />
    </template>

    <div class="szd__popup__main" style="padding: 5px 0; max-height: 75vh">
      <szd-card-a>
        <template #main>
          <var-input :placeholder="tranLanguage('登录账号')" v-model="objData.userId" autocomplete="off" />
          <var-input :placeholder="tranLanguage('旧密码')" v-model="objData.oldPassword" type="password" autocomplete="off" :maxlength="32" />
          <var-input
            :placeholder="tranLanguage('新密码')"
            v-model="objData.newPassword"
            type="password"
            autocomplete="new-password"
            :maxlength="32" />
          <var-input
            :placeholder="tranLanguage('确认密码')"
            v-model="objData.confirmPassword"
            type="password"
            autocomplete="new-password"
            :maxlength="32" />
          <div style="color: #f5a623">
            <label>{{ tranLanguage("温馨提示") }} : {{ tranLanguage(dg.tips) }}</label>
          </div>
        </template>
      </szd-card-a>
    </div>
    <!-- 功能按钮 -->
    <template #actions>
      <div class="main-dialog-footer">
        <var-button type="primary" @click="submitForm">{{ tranLanguage("确认") }}</var-button>
        <var-button type="primary" @click="closeForm">{{ tranLanguage("取消") }}</var-button>
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { ref } from "vue";
  import { Snackbar } from "@varlet/ui";
  import { changePwd } from "../../client/common/api/login";

  const props = defineProps({
    config: {
      type: Object
    },
    mDg: {
      type: Object
    }
  });

  //窗口参数
  const dg = ref({
    open: false,
    tips: ""
  });
  const objData = ref({
    userId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  //打开窗口
  const callLoginPwd = userId => {
    initData();
    dg.value.open = true;
    objData.value.userId = userId;
  };
  //保存数据
  const submitForm = () => {
    if (submitFormCheck()) {
      changePwd(objData.value).then(response => {
        if (response.code === 200) {
          Snackbar.success(tranLanguage("密码更改成功"));
          closeForm();
        }
      });
    }
  };
  //检查提交数据
  const submitFormCheck = () => {
    if (!objData.value.userId) {
      Snackbar.error(tranLanguage("登录账号不能为空"));
      return false;
    }
    if (!objData.value.oldPassword) {
      Snackbar.error(tranLanguage("旧密码不能为空"));
      return false;
    }
    if (!objData.value.newPassword) {
      Snackbar.error(tranLanguage("新密码不能为空"));
      return false;
    }
    if (!objData.value.confirmPassword) {
      Snackbar.error(tranLanguage("确认密码不能为空"));
      return false;
    }
    if (objData.value.oldPassword === objData.value.newPassword) {
      Snackbar.error(tranLanguage("新密码和旧密码不能相同"));
      return false;
    }
    if (objData.value.newPassword !== objData.value.confirmPassword) {
      Snackbar.error(tranLanguage("确认密码和新密码不一致"));
      return false;
    }
    return true;
  };
  //关闭窗口
  const closeForm = () => {
    dg.value.open = false;
    location.reload();
  };
  //初始化数据
  const initData = () => {
    objData.value.oldPassword = "";
    objData.value.newPassword = "";
    objData.value.confirmPassword = "";
    dg.value.tips = props.config.pwdTip;
  };
  //语言翻译
  const tranLanguage = t => {
    if (props.config.langTxt && props.config.langTxt[props.mDg.language] && props.config.langTxt[props.mDg.language][t]) {
      return props.config.langTxt[props.mDg.language][t];
    } else {
      return t;
    }
  };

  defineExpose({ callLoginPwd });
</script>
