<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      v-model="_modelValue"
      :placeholder="$t(placeholder)"
      :hint="label ? false : hint"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      @change="handleChange"
      @click="handleClick"
      :class="handleClass()"
      style="width: 100%">
      <template #append-icon>
        <var-icon class="prepend-icon" name="barcode-scan" size="18" style="padding-left: 5px" />
      </template>
      <template v-if="desc" #extra-message>
        {{ desc }}
      </template>
    </var-input>

    <scanPopup
      v-model:show="_show"
      :mode="_scanCtrl.mode"
      :formats="_scanCtrl.formats"
      :delayTime="_scanCtrl.delayTime"
      :track="_scanCtrl.track"
      :constraints="_scanCtrl.constraints"
      :scanZoom="_scanCtrl.scanZoom"
      :isPhoto="_scanCtrl.isPhoto"
      :isInput="_scanCtrl.isInput"
      :isLight="_scanCtrl.isLight"
      :isAnimation="_scanCtrl.isAnimation"
      @scan="handleScan" />
  </div>
</template>
<script setup>
  import _ from "lodash";
  import { computed, ref, nextTick } from "vue";
  import { Picker } from "@varlet/ui";
  import szdComp from "../../common/utils/component";
  import { $t } from "../../common/utils/globalConfig";
  import scanPopup from "./scanPopup.vue";

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
    readonly: {
      type: Boolean,
      default: true
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
    desc: {
      type: String,
      default: ""
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    },
    //扫码参数
    scanCtrl: {
      type: Object,
      default: {}
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
  //选择窗口
  const _show = ref(false);
  //扫码参数
  const _scanCtrl = computed(() => {
    return {
      mode: ["A", "B", "C"].includes(props.scanCtrl.mode) ? props.scanCtrl : "A",
      formats: Array.isArray(props.scanCtrl.formats) ? props.scanCtrl.formats : [],
      delayTime: Number(props.scanCtrl.delayTime),
      track: _.isBoolean(props.scanCtrl.track) ? props.scanCtrl.track : false,
      constraints: props.scanCtrl.constraints,
      scanZoom: Number(props.scanCtrl.scanZoom),
      isPhoto: props.scanCtrl.isPhoto,
      isInput: props.scanCtrl.isInput,
      isLight: props.scanCtrl.isLight,
      isAnimation: props.scanCtrl.isAnimation
    };
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

  //样式
  const handleClass = () => {
    let _class = [];
    if (props.desc) {
      _class.push("div-extra-desc");
    } else {
      _class.push("div-extra-none");
    }
    return _class;
  };

  //更改事件
  const handleChange = v => {
    emit("change", v);
  };

  //点击事件
  const handleClick = v => {
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      _modelValue.value = "";
      emit("change", "");
    } else {
      _show.value = true;
    }
  };

  //扫码结果
  const handleScan = scan => {
    if (scan.codeArr.length === 1) {
      if (_modelValue.value !== scan.codeArr[0]) {
        _modelValue.value = scan.codeArr[0];
        nextTick(() => {
          handleChange(_modelValue.value);
        });
      }
    } else if (scan.codeArr.length > 1) {
      picker(scan.codeArr);
    }
  };

  //多个编码选择
  async function picker(codeArr) {
    let _columns = [[]];
    for (let i = 0; i < codeArr.length; i++) {
      _columns[0].push({ text: codeArr[i] });
    }
    const { state, values } = await Picker({ columns: _columns });
    if (state === "confirm" && values.length === 1) {
      _modelValue.value = values[0];
      handleChange(_modelValue.value);
    }
  }
</script>
<style scoped lang="scss">
  :deep(.var-form-details) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :deep(.var-form-details__extra-message) {
    word-wrap: break-word;
    word-break: break-all;
  }

  .div-extra-desc {
    :deep(.var-form-details__extra-message) {
      text-align: left;
    }
  }

  .div-extra-none {
    :deep(.var-form-details) {
      display: none;
    }
  }
</style>