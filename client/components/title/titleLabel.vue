<template>
  <!-- title Label 标签 -->
  <span class="l-title-label">
    <span class="title-label-line" />
    <span v-text="$t(_modelValue)" :class="{ 'title-label-required': required }" />
  </span>
</template>

<script setup>
  import { computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    modelValue: {
      default: ""
    },
    text: {},
    required: {
      type: Boolean,
      default: false
    }
  });
  //值数据
  const _modelValue = computed(() => {
    return props.text !== undefined && props.text !== null ? props.text : props.modelValue;
  });
</script>

<style lang="scss" scoped>
  .l-title-label {
    display: inline-flex;
    align-items: center;
    font-size: var(--font-size);
    font-weight: 600;
    color: var(--field-decorator-placeholder-color);
    padding: 5px 0;

    .title-label-line {
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background-color: #2772ff;
      margin-right: 5px;
    }

    .title-label-required {
      position: relative;
      padding-right: 12px;
    }

    .title-label-required::after {
      content: "*";
      position: absolute;
      padding-left: 3px;
      font-size: 1.5em;
      line-height: 1.5em;
      color: #ff4949;
    }
  }
</style>