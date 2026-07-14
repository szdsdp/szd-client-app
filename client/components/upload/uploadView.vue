<template>
  <!-- 上传、预览、删除区域 -->
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <!-- 显示标签 -->
    <div v-if="_label && labelAlign.startsWith('top')" class="main-form-item-label pr10" :style="handleStyleLabel()">
      <div class="label" :class="handleClassLabel()" style="margin-bottom: 5px">{{ _label }}</div>
    </div>
    <!-- 上传区 -->
    <uploadViewListType
      ref="refUploadView"
      v-bind="$attrs"
      v-model="_modelValue"
      v-model:fileCount="_fileCount"
      :disabled="disabled"
      :szdfst="szdfst"
      :szdopt="szdopt"
      :style="handleStyleLabel()"
      @preview="handlePreview" />
    <!-- 显示标签 -->
    <div v-if="_label && labelAlign.startsWith('bottom')" class="main-form-item-label pr10" :style="handleStyleLabel()">
      <div class="label" :class="handleClassLabel()">{{ _label }}</div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";
  import uploadViewListType from "./uploadViewListType.vue";

  const props = defineProps({
    //文件对象号
    modelValue: {
      type: String
    },
    //文件数量
    fileCount: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    },
    //标题位置 top-left top-center top-right bottom-left bottom-center bottom-right
    labelAlign: {
      type: String,
      default: "top-left"
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String
    },
    required: {
      type: Boolean,
      default: true
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "update:fileCount", "preview"]);
  const refUploadView = ref();
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //文件数量
  const _fileCount = computed({
    get: () => props.fileCount,
    set: val => {
      emit("update:fileCount", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return $t(props.label);
    return $t(props.placeholder);
  });

  //标签样式
  const handleStyleLabel = () => {
    let _labelStyle = {};
    if (props.labelAlign.includes("center")) {
      _labelStyle["justify-content"] = "center";
    } else if (props.labelAlign.includes("right")) {
      _labelStyle["justify-content"] = "flex-end";
    } else if (props.labelAlign.includes("left")) {
      _labelStyle["justify-content"] = "flex-start";
    }
    return _labelStyle;
  };
  const handleClassLabel = () => {
    let _labelClass = [];
    if (_fst.value.disabled) _labelClass.push("label-disabled");
    if (props.labelAlign !== "top-left") _labelClass.push("l-label");
    return _labelClass;
  };

  //预览
  const handlePreview = obj => {
    emit("preview", obj);
  };

  //获取文件数量-未删除
  const getFileCount = () => {
    return refUploadView.value.getFileCount();
  };

  //获取文件列表
  const getFileList = () => {
    return refUploadView.value.getFileList();
  };

  defineExpose({
    getFileCount,
    getFileList
  });
</script>
<style lang="scss" scoped>
  .pr10 {
    padding-right: 10px;
  }

  .l-label {
    white-space: normal;
    word-wrap: break-word;
    text-align: center;

    &::before {
      display: none;
    }
  }
</style>