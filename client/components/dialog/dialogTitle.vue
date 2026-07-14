<template>
  <div class="d-title">
    <div class="title">{{ $t(title) }}</div>
    <div v-if="close" class="close" @click="handleClose">
      <var-icon name="window-close" />
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    modelValue: {
      type: Boolean
    },
    title: {
      type: String,
      default: "提示"
    },
    close: {
      type: Boolean,
      default: true
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "close"]);
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });

  //关闭窗口
  const handleClose = () => {
    _modelValue.value = false;
    emit("close");
  };
</script>

<style scoped lang="scss">
  .d-title {
    display: flex;
    width: 100%;

    .title {
      flex: 1;
      word-wrap: break-word;
      word-break: break-all;
    }

    .close {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 30px;
    }
  }
</style>