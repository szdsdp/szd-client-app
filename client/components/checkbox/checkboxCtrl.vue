<template>
  <template v-if="!_ctrl.hide">
    <szd-checkbox
      v-model="_modelValue"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :boxLabel="_ctrl.boxLabel"
      :baseField="_ctrl.baseField"
      :baseArr="_ctrl.baseArr"
      :max="_ctrl.max"
      :min="_ctrl.min"
      :checkboxAll="_ctrl.checkboxAll"
      :disabled="_ctrl.disabled"
      :direction="_ctrl.direction"
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
      type: [String, Number, Boolean, Array]
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
      boxLabel: props.ctrl.boxLabel, //单复选框 标签名称
      baseField: props.ctrl.baseField, //多复选框 基础字段
      baseArr: props.ctrl.baseArr, //多复选框 数组[{svalue:"",sname:""}]
      max: props.ctrl.max, //多复选框 最大选择数
      min: props.ctrl.min, //多复选框 最小选择数
      checkboxAll: props.ctrl.checkboxAll, //多复选框 显示全选 true 显示 top 在上班 left 在左边
      disabled: props.ctrl.disabled, //多复选框 + 单复选框 不可用
      direction: props.ctrl.direction, //垂直布局
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