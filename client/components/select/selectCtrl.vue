<template>
  <template v-if="!_ctrl.hide">
    <szd-select
      v-model="_modelValue"
      :size="_ctrl.size"
      :baseField="_ctrl.baseField"
      :baseArr="_ctrl.baseArr"
      :baseSelect="_ctrl.baseSelect"
      :disabled="_ctrl.disabled"
      :clearable="_ctrl.clearable"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :hint="_ctrl.hint"
      :showKey="_ctrl.showKey"
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
      size: props.ctrl.size, //大小
      baseField: props.ctrl.baseField, //基础字段
      baseArr: props.ctrl.baseArr, //数组
      baseSelect: props.ctrl.baseSelect, //查询条件
      disabled: props.ctrl.disabled, //不可用
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      clearable: props.ctrl.clearable, //清空
      label: props.ctrl.label, //标签
      placeholder: props.ctrl.placeholder, //占位符
      hint: props.ctrl.hint, //是否使用占位符作为提示
      showKey: props.ctrl.showKey, //显示Key值
      first: props.ctrl.first, //值为空默认第一个
      required: props.ctrl.required, //必输
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //更改事件
  const handleChange = (v, res) => {
    emit("change", v, res);
  };
</script>