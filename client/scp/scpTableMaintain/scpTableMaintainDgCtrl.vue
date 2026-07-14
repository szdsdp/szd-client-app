<template>
  <!--  控件类型 input -->
  <template v-if="_ctrlParam.ctrlType === 'input'">
    <szd-input
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :type="_ctrlParam.type"
      :numDot="_ctrlParam.numDot"
      :numDec="_ctrlParam.numDec"
      :numMax="_ctrlParam.numMax"
      :numMin="_ctrlParam.numMin"
      :placeholder="_ctrlParam.placeholder"
      :maxlength="_ctrlParam.maxlength"
      :showHelp="_ctrlParam.showHelp"
      :help="_ctrlParam.help"
      :readonly="_ctrlParam.readonly"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :clearable="_ctrlParam.clearable"
      :clickColor="_ctrlParam.clickColor"
      @click="handleDblClick"
      :align="_ctrlParam.align"
      :noZero="_ctrlParam.noZero"
      :format="_ctrlParam.format"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :desc="_ctrlParam.descField ? _dataObj[_ctrlParam.descField] : ''"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 input-number -->
  <template v-else-if="_ctrlParam.ctrlType === 'input-number'">
    <szd-input-number
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :placeholder="_ctrlParam.placeholder"
      :readonly="_ctrlParam.readonly"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :max="_ctrlParam.max"
      :min="_ctrlParam.min"
      :precision="_ctrlParam.precision"
      :step="_ctrlParam.step"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 date -->
  <template v-else-if="_ctrlParam.ctrlType === 'date'">
    <szd-date
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :type="_ctrlParam.type"
      :placeholder="_ctrlParam.placeholder"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :clearable="_ctrlParam.clearable"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 time -->
  <template v-else-if="_ctrlParam.ctrlType === 'time'">
    <szd-time
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :placeholder="_ctrlParam.placeholder"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :clearable="_ctrlParam.clearable"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 checkbox -->
  <template v-else-if="_ctrlParam.ctrlType === 'checkbox'">
    <szd-checkbox
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :baseField="_ctrlParam.baseField"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :max="_ctrlParam.max"
      :min="_ctrlParam.min"
      :checkboxAll="_ctrlParam.checkboxAll"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 radio -->
  <template v-else-if="_ctrlParam.ctrlType === 'radio'">
    <szd-radio
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :baseField="_ctrlParam.baseField"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :first="_ctrlParam.first"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 select -->
  <template v-else-if="_ctrlParam.ctrlType === 'select'">
    <szd-select
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :placeholder="_ctrlParam.placeholder"
      :baseField="_ctrlParam.baseField"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :clearable="_ctrlParam.clearable"
      :first="_ctrlParam.first"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 textarea -->
  <template v-else-if="_ctrlParam.ctrlType === 'textarea'">
    <szd-textarea
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :placeholder="_ctrlParam.placeholder"
      :maxlength="_ctrlParam.maxlength"
      :readonly="_ctrlParam.readonly"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :rows="_ctrlParam.rows"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 password -->
  <template v-else-if="_ctrlParam.ctrlType === 'password'">
    <szd-password
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :placeholder="_ctrlParam.placeholder"
      :maxlength="_ctrlParam.maxlength"
      :readonly="_ctrlParam.readonly"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
  <!--  控件类型 upload -->
  <template v-else-if="_ctrlParam.ctrlType === 'upload' && _uploadParam.fileCate">
    <szd-upload-view
      ref="refUploadView"
      v-model="_dataObj[_ctrlParam.fieldCode]"
      :fileCate="_uploadParam.fileCate"
      :filePath="_uploadParam.filePath"
      :listType="_uploadParam.listType"
      :limit="_uploadParam.limit"
      :fileSize="_uploadParam.fileSize"
      :accept="_uploadParam.accept"
      :acceptTxt="_uploadParam.acceptTxt"
      :extensions="_uploadParam.extensions"
      :checkRepeat="_uploadParam.checkRepeat"
      :download="_uploadParam.download"
      :dimension="_uploadParam.dimension"
      :compress="_uploadParam.compress"
      :capture="_uploadParam.capture"
      :cardWidth="_uploadParam.cardWidth"
      :cardHeight="_uploadParam.cardHeight"
      :previewType="_uploadParam.previewType"
      :showDelete="_uploadParam.showDelete"
      :bussId="_uploadParam.bussId"
      :bussDocId="_uploadParam.bussDocId"
      :watermark="_uploadParam.watermark"
      :disabled="_ctrlParam.disabled || (_mDg.option === 'U' && props.domItem.isPk)"
      :label="_ctrlParam.label"
      :required="_ctrlParam.required"
      :szdopt="_mDg.option" />
  </template>
</template>

<script setup>
  import { computed, onMounted, ref } from "vue";
  import { clickInputLink, mainScrGetInputCtrlParam } from "../scpBaseCtrl/scpBaseCtrlParamScrInput";

  const emit = defineEmits(["update:dataObj", "setRefUploadView"]);

  const props = defineProps({
    dataObj: {
      type: Object
    },
    codeObj: {
      type: Object
    },
    domItem: {
      type: Object
    },
    mDg: {
      type: Object
    }
  });

  //上传组件的 ref
  const refUploadView = ref();

  //设置ref组件
  onMounted(() => {
    if (_ctrlParam.value.ctrlType === "upload" && refUploadView.value) {
      emit("setRefUploadView", _ctrlParam.value.fieldCode, refUploadView.value);
    }
  });

  //数据对象
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });

  //控件参数-获取
  const _ctrlParam = computed(() => {
    return mainScrGetInputCtrlParam(props.codeObj, props.domItem, _dataObj.value);
  });

  //控件参数-上传参数
  const _uploadParam = computed(() => {
    let _bussId = "";
    for (let i = 0; i < props.codeObj.itemList.length; i++) {
      let item = props.codeObj.itemList[i];
      if (item.isPk && _dataObj.value[item.fieldCode]) {
        _bussId = _bussId ? _bussId + "_" + _dataObj.value[item.fieldCode] : _dataObj.value[item.fieldCode];
      }
    }
    _ctrlParam.value.uploadParam.bussId = _bussId;
    return _ctrlParam.value.uploadParam;
  });

  //主功能状态-获取option
  const _mDg = computed(() => {
    return props.mDg ? props.mDg : {};
  });

  //双击事件
  const handleDblClick = () => {
    clickInputLink(props.domItem, _dataObj.value);
  };
</script>