<template>
  <var-popup v-model:show="dg.open" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" @close="handleClose" style="height: 60vh">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="新增请求" type="primary" @click="addTr" />
        <szd-button label="取消" type="primary" @click="handleCloseForm" />
      </var-button-group>
    </div>
    <div class="szd__popup__main">
      <szd-card-a style="padding: 5px 15px">
        <template #main>
          <szd-textarea label="摘要备注" v-model="dg.operRemark" show-word-limit :maxlength="100" :rows="2" />
        </template>
      </szd-card-a>
      <szd-card-a v-for="row in trList" @click="handCellDblclick(row)">
        <template #main>
          <szd-card-row-span label="请求编号" :text="row.trCode" clickColor />
          <szd-card-row-span label="请求名称" :text="row.trName" clickColor />
        </template>
      </szd-card-a>
    </div>

    <trInfo ref="refTrInfo" @updResult="getTrList" />
  </var-popup>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { listTrNoRelease } from "../api/tr.js";
  import trInfo from "./trInfo.vue";

  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);
  // 子屏幕
  const refTrInfo = ref();
  //功能参数
  const dg = ref({
    open: false,
    operRemark: ""
  });
  const trList = ref([]);

  onMounted(() => {
    getTrList();
  });
  //获取后台数据
  const getTrList = () => {
    listTrNoRelease().then(response => {
      if (response.code === 200) {
        trList.value = response.data;
        dg.value.open = true;
      }
    });
  };
  // 双击取值
  const handCellDblclick = row => {
    emit("okay", { trCode: row.trCode, operRemark: dg.value.operRemark, noAct: false });
    dg.value.open = false;
  };

  //新增
  const addTr = () => {
    refTrInfo.value.initNewTr();
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emit("closeForm");
  };
</script>