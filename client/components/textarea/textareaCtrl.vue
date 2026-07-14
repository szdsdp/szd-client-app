<template>
  <template v-if="!_ctrl.hide">
    <szd-textarea
      v-model="_modelValue"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :hint="_ctrl.hint"
      :maxlength="_ctrl.maxlength"
      :rows="_ctrl.rows"
      :readonly="_ctrl.readonly"
      :disabled="_ctrl.disabled"
      :clearable="_ctrl.clearable"
      :szdfst="_ctrl.szdfst"
      :szdopt="_ctrl.szdopt"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick" />
  </template>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: String
    },
    //控件参数
    ctrl: {
      type: Object
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "click"]);
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
      hint: props.ctrl.hint, //是否使用占位符作为提示
      maxlength: props.ctrl.maxlength, //最大长度
      rows: props.ctrl.rows, //显示行数
      readonly: props.ctrl.readonly, //仅显示
      disabled: props.ctrl.disabled, //不可用
      clearable: props.ctrl.clearable, //清空
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      required: props.ctrl.required, //必输
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //文本输入事件
  const handleInput = v => {
    emit("input", v);
  };
  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
  //在 Input 获得焦点时触发
  const handleFocus = e => {
    emit("focus", e);
  };
  //在 Input 失去焦点时触发
  const handleBlur = e => {
    emit("blur", e);
  };
  //在 Input 点击时触发
  const handleClick = e => {
    emit("click", e);
  };
</script>