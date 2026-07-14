<template>
  <template v-if="!_ctrl.hide">
    <szd-input-number
      v-model="_modelValue"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :max="_ctrl.max"
      :min="_ctrl.min"
      :precision="_ctrl.precision"
      :step="_ctrl.step"
      :readonly="_ctrl.readonly"
      :disabled="_ctrl.disabled"
      :required="_ctrl.required"
      :szdfst="_ctrl.szdfst"
      :szdopt="_ctrl.szdopt"
      @change="handleChange" />
  </template>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: Number
    },
    //控件参数
    ctrl: {
      type: Object
    }
  });
  const emit = defineEmits(["update:modelValue", "change"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      label: props.ctrl.label, //标签
      placeholder: props.ctrl.placeholder, //占位符
      max: props.ctrl.max, //最大长度
      min: props.ctrl.min, //最大长度
      precision: props.ctrl.precision, //精度
      step: props.ctrl.step, //步进
      readonly: props.ctrl.readonly, //仅显示
      disabled: props.ctrl.disabled, //不可用
      required: props.ctrl.required, //必输
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
</script>