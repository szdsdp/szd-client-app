<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      :placeholder="$t(placeholder)"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      :hint="label ? false : hint"
      v-model="_modelValueInput"
      @click="handleOpen"
      style="width: 100%">
      <template #append-icon>
        <div style="padding-left: 5px">
          <svg data-v-d2e47025="" class="prepend-icon svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"></path>
            <path fill="currentColor" d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"></path>
            <path fill="currentColor" d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32"></path>
          </svg>
        </div>
      </template>
    </var-input>
    <!-- 日期弹窗 -->
    <var-popup position="bottom" v-model:show="_show" close-on-click-overlay @closed="handleClosed">
      <var-time-picker :format="format" v-model="_modelValue" @change="handleChange" />
    </var-popup>
  </div>
</template>
<script setup>
  import { computed, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";
  import _ from "lodash";

  const props = defineProps({
    modelValue: {
      type: [String, Date]
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    hint: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: "24hr"
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
  //更新数据对象返回值
  const emit = defineEmits(["update:modelValue", "change"]);
  //原值
  const _valOld = ref();
  //值数据
  const _modelValue = computed({
    get: () => {
      return props.modelValue;
    },
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //输出显示
  const _modelValueInput = computed(() => {
    return _modelValue.value;
  });
  //日期选择窗口
  const _show = ref(false);
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
  });

  //打开日期选择器
  const handleOpen = v => {
    _valOld.value = _.cloneDeep(_modelValue.value);
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      handleClear();
    } else {
      _show.value = true;
    }
  };

  //清空数据
  const handleClear = () => {
    _modelValue.value = "";
    emit("change", "");
  };

  //更改事件
  const handleChange = () => {
    // _show.value = false;
  };

  const handleClosed = () => {
    if (JSON.stringify(_valOld.value) !== JSON.stringify(_modelValue.value)) {
      emit("change", _modelValue.value);
    }
  };
</script>
<style scoped lang="scss">
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }
</style>