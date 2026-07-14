<template>
  <!-- 文本 -->
  <div class="main-form-item main-form-item-border">
    <div v-if="_label" class="main-form-item-label">
      <div class="label label-disabled">{{ _label }}</div>
    </div>
    <div class="div-text" :class="{ 'div-click': clickColor }" :style="_align">{{ _modelValue }}</div>
  </div>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    modelValue: {
      default: ""
    },
    text: {},
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    align: {
      type: String
    },
    clickColor: {
      type: Boolean,
      default: false
    }
  });
  //值数据
  const _modelValue = computed(() => {
    return props.text !== undefined && props.text !== null ? props.text : props.modelValue;
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //值数据
  const _align = computed(() => {
    if (props.align === "center") return { justifyContent: "center" };
    if (props.align === "right") return { justifyContent: "flex-end" };
    return "";
  });
</script>
<style lang="scss" scoped>
  .div-text {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: var(--font-size);
    color: var(--field-decorator-text-color);
    min-height: 24px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .div-click {
    color: var(--button-primary-color);
  }
</style>