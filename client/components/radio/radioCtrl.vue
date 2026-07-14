<template>
  <template v-if="!_ctrl.hide">
    <szd-radio
      v-model="_modelValue"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :baseField="_ctrl.baseField"
      :baseArr="_ctrl.baseArr"
      :disabled="_ctrl.disabled"
      :direction="_ctrl.direction"
      :first="_ctrl.first"
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
      type: [String, Number, Boolean]
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
      placeholder: props.ctrl.placeholder,
      baseField: props.ctrl.baseField, //基础字段
      baseArr: props.ctrl.baseArr, //数组
      disabled: props.ctrl.disabled, //不可用
      direction: props.ctrl.direction, //垂直布局
      first: props.ctrl.first, //默认首个
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      required: props.ctrl.required, //必输
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