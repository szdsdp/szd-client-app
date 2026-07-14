<template>
  <template v-if="!_ctrl.hide">
    <szd-date
      v-model="_modelValue"
      :type="_ctrl.type"
      :label="_ctrl.label"
      :placeholder="_ctrl.placeholder"
      :disabled="_ctrl.disabled"
      :clearable="_ctrl.clearable"
      :hint="_ctrl.hint"
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
      type: [String, Date, Array]
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
      type: props.ctrl.type, //类型
      label: props.ctrl.label, //标签
      placeholder: props.ctrl.placeholder, //占位符
      readonly: props.ctrl.readonly, //仅显示
      disabled: props.ctrl.disabled, //不可用
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      clearable: props.ctrl.clearable, //清空按钮
      hint: props.ctrl.hint, //是否使用占位符作为提示
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