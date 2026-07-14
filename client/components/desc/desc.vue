<template>
  <!-- 通用描述标签 -->
  <div v-text="_modelValue" class="code-desc-scrollbar" />
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    modelValue: {
      default: ""
    },
    text: {}
  });
  //值数据
  const _modelValue = computed(() => {
    return props.text !== undefined ? props.text : props.modelValue;
  });
</script>

<style scoped>
  /* 滑动显示文字 */
  .code-desc-scrollbar {
    padding-left: 5px;
    display: block;
    white-space: nowrap;
    overflow: auto;
    color: #606266;
    /* text-overflow: ellipsis; */
  }

  .code-desc-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>