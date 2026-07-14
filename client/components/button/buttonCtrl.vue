<template>
  <template v-if="!_ctrl.hide">
    <szd-button
      :type="_ctrl.type"
      :label="_ctrl.label"
      :size="_ctrl.size"
      :text="_ctrl.text"
      :link="_ctrl.link"
      :disabled="_ctrl.disabled"
      :noAuth="_ctrl.noAuth"
      :color="_ctrl.color"
      :szdfst="_ctrl.szdfst"
      :szdopt="_ctrl.szdopt"
      @click="handleClick(_ctrl.fCode)" />
  </template>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    //控件参数
    ctrl: {
      type: Object
    },
    size: {
      type: String
    }
  });
  const emit = defineEmits(["click"]);
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      fCode: props.ctrl.fCode, //功能码
      label: props.ctrl.label, //名称
      size: props.size ? props.size : props.ctrl.size, //大小
      type: props.ctrl.type, //按钮类型 同Element
      text: props.ctrl.text, //是否为文字按钮
      link: props.ctrl.link, //是否为链接按钮
      disabled: props.ctrl.disabled, //是否可用
      noAuth: props.ctrl.noAuth, //不检查权限
      color: props.ctrl.color, //按钮颜色
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //点击事件
  const handleClick = fCode => {
    emit("click", fCode);
  };
</script>
