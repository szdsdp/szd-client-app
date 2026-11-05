<template>
  <!-- 业务主体信息-通过按钮点击，标签模式  -->
  <div class="szd-wf-btn">
    <var-button-group type="default">
      <szd-button label="检查" type="primary" @click="emit('check')" :disabled="bussBase.delFlag" :szdopt="szdopt" />
      <szd-button label="保存" type="primary" @click="emit('submit')" :disabled="bussBase.delFlag" :szdopt="szdopt" />
      <var-button v-if="bussBase.pkVal" type="primary" @click="handleButMore">
        {{ dg.btnMoreShow ? $t("关闭") : $t("更多") }}
      </var-button>
    </var-button-group>

    <div v-show="dg.btnMoreShow" class="var-popup__overlay" @click="handleMouseOut" style="z-index: 3099" />

    <div v-show="dg.btnMoreShow" class="wf-btn_more_view">
      <div v-if="bussBase.pkVal && !bussBase.delFlag" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="emit('delete')" :disabled="szdopt === 'V'">
          {{ $t("删除") }}
        </var-button>
      </div>
      <div v-if="bussBase.pkVal" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="handleBussBase">
          {{ $t("业务主体") }}
        </var-button>
      </div>
    </div>

    <scpBussBase ref="refScpBussBase" />
  </div>
</template>

<script setup>
  import "../../wf/wfButton/wfButton.scss";
  import { ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import scpBussBase from "./scpBussBase.vue";

  //更新数据对象
  const emit = defineEmits(["check", "submit", "delete"]);

  //子屏幕
  const refScpBussBase = ref();

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    },
    szdopt: {
      type: String
    }
  });

  //功能参数
  const dg = ref({
    btnMoreShow: false
  });

  //点击更多
  const handleButMore = () => {
    dg.value.btnMoreShow = !dg.value.btnMoreShow;
  };

  //鼠标移出事件
  const handleMouseOut = () => {
    dg.value.btnMoreShow = false;
  };

  //显示业务主体
  const handleBussBase = () => {
    refScpBussBase.value.callFmDgBussBase(props.bussBase);
  };
</script>