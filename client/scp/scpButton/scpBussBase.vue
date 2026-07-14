<template>
  <!-- 业务主体信息 -->
  <var-popup v-model:show="dg.open" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" style="height: 80vh">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="关闭" type="primary" @click="closeForm" />
      </var-button-group>
    </div>
    <div class="szd__popup__main" style="margin-top: 5px; padding: 0">
      <szd-card-a>
        <template #main>
          <szd-input v-model="bussBaseObj.routerCode" label="业务路由" disabled />
          <szd-input v-model="bussBaseObj.pkVal" label="业务单号" disabled />
          <szd-input v-model="bussBaseObj.bussId" label="业务ID" disabled />
          <szd-input v-model="bussBaseObj.program" label="程序代码" disabled />
          <szd-input v-model="bussBaseObj.version" label="版本" disabled />
          <szd-checkbox v-model="bussBaseObj.delFlag" label="删除" disabled />
          <szd-input v-model="bussBaseObj.createBy" label="制单人" disabled :desc="bussBaseObj.createByName" />
          <szd-input v-model="bussBaseObj.createTime" label="制单时间" disabled />
          <szd-input v-model="bussBaseObj.updateBy" label="更改人" disabled :desc="bussBaseObj.updateByName" />
          <szd-input v-model="bussBaseObj.updateTime" label="更改时间" disabled />
        </template>
      </szd-card-a>
    </div>
  </var-popup>
</template>

<script setup>
  import { ref } from "vue";
  import szdRouter from "../../common/utils/goRouter";
  //功能参数
  const dg = ref({
    open: false
  });
  //表单参数
  const bussBaseObj = ref({});

  //接受并处理
  const callFmDgBussBase = bussBase => {
    bussBaseObj.value = bussBase;
    dg.value.open = true;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //日志信息
  const logInfo = () => {
    szdRouter.goNav("CORE_MON_25A", { bussId: bussBaseObj.value.bussId });
  };

  //定义父组件可用方法
  defineExpose({
    callFmDgBussBase
  });
</script>