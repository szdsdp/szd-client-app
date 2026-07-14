<template>
  <var-popup
    v-model:show="dg.open"
    position="bottom"
    close-on-click-overlay
    class="szd__popup__wrapper_h"
    :teleport="false"
    style="height: 80vh"
    @close="closeForm">
    <!-- 页标签信息 -->
    <var-tabs v-model:active="dg.actTab" @click="handleClick">
      <var-tab name="TAB1">{{ $t("审批信息") }}</var-tab>
      <var-tab name="TAB2">{{ $t("评审记录") }}</var-tab>
      <var-tab name="TAB3">{{ $t("流程图") }}</var-tab>
    </var-tabs>

    <wfApprInfoTab1 v-if="dg.actTab === 'TAB1'" :objData="objData" />
    <wfApprInfoTab2 v-if="dg.actTab === 'TAB2'" :objData="objData" />
    <wfChart v-if="dg.actTab === 'TAB3'" ref="refWfChart" />
  </var-popup>
</template>

<script setup>
  import { nextTick, onMounted, ref } from "vue";
  import { $mE, $t } from "../../common/utils/globalConfig";
  import store from "~store";
  import wfApprInfoTab1 from "./sub/wfApprInfoTab1.vue";
  import wfApprInfoTab2 from "./sub/wfApprInfoTab2.vue";
  import wfChart from "./wfChart/wfChart.vue";
  import { wfApprInfo } from "../api/wfApi.js";

  //定义事件
  const emit = defineEmits(["closeForm"]);

  const props = defineProps({
    bussId: {
      type: String,
      default: ""
    }
  });
  //子屏幕ref
  const refWfChart = ref(); //流程图
  //窗口对象
  const dg = ref({
    open: false,
    bussId: "",
    actTab: "TAB1",
    userType: store.state.loginUser.user.userType
  });
  //数据对象
  const objData = ref({
    commentList: [],
    instList: [],
    meetingList: []
  });

  onMounted(() => {
    dg.value.bussId = props.bussId;
    if (dg.value.bussId) {
      getData();
    } else {
      $mE("业务bussId不能为空");
      emit("closeForm");
    }
  });

  //审批信息
  const getData = () => {
    objData.value = { commentList: [], meetingList: [], instList: [] };
    wfApprInfo(dg.value.bussId).then(response => {
      objData.value = response.data;
      dg.value.open = true;
    });
  };

  //标签选择
  const handleClick = tabName => {
    if (tabName === "TAB3") {
      nextTick(() => {
        refWfChart.value.initWfChartView(objData.value.instList);
      });
    }
  };

  const closeForm = () => {
    emit("closeForm");
  };
</script>