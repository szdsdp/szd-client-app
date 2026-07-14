<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      type="text"
      :placeholder="$t(placeholder)"
      :hint="label ? false : hint"
      v-model="_modelValue"
      :maxlength="maxlength"
      textarea
      :rows="rows"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
      style="width: 100%" />
  </div>
</template>
<script setup>
  import { computed } from "vue";
  import szdComp from "../../common/utils/component";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    modelValue: {
      type: String
    },
    label: {
      type: String
    },
    placeholder: {
      type: String,
      default: ""
    },
    hint: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number,
      default: 200
    },
    rows: {
      type: Number,
      default: 3
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
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
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "click"]);
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
  //点击事件
  const handleClick = v => {
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      _modelValue.value = "";
      emit("change", "");
    } else {
      emit("click");
    }
  };
</script>