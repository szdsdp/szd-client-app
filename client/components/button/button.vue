<template>
  <var-button
    v-if="!_fst.hide"
    :type="type"
    :size="size"
    :text="text || link"
    :disabled="_fst.disabled"
    :color="color"
    v-bind="$attrs"
    @click="emit('click')">
    {{ $t(label) }}
  </var-button>
</template>

<script setup>
  import { computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //按钮类型 同Element
    type: {
      type: String,
      default: "primary"
    },
    size: {
      type: String
    },
    label: {
      type: String,
      default: ""
    },
    link: {
      type: Boolean
    },
    text: {
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    noAuth: {
      type: Boolean,
      default: false
    },
    color: {
      type: String
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //事件
  const emit = defineEmits(["click"]);
  //编辑状态
  const _fst = computed(() => {
    let fst = szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
    if (props.noAuth) {
      fst.readonly = false;
      fst.disabled = false;
    }
    return fst;
  });
</script>
<style scoped lang="scss"></style>
