<template>
  <var-popup
    v-model:show="dg.open"
    position="bottom"
    close-on-click-overlay
    class="szd__popup__wrapper_h"
    style="height: 80vh"
    @close="handleCloseForm">
    <!-- 页标签设置 -->
    <div class="tabBox">
      <div class="tabBoxCol">
        <div style="display: flex">
          <div class="tabBoxTab" :style="{ color: dg.actTab === 'Tab1' ? '#397bfe' : '' }" @click="handleTabClick('Tab1')">{{ $t("影像") }}</div>
          <div class="tabBoxTab" :style="{ color: dg.actTab === 'Tab2' ? '#397bfe' : '' }" @click="handleTabClick('Tab2')">{{ $t("票夹") }}</div>
          <div class="tabBoxLine" :style="{ left: dg.left }" />
        </div>
      </div>
      <div class="searchBox">
        <var-button-group type="default">
          <szd-button label="确认" type="primary" @click="okayForm" />
          <szd-button label="关闭" type="primary" @click="closeForm" />
        </var-button-group>
      </div>
    </div>

    <!-- 发票信息 -->
    <div class="szd__tb__wrapper">
      <div class="m-table">
        <wfConsumeInvImg v-show="dg.actTab === 'Tab1'" :objData="objData" :bussParam="bussParam" />
        <wfConsumeInvFol v-show="dg.actTab === 'Tab2'" :objData="objData" :bussParam="bussParam" />
      </div>
    </div>
  </var-popup>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import { wfEisConsumeFolToImg } from "../api/wfComsume";
  import wfConsumeInvImg from "./wfConsumeInvImg.vue";
  import wfConsumeInvFol from "./wfConsumeInvFol.vue";

  //更新数据对象
  const emit = defineEmits(["okay"]);

  const props = defineProps({
    bussParam: {
      type: Object,
      default: {
        bussId: "", //业务Id
        bstp: "", //业务类型
        invList: [] //已存在发票号 {invCode，invNo}
      }
    }
  });

  //功能参数
  const dg = ref({
    title: "消费记录",
    open: false,
    actTab: "Tab1",
    left: "0px"
  });

  //用户选择
  const objData = ref({
    invImg: [],
    invFol: [],
    invImgSel: [],
    invFolSel: []
  });

  onMounted(() => {
    initData();
  });

  //初始化数据
  const initData = () => {
    dg.value.open = true;
  };

  const handleTabClick = tabName => {
    dg.value.actTab = tabName;
    dg.value.left = dg.value.actTab === "Tab1" ? "0px" : "60px";
  };

  //数据确定
  const okayForm = () => {
    let invSel = [];
    let invFolSel = [];
    //合并返回的数据
    for (let i = 0; i < objData.value.invImg.length; i++) {
      const item = objData.value.invImg[i];
      if (item.$SZDCHECKBOX) {
        invSel.push(item);
      }
    }
    for (let i = 0; i < objData.value.invFol.length; i++) {
      const item = objData.value.invFol[i];
      if (item.$SZDCHECKBOX) {
        invSel.push(item);
        invFolSel.push(item);
      }
    }
    //票夹移动到影像
    if (invFolSel.length > 0) {
      let json = { bussId: props.bussParam.bussId, moveList: invFolSel };
      wfEisConsumeFolToImg(json).then(() => {});
    }
    emit("okay", invSel);
    dg.value.open = false;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //取消
  const closeForm = () => {
    dg.value.open = false;
  };
</script>

<style scoped lang="scss">
  .tabBox {
    border-bottom: 2px solid #dfe4ed;
    margin-bottom: 10px;
    display: flex;
    color: var(--field-decorator-text-color);
  }

  .tabBoxCol {
    height: 40px;
    display: flex;
    position: relative;
    width: 100px;
    margin-left: 5px;
  }

  .tabBoxTab {
    font-size: 14px;
    width: 50px;
    margin-right: 10px;
    text-align: justify;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    font-weight: 500;
  }

  .tabBoxLine {
    background: #397bfe;
    width: 50px;
    height: 2px;
    position: absolute;
    bottom: -2px;
  }

  .searchBox {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 6px;
    flex: 1;
  }

  .m-table {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
    padding: 0 5px;
    position: relative;
    flex: 1;
  }
</style>