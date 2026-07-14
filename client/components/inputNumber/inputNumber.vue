<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="_label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-counter
      v-model="_modelValue"
      :max="max"
      :min="min"
      :decimal-length="precision"
      :step="step"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      @change="handleChange"
      style="width: 100%" />
  </div>
</template>
<script setup>
  import { computed } from "vue";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: Number
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    precision: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "change"]);
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
  });
  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
</script>