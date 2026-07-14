<template>
  <!-- 查询条件 -->
  <var-popup v-model:show="dg.open" position="left" close-on-click-overlay class="szd__popup__wrapper_w">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="查询" @click="handleButton('search')" />
        <szd-button label="重置" @click="handleButton('reset')" />
      </var-button-group>
    </div>

    <div class="szd__popup__main" style="padding: 0">
      <!-- 查询条件 -->
      <div class="card-item" style="padding: 15px 15px 15px 25px; gap: 10px">
        <template v-for="item in selectParams">
          <szd-select
            v-if="item.fieldHelpType === 'B'"
            :label="item.fieldName"
            v-model="item.fieldVal"
            :baseField="item.fieldHelpCode"
            :disabled="item.fieldDisplay"
            clearable />
          <!-- 日期和日期时间 -->
          <szd-date
            v-else-if="['date', 'datetime'].includes(item.fieldDataType)"
            :label="item.fieldName"
            v-model="item.fieldVal"
            :type="item.fieldDataType"
            :disabled="item.fieldDisplay"
            clearable />
          <!-- 时间 -->
          <szd-time
            v-else-if="item.fieldDataType === 'time'"
            :label="item.fieldName"
            v-model="item.fieldVal"
            :disabled="item.fieldDisplay"
            clearable />
          <!-- 基础字段帮助 -->
          <szd-radio
            v-else-if="item.fieldDataType === 'boolean'"
            :label="item.fieldName"
            v-model="item.fieldVal"
            :baseArr="[
              { svalue: 'A', sname: $t('全部') },
              { svalue: '1', sname: $t('是') },
              { svalue: '0', sname: $t('否') }
            ]"
            :disabled="item.fieldDisplay"
            clearable />
          <!-- 基础字段帮助 -->
          <szd-input
            v-else
            :label="item.fieldName"
            v-model="item.fieldVal"
            :type="item.fieldDataType"
            :disabled="item.fieldDisplay"
            clearable
            :show-help="item.fieldHelpType === 'A' && item.fieldHelpCode"
            @help="szdSh({ a: item.fieldHelpCode, b: item, c: ['fieldVal-' + item.fieldHelpMap] })" />
        </template>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
  import { ref } from "vue";
  import { szdSh } from "./serchHelp";

  const props = defineProps({
    winParams: {
      type: Object,
      default: {}
    },
    selectParams: {
      type: Array,
      default: []
    }
  });

  //回调事件
  const emit = defineEmits(["handleSchEvent"]);

  //窗口对象
  const dg = ref({
    open: false
  });
  //初始化数据
  const callInitData = () => {
    dg.value.open = true;
  };

  //按钮事件
  const handleButton = fCode => {
    emit("handleSchEvent", { fCode: fCode });
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>