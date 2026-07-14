<template>
  <!-- 卡片显示内容 -->
  <span class="card-text-row">
    <div class="title" :style="{ color: labelColor, width: labelWidth }">{{ $t(label) }}:</div>
    <div class="content" :class="{ 'div-click': clickColor }" :style="_textStyle">{{ _modelValue }}</div>
  </span>
</template>

<script setup>
  import { computed } from "vue";
  import { addThousandSeparator } from "pixiu-number-toolkit";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    modelValue: {
      default: ""
    },
    text: {},
    label: {
      type: String,
      default: ""
    },
    align: {
      type: String
    },
    numDot: {
      type: Boolean,
      default: false
    },
    numDec: {
      type: [Number, String]
    },
    clickColor: {
      type: Boolean,
      default: false
    },
    labelColor: {
      type: String
    },
    textColor: {
      type: String
    },
    labelWidth: {
      type: String
    }
  });

  //值数据
  const _modelValue = computed(() => {
    let val = props.text !== undefined ? props.text : props.modelValue;
    if (!isNaN(val)) {
      //设置添加小数位，与千分位符顺序不能错
      if (!isNaN(props.numDec) && props.numDec >= 0 && props.numDec !== null && props.numDec !== undefined) {
        val = Number(val).toFixed(props.numDec);
      }
      //千分位符
      if (props.numDot) {
        val = addThousandSeparator(val);
      }
    }
    return val;
  });

  //值数据
  const _textStyle = computed(() => {
    let _style = {};
    if (props.align === "center") {
      _style["textAlign"] = "center";
    } else if (props.align === "right") {
      _style["textAlign"] = "right";
    } else if (props.align === "left") {
      _style["textAlign"] = "left";
    }
    if (props.textColor) {
      _style["color"] = props.textColor;
    }
    return _style;
  });
</script>
<style lang="scss" scoped>
  .div-click {
    color: var(--button-primary-color);
  }
</style>