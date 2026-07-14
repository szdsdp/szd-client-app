<template>
  <!-- 小数位和千分位符号 -->
  <div class="main-form-item main-form-item-border">
    <div v-if="_label" class="main-form-item-label">
      <div class="label label-disabled">{{ _label }}</div>
    </div>
    <div class="div-dot" :class="{ 'div-click': clickColor }">{{ _modelValue }}</div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { addThousandSeparator } from "pixiu-number-toolkit";

  const props = defineProps({
    modelValue: {
      default: 0
    },
    text: {},
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    numDot: {
      type: Boolean,
      default: false
    },
    numDec: {
      type: [Number, String]
    },
    noZero: {
      type: Boolean,
      default: false
    },
    clickColor: {
      type: Boolean,
      default: false
    }
  });
  //值数据
  const _modelValue = computed(() => {
    let val = props.text !== undefined ? props.text : props.modelValue;
    if (!val) {
      val = 0;
    } else if (isNaN(val)) {
      return val;
    }
    //如果数值初始化，返回空
    if (props.noZero && Number(val) === 0) {
      return "";
    }
    //设置添加小数位，与千分位符顺序不能错
    if (!isNaN(props.numDec) && props.numDec >= 0 && props.numDec !== null && props.numDec !== undefined) {
      val = Number(val).toFixed(props.numDec);
    }
    //千分位符
    if (props.numDot) {
      val = addThousandSeparator(val);
    }
    return val;
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
</script>
<style lang="scss" scoped>
  .div-dot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    color: var(--field-decorator-text-color);
    min-height: 24px;
  }

  .div-click {
    color: var(--button-primary-color);
  }
</style>