<template>
  <template v-if="!_ctrl.hide">
    <szd-upload-view
      v-model="_modelValue"
      v-model:fileCount="_fileCount"
      :fileCate="_ctrl.fileCate"
      :filePath="_ctrl.filePath"
      :listType="_ctrl.listType"
      :limit="_ctrl.limit"
      :fileSize="_ctrl.fileSize"
      :accept="_ctrl.accept"
      :acceptTxt="_ctrl.acceptTxt"
      :extensions="_ctrl.extensions"
      :checkRepeat="_ctrl.checkRepeat"
      :download="_ctrl.download"
      :dimension="_ctrl.dimension"
      :compress="_ctrl.compress"
      :capture="_ctrl.capture"
      :cardWidth="_ctrl.cardWidth"
      :cardHeight="_ctrl.cardHeight"
      :previewType="_ctrl.previewType"
      :showDelete="_ctrl.showDelete"
      :bussId="_ctrl.bussId"
      :bussDocId="_ctrl.bussDocId"
      :watermark="_ctrl.watermark"
      :disabled="_ctrl.disabled"
      :szdfst="_ctrl.szdfst"
      :szdopt="_ctrl.szdopt"
      @preview="handlePreview" />
  </template>
</template>

<script setup>
  import { computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: [String, Number]
    },
    //文件数量
    fileCount: {
      type: Number,
      default: 0
    },
    //控件参数
    ctrl: {
      type: Object
    },
    //表加载控件
    isTable: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(["update:modelValue", "update:fileCount", "preview"]);
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
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      fileCate: props.ctrl.fileCate, //文件类别、文件根目录
      filePath: props.ctrl.filePath, //文件路径
      listType: props.isTable ? props.ctrl.listTypeTable : props.ctrl.listType, //文件列表的类型
      limit: props.ctrl.limit, //最大上传文件数
      fileSize: props.ctrl.fileSize, //文件大小-KB
      accept: props.ctrl.accept, //上传文件类型 ".xls,.xlsx"
      acceptTxt: props.ctrl.acceptTxt, //提示信息
      extensions: props.ctrl.extensions, //文件后缀
      checkRepeat: props.ctrl.checkRepeat, //检查文件重复
      download: props.ctrl.download, //支持下载
      dimension: props.ctrl.dimension, //尺寸[宽-最小，宽-最大，高-最小，高-最大]
      compress: props.ctrl.compress, //压缩图片
      capture: props.ctrl.capture, //上传模式
      cardWidth: props.ctrl.cardWidth, //卡片大小-宽
      cardHeight: props.ctrl.cardHeight, //卡片大小-高
      previewType: props.ctrl.previewType, //预览方式
      showDelete: props.ctrl.showDelete, //显示删除文件
      bussId: props.ctrl.bussId, //业务Id
      bussDocId: props.ctrl.bussDocId, //业务单号
      watermark: props.ctrl.watermark, //水印
      disabled: props.ctrl.disabled,
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });

  //预览
  const handlePreview = obj => {
    emit("preview", obj);
  };
</script>