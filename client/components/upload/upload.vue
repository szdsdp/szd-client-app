<template>
  <!-- 通用导入组件 -->
  <var-popup v-model:show="dg.open" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" style="height: 60vh" @close="handleClose">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="确定" type="primary" @click="submitForm" :disabled="fileList.length === 0 || dg.disabled" />
      </var-button-group>
    </div>
    <div v-if="uploadParams.acceptTxt" class="main-remark" style="margin-bottom: 5px">
      <span>{{ uploadParams.acceptTxt }}</span>
    </div>

    <!-- 上传文件 -->
    <div class="szd__popup__main" style="padding: 10px; background-color: #ffffff">
      <var-uploader
        ref="refUpload"
        v-model="fileList"
        :accept="uploadParams.accept"
        :multiple="uploadParams.limit > 1"
        :maxlength="uploadParams.limit"
        :maxsize="uploadParams.fileSize"
        :disabled="dg.disabled"
        @before-read="handleBeforeRead"
        @after-read="handleAfterRead"
        @oversize="handleOversize"
        @remove="handleRemove">
      </var-uploader>
    </div>
  </var-popup>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import _ from "lodash";
  import Compressor from "compressorjs";
  import { $m, $mS, $mW, $t } from "../../common/utils/globalConfig";
  import { uploadFile } from "../api/upload";
  import { szdMsgBox } from "../msgBox/msgBox";

  const props = defineProps({
    updParams: {
      type: Object,
      default: {}
    }
  });

  const emit = defineEmits(["uploadResult", "closeDialog"]);
  //上传文件控件
  const refUpload = ref();

  //窗口对象
  const dg = ref({
    open: false,
    disabled: false
  });
  //上传参数
  const uploadParams = ref({
    limit: 1, //最大上传文件数
    fileSize: undefined, //文件大小-KB
    fileSizeKb: "",
    dimension: [], //尺寸[宽-最小，宽-最大，高-最小，高-最大]
    accept: "", //上传文件类型 ".xls,.xlsx", ".png"
    acceptTxt: "", //提示信息
    extensions: [], //文件后缀
    uploadUrl: "", //上传地址
    fileCate: "", //附件类别-根目录
    filePath: "", //文件路径
    bussId: "", //业务id
    showMsgBox: true, //显示消息盒子
    compress: {
      compress: false, //是否压缩
      fileSize: 1024, //超过多大进行压缩KB
      quality: 0.8, //压缩质量
      widthMax: 1600, //压缩最大宽度
      widthMin: 100 //压缩最小宽度
    }
  });
  //上传文件清单
  const fileList = ref([]);
  const fileUpload = ref([]);
  const fileCompressor = ref([]);

  onMounted(() => {
    initUploadParam(props.updParams);
  });

  //初始化上传参数
  const initUploadParam = infoParam => {
    initData();
    // 上传数据参数
    if (!infoParam.uploadUrl && !infoParam.fileCate) {
      $m("CORE_CLIENT.E079"); //上传地址参数不能为空
      return;
    }

    if (infoParam.limit && infoParam.limit > 1) uploadParams.value.limit = infoParam.limit;
    if (infoParam.fileSize && infoParam.fileSize > 0) {
      uploadParams.value.fileSize = infoParam.fileSize * 1024;
      uploadParams.value.fileSizeKb = infoParam.fileSize;
    }
    if (infoParam.dimension && Array.isArray(infoParam.dimension) && infoParam.dimension.length === 4) {
      uploadParams.value.dimension = infoParam.dimension;
    }
    if (infoParam.accept) {
      uploadParams.value.accept = infoParam.accept;
      uploadParams.value.acceptTxt = $t("提示：仅允许导入") + uploadParams.value.accept + $t("格式文件！");
    }
    if (infoParam.acceptTxt) uploadParams.value.acceptTxt = infoParam.acceptTxt;
    if (infoParam.extensions && Array.isArray(infoParam.extensions)) {
      for (let i = 0; i < infoParam.extensions.length; i++) {
        uploadParams.value.extensions.push(infoParam.extensions[i].toString().toLowerCase());
      }
    }
    uploadParams.value.uploadUrl = infoParam.uploadUrl ? infoParam.uploadUrl : "/core/common/file/upload";
    uploadParams.value.bussId = infoParam.bussId;
    uploadParams.value.fileCate = infoParam.fileCate;
    uploadParams.value.filePath = infoParam.filePath;
    if (infoParam.showMsgBox === false) uploadParams.value.showMsgBox = infoParam.showMsgBox;
    // 压缩图片
    if (infoParam.compress && _.isObject(infoParam.compress) && infoParam.compress.compress === true) {
      if (infoParam.compress.compress) uploadParams.value.compress.compress = infoParam.compress.compress;
      if (infoParam.compress.fileSize && infoParam.compress.fileSize > 0) uploadParams.value.compress.fileSize = infoParam.compress.fileSize;
      uploadParams.value.compress.fileSize = uploadParams.value.compress.fileSize * 1024;
      if (infoParam.compress.quality && infoParam.compress.quality > 0 && infoParam.compress.quality < 1) {
        uploadParams.value.compress.quality = infoParam.compress.quality;
      }
      if (infoParam.compress.widthMax && infoParam.compress.widthMax > 0) uploadParams.value.compress.widthMax = infoParam.compress.widthMax;
      if (infoParam.compress.widthMin && infoParam.compress.widthMin > 0) uploadParams.value.compress.widthMin = infoParam.compress.widthMin;
    }
    dg.value.open = true;
  };

  //文件上传
  const submitForm = () => {
    if (fileUpload.value.length === 0) {
      $mW("请选择上传文件");
      return;
    }
    dg.value.disabled = true;
    let uploadObj = {
      bussId: uploadParams.value.bussId,
      fileCate: uploadParams.value.fileCate,
      filePath: uploadParams.value.filePath,
      fileUpload: []
    };
    for (let i = 0; i < fileUpload.value.length; i++) {
      let item = fileUpload.value[i];
      let _compress = fileCompressor.value.find(r => r.fileName === item.fileName);
      if (_compress) {
        uploadObj.fileUpload.push(_compress);
      } else {
        uploadObj.fileUpload.push(item);
      }
    }
    uploadFile(uploadParams.value.uploadUrl, uploadObj).then(response => {
      emit("uploadResult", response);
      if (uploadParams.value.showMsgBox) {
        if (response && response.length > 0) {
          szdMsgBox(response).then();
        } else {
          $mS("文件上传完成");
        }
      }
      dg.value.open = false;
    });
  };

  //检查
  const handleBeforeRead = file => {
    //检查文件名是否重复
    if (fileList.value.find(r => r.name === file.name)) {
      $mW("存在相同的文件名");
      return false;
    }
    //检查文件后缀
    if (uploadParams.value.extensions.length > 0) {
      const _lastIndex = file.name.lastIndexOf(".");
      if (
        _lastIndex === -1 ||
        _lastIndex === file.name.length - 1 ||
        !uploadParams.value.extensions.includes(file.name.substring(_lastIndex + 1).toLowerCase())
      ) {
        $mW("文件不正确");
        return false;
      }
    }
    //检查尺寸
    if (!file.file.type.toLowerCase().startsWith("image/") || uploadParams.value.dimension.length !== 4) return true;
    return new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file.file);
      fileReader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const [width_0, width_1, height_0, height_1] = uploadParams.value.dimension;
          if (img.width < width_0 || img.width > width_1 || img.height < height_0 || img.height > height_1) {
            $m("CORE_CLIENT.E016", [width_0, height_0, width_1, height_1]); //图片尺寸限制为 & * & 到 & * &
            resolve(false);
          } else {
            resolve(true);
          }
        };
      };
    });
  };

  //文件读取
  const handleAfterRead = file => {
    //添加原文件
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file.file);
    fileReader.onload = event => {
      fileUpload.value.push({ fileName: file.name, fileBase64: event.target.result });
    };
    //添加压缩文件
    if (
      file.file.type.toLowerCase().startsWith("image/") &&
      uploadParams.value.compress.compress === true &&
      file.file.size > uploadParams.value.compress.fileSize
    ) {
      processCompressor(file);
    }
  };

  //添加压缩文件
  const processCompressor = file => {
    new Compressor(file.file, {
      quality: uploadParams.value.compress.quality,
      maxWidth: uploadParams.value.compress.widthMax,
      minWidth: uploadParams.value.compress.widthMin,
      success(result) {
        const fileResult = new File([result], result.name, {
          type: result.type,
          lastModified: result.lastModified,
          size: result.size
        });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileResult);
        fileReader.onload = event => {
          fileCompressor.value.push({ fileName: file.name, fileBase64: event.target.result });
        };
      },
      error(err) {
        console.error("压缩文件err-" + file.name, err);
      }
    });
  };

  //文件查过允许范围触发
  const handleOversize = () => {
    $m("CORE_CLIENT.E029", uploadParams.value.fileSizeKb); //上传文件大小不能大于 & KB
  };

  //文件删除
  const handleRemove = file => {
    const _index1 = fileUpload.value.findIndex(r => r.fileName === file.name);
    if (_index1 > -1) {
      fileUpload.value.splice(_index1, 1);
    }
    const _index2 = fileCompressor.value.findIndex(r => r.fileName === file.name);
    if (_index2 > -1) {
      fileCompressor.value.splice(_index2, 1);
    }
  };

  const handleClose = () => {
    refUpload.value.reset();
    fileList.value = [];
    fileUpload.value = [];
    fileCompressor.value = [];
    emit("closeDialog");
  };

  //初始化数据
  const initData = () => {
    dg.value.disabled = false;
    uploadParams.value = {
      limit: 1, //最大上传文件数
      fileSize: undefined, //文件大小
      fileSizeKb: "",
      dimension: [], //尺寸[宽-最小，宽-最大，高-最小，高-最大]
      accept: "", //上传文件类型 ".xls,.xlsx"
      acceptTxt: "", //提示信息
      extensions: [], //文件后缀
      uploadUrl: "", //上传的地址
      fileCate: "", //附件类别-根目录
      filePath: "", //文件路径
      bussId: "", //业务id
      showMsgBox: true, //显示消息盒子
      compress: {
        compress: false, //是否压缩
        fileSize: 1024, //超过多大进行压缩KB
        quality: 0.8, //压缩质量
        widthMax: 1600, //压缩最大宽度
        widthMin: 100 //压缩最小宽度
      }
    };
    fileList.value = [];
    fileUpload.value = [];
    fileCompressor.value = [];
  };
</script>