<template>
  <var-dialog
    :title="tranLanguage('已登录用户')"
    v-model:show="dg.open"
    :close-on-click-overlay="false"
    @close="handleCloseForm"
    :confirm-button="false"
    :cancel-button="false"
    style="max-height: 80vh">
    <template #title>
      <szd-dialog-title :title="tranLanguage('已登录用户')" v-model="dg.open" @close="closeForm" />
    </template>

    <div class="main-remark" style="margin-bottom: 5px">
      <span>{{ tranLanguage("如需退出已登录，请在清单中选择") }}</span>
    </div>

    <div class="c-checkbox-all">
      <var-checkbox v-model="checkBox.checkAll" :indeterminate="checkBox.isIndeterminate" @change="handleChangeCheckAll">
        {{ tranLanguage("全选") }}
      </var-checkbox>
    </div>

    <!-- 已登录用户清单 -->
    <div class="szd__popup__main" style="padding: 5px 0">
      <szd-card-a v-for="row in loggedList">
        <!--  表头 -->
        <template #header>
          <div style="flex: 1">IP: {{ row.userIp }}</div>
          <div style="width: 35px">
            <var-checkbox v-model="row.$SZDCHECKBOX" @change="handleChangeCheckRow" />
          </div>
        </template>
        <!--  内容 -->
        <template #main>
          <span class="card-text-row">
            <div class="title">{{ tranLanguage("登录时间") }}:</div>
            <div class="content">{{ row.userLoginTime }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ tranLanguage("终端设备") }}:</div>
            <div class="content">{{ row.userDevice }}</div>
          </span>
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <var-button type="primary" @click="submitForm">{{ tranLanguage("登录") }}</var-button>
        <var-button type="primary" @click="closeForm">{{ tranLanguage("取消") }}</var-button>
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { nextTick, ref } from "vue";
  import store from "~store";
  import { removeLogged } from "../../client/common/api/login";

  const emit = defineEmits(["loginReload"]);

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
    loginFlag: false
  });
  const loggedList = ref([]);
  const listSel = ref([]);
  //全选参数
  const checkBox = ref({ checkAll: false, isIndeterminate: false });
  //打开窗口
  const callLoginUserLogged = infoParam => {
    loggedList.value = infoParam;
    dg.value.loginFlag = false;
    dg.value.open = true;
  };
  //全选更改
  const handleChangeCheckAll = () => {
    nextTick(() => {
      for (let i = 0; i < loggedList.value.length; i++) {
        loggedList.value[i].$SZDCHECKBOX = checkBox.value.checkAll;
      }
      checkBox.value.isIndeterminate = false;
    });
  };
  //选择更改
  const handleChangeCheckRow = v => {
    nextTick(() => {
      let count = 0;
      for (let i = 0; i < loggedList.value.length; i++) {
        if (loggedList.value[i].$SZDCHECKBOX) count++;
      }
      checkBox.value.isIndeterminate = count > 0 && count < loggedList.value.length;
    });
  };
  //确认登录
  const submitForm = () => {
    dg.value.loginFlag = true;
    listSel.value = [];
    for (let i = 0; i < loggedList.value.length; i++) {
      if (loggedList.value[i].$SZDCHECKBOX) listSel.value.push(loggedList.value[i]);
    }
    //移除已登录用户
    if (listSel.value.length > 0) {
      removeLogged(listSel.value).then(() => {
        emit("loginReload");
      });
    } else {
      emit("loginReload");
    }
    dg.value.open = false;
  };
  //关闭窗口
  const handleCloseForm = () => {
    if (!dg.value.loginFlag) {
      store.dispatch("LogOut").then(() => {
        location.reload();
      });
    }
  };
  //关闭窗口
  const closeForm = () => {
    dg.value.open = false;
  };
  //语言翻译
  const tranLanguage = t => {
    if (props.config.langTxt && props.config.langTxt[props.mDg.language] && props.config.langTxt[props.mDg.language][t]) {
      return props.config.langTxt[props.mDg.language][t];
    } else {
      return t;
    }
  };

  defineExpose({ callLoginUserLogged });
</script>
