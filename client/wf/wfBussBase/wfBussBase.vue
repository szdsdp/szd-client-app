<template>
  <!-- 业务主体信息 -->
  <var-popup v-model:show="dg.open" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" style="height: 80vh">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <!--        <szd-button label="修改日志" type="primary" @click="logInfo" v-if="bussBaseObj.bussId" />-->
        <szd-button label="关闭" type="primary" @click="closeForm" />
      </var-button-group>
    </div>

    <div class="szd__popup__main" style="margin-top: 5px; padding: 0">
      <szd-card-a>
        <template #main>
          <szd-input v-model="bussBaseObj.bussDocId" label="业务单号" disabled />
          <szd-input v-model="bussBaseObj.bussId" label="业务ID" disabled />
          <szd-input v-model="bussBaseObj.cmpy" label="公司代码" disabled :desc="bussBaseObj.cmpyName" />
          <szd-input v-model="bussBaseObj.cstc" label="成本中心" disabled :desc="bussBaseObj.cstcName" />
          <szd-input v-model="bussBaseObj.bstp" label="业务类型" disabled :desc="bussBaseObj.bstpName" />
          <szd-input v-model="bussBaseObj.wfDyId" label="动态流程" disabled :desc="bussBaseObj.wfDyName" />
          <szd-input v-model="bussBaseObj.title" label="业务标题" disabled />
          <szd-input v-model="bussBaseObj.routerCode" label="业务路由" disabled />
          <szd-select v-model="bussBaseObj.status" label="单据状态" baseField="CORE_WF_DOST" disabled />
          <szd-select v-model="bussBaseObj.rejectStatus" label="驳回" baseField="CORE_SYS_YENO" disabled />

          <szd-input v-model="bussBaseObj.amtApply" label="申请金额" disabled type="number" :numDec="2" numDot />
          <szd-input v-model="bussBaseObj.amtActual" label="实际金额" disabled type="number" :numDec="2" numDot />

          <szd-input v-model="bussBaseObj.createBy" label="制单人" disabled :desc="bussBaseObj.createByName" />
          <szd-input v-model="bussBaseObj.createTime" label="制单时间" disabled />
          <szd-input v-model="bussBaseObj.commitBy" label="提交人" disabled :desc="bussBaseObj.commitByName" />
          <szd-input v-model="bussBaseObj.commitTime" label="提交时间" disabled />
          <szd-input v-model="bussBaseObj.updateBy" label="更改人" disabled :desc="bussBaseObj.updateByName" />
          <szd-input v-model="bussBaseObj.updateTime" label="更改时间" disabled />

          <szd-input v-model="bussBaseObj.program" label="程序代码" disabled :desc="bussBaseObj.programName" />
          <szd-input v-model="bussBaseObj.programVersion" label="程序版本" disabled />

          <szd-textarea v-model="bussBaseObj.remark" label="备注" disabled :rows="2" :maxlength="0" />
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
  const callWfDgBussBase = bussBase => {
    dg.value.open = true;
    bussBaseObj.value = bussBase;
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
    callWfDgBussBase
  });
</script>