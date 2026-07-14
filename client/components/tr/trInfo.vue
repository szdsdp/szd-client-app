<template>
  <var-dialog title="创建请求" v-model:show="dg.open" close-on-click-overlay @close="handleClose" :confirm-button="false" :cancel-button="false">
    <template #title>
      <szd-dialog-title title="创建请求" v-model="dg.open" @close="closeForm" />
    </template>
    <szd-card-a>
      <template #main>
        <szd-input label="请求名称" v-model="objData.trName" :maxlength="64" required />
      </template>
    </szd-card-a>
    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="保存" type="primary" @click="submitForm" />
        <szd-button label="关闭" type="primary" @click="closeForm" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { ref } from "vue";
  import { addTr } from "../api/tr.js";
  import { $mE, $mS } from "../../common/utils/globalConfig";

  //定义事件
  const emit = defineEmits(["updResult"]);

  //功能参数
  const dg = ref({
    open: false
  });

  const objData = ref({
    trCode: "",
    trName: "",
    trUserList: []
  });

  const initNewTr = () => {
    objData.value.trCode = "";
    objData.value.trName = "";
    objData.value.trUserList = [];
    dg.value.open = true;
  };

  //保存
  const submitForm = () => {
    if (submitFormCheck()) {
      addTr(objData.value).then(response => {
        if (response.code === 200) {
          $mS("新增数据成功");
          closeForm();
          emit("updResult");
        }
      });
    }
  };
  const submitFormCheck = () => {
    if (!objData.value.trName) {
      $mE("请求名称不能为空");
      return false;
    }
    return true;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {};

  //定义父组件可用方法
  defineExpose({
    initNewTr
  });
</script>