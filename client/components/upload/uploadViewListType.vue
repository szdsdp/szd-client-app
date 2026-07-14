<template>
  <!-- 上传、预览、删除区域 -->
  <div class="l-upload-container-card" v-if="_listType === 'picture-card'">
    <!-- 文件列表 -->
    <div v-for="file in fileList" class="l-uploader__file" :style="{ width: cardWidth + 'px', height: cardHeight + 'px' }">
      <div v-if="file.fileDel" class="l-img-del">DELETED</div>
      <div class="l-uploader__file-img" @click="handlePreview(file)">
        <img v-if="file.file.type.startsWith('image/')" :src="file.url" class="l-uploader__file-cover" />
        <img v-else :src="handleShowIcon(file.name)" style="width: 85%" />
      </div>
      <div v-if="!_fst.disabled" class="var-uploader__file-close">
        <var-icon name="menu" @click="handleCallEdit(file)" class="var-uploader__file-close-icon" var-uploader-cover />
      </div>
      <div v-if="file.uid && fileProgress[file.uid] > 0 && fileProgress[file.uid] < 100" class="l-progress-percentage">
        <var-progress :value="fileProgress[file.uid]" />
      </div>
    </div>
    <!-- 上传按钮 -->
    <div
      v-if="uploadParams.limit === 0 || uploadParams.limit > fileList.length"
      class="l-uploader__upload"
      :style="{ width: cardWidth + 'px', height: cardHeight + 'px' }">
      <var-uploader
        ref="refUpload"
        :capture="capture"
        :multiple="uploadParams.multiple"
        :maxlength="uploadParams.limit && uploadParams.limit > 0 ? uploadParams.limit : undefined"
        :accept="uploadParams.accept"
        :maxsize="uploadParams.fileSizeBt"
        :disabled="_fst.disabled || (uploadParams.limit !== 0 && uploadParams.limit <= fileList.length)"
        @before-read="handleBeforeRead"
        @after-read="handleAfterRead"
        @oversize="handleOversize"
        class="l-upload-style l-upload-style-card">
        <div class="var-uploader__action var-elevation--2 l-uploader__file-but" :style="{ width: cardWidth + 'px', height: cardHeight + 'px' }">
          <var-icon name="plus" :size="24" />
          <!-- 提示信息 -->
          <div v-if="uploadParams.acceptTxt" class="l-upload-tap">{{ uploadParams.acceptTxt }}</div>
        </div>
      </var-uploader>
    </div>
    <uploadViewEdit ref="refUploadViewEdit" @updFile="handleUpdFile" />
  </div>
  <div v-else class="l-upload-container-text">
    <!-- 上传按钮 -->
    <var-uploader
      ref="refUpload"
      :capture="capture"
      :multiple="uploadParams.multiple"
      :maxlength="uploadParams.limit && uploadParams.limit > 0 ? uploadParams.limit : undefined"
      :accept="uploadParams.accept"
      :maxsize="uploadParams.fileSizeBt"
      :disabled="_fst.disabled || (uploadParams.limit !== 0 && uploadParams.limit <= fileList.length)"
      @before-read="handleBeforeRead"
      @after-read="handleAfterRead"
      @oversize="handleOversize"
      class="l-upload-style">
      <div class="l-upload-button">
        <div
          class="l-upload-btn"
          :style="{ color: _fst.disabled || (uploadParams.limit !== 0 && uploadParams.limit <= fileList.length) ? '#999999' : '' }">
          <var-icon name="weather-cloudy" />
          <span style="padding-left: 5px">{{ $t("点击上传") }}</span>
        </div>
        <!-- 提示信息 -->
        <div v-if="uploadParams.acceptTxt" class="l-upload-tap">{{ uploadParams.acceptTxt }}</div>
      </div>
    </var-uploader>
    <!-- 文件列表 -->
    <div v-for="file in fileList" class="l-file-info">
      <template v-if="_listType === 'text'">
        <div class="l-text-info" @click="handlePreview(file)">
          <var-icon name="file-document-outline" :size="18" />
          <span style="padding-left: 5px" :class="file.fileDel ? 'l-text-del-line' : ''">{{ file.name }}</span>
        </div>
        <div v-if="!_fst.disabled" class="l-text-icon">
          <var-icon name="menu" @click="handleCallEdit(file)" />
        </div>
      </template>
      <template v-else-if="_listType === 'picture'">
        <div class="l-text-info" @click="handlePreview(file)">
          <img v-if="file.file.type.startsWith('image/')" :src="file.url" style="width: 50px; height: 50px" />
          <img v-else :src="handleShowIcon(file.name)" style="width: 50px" />
          <div class="l-text-info-picture" :class="file.fileDel ? 'l-text-del-line' : ''">
            <div>
              <label>{{ $t("文件名") }}:</label> <span>{{ file.name }}</span>
            </div>
            <div>
              <label>{{ $t("上传人") }}:</label> <span>{{ file.uploadByName }}</span>
            </div>
            <div>
              <label>{{ $t("上传时间") }}:</label> <span>{{ file.uploadTime }}</span>
            </div>
          </div>
        </div>
        <div v-if="!_fst.disabled" class="l-text-icon">
          <var-icon name="menu" @click="handleCallEdit(file)" />
        </div>
      </template>
      <div v-if="file.uid && fileProgress[file.uid] > 0 && fileProgress[file.uid] < 100" class="l-progress-percentage">
        <var-progress :value="fileProgress[file.uid]" />
      </div>
    </div>
    <uploadViewEdit ref="refUploadViewEdit" @updFile="handleUpdFile" />
  </div>
</template>

<script setup>
  import { computed, nextTick, onMounted, ref, watch } from "vue";
  import _ from "lodash";
  import Compressor from "compressorjs";
  import { $m, $mE, $mS, $mW, $t } from "../../common/utils/globalConfig";
  import { getUploadViewList, updUploadViewFileBuss, updUploadViewFileById } from "../api/upload";
  import { requestUploadFile } from "../../common/utils/requestUpload";
  import { szdFileView } from "../fileView/fileView";
  import szdFile from "../../common/tools/fileTool";
  import szdComp from "../../common/utils/component";
  import uploadViewEdit from "./uploadViewEdit";

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
    //文件类别、文件根目录
    fileCate: {
      type: String,
      default: ""
    },
    //根文件后文件路径
    filePath: {
      type: String,
      default: ""
    },
    //文件列表的类型
    listType: {
      type: String,
      default: "text"
    },
    //最大上传文件数
    limit: {
      type: Number,
      default: 100
    },
    //文件大小-KB
    fileSize: {
      type: Number
    },
    //上传文件类型 ".xls,.xlsx"
    accept: {
      type: String
    },
    //提示信息
    acceptTxt: {
      type: String,
      default: ""
    },
    //文件后缀
    extensions: {
      type: Array,
      default: []
    },
    //检查文件重复
    checkRepeat: {
      type: Boolean,
      default: true
    },
    //支持下载
    download: {
      type: Boolean,
      default: true
    },
    //尺寸[宽-最小，宽-最大，高-最小，高-最大]
    dimension: {
      type: Array,
      default: []
    },
    //压缩图片 { compress: false, //是否压缩 fileSize: 1024, //超过多大进行压缩KB quality: 0.8, //压缩质量 widthMax: 1600, //压缩最大宽度 widthMin: 100 //压缩最小宽度 }
    compress: {
      type: Object,
      default: {
        compress: false, //是否压缩
        fileSize: 1024, //超过多大进行压缩KB
        quality: 0.8, //压缩质量
        widthMax: 1600, //压缩最大宽度
        widthMin: 100 //压缩最小宽度
      }
    },
    //上传模式 environment 后置摄像头 user 前置摄像头 camera 默认摄像头
    capture: {},
    //卡片大小-宽
    cardWidth: {
      type: Number,
      default: 80
    },
    //卡片大小-高
    cardHeight: {
      type: Number,
      default: 80
    },
    //预览方式 A-单文件预览 B-多文件预览 C-客户化预览
    previewType: {
      type: String,
      default: "B"
    },
    //显示删除文件
    showDelete: {
      type: Boolean,
      default: false
    },
    //业务Id
    bussId: {
      type: String,
      default: ""
    },
    //业务单号
    bussDocId: {
      type: String,
      default: ""
    },
    //水印标记 { content: "", //内容 fontSize: 24, //字号  fontColor:"#000000", //字体颜色 opacity: 0.8, //透明度 angle: 30, //旋转角度 position:"top-left"  水印位置，top-left-左上、top-center-中上、top-right-右上、center-正中、bottom-left-左下、bottom-center-中下、bottom-right-右下 }
    watermark: {
      type: Object
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
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "update:fileCount", "preview"]);
  const refUploadViewEdit = ref();
  //值数据
  const _modelValue = ref();
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });
  const _listType = computed(() => {
    return ["text", "picture", "picture-card"].includes(props.listType) ? props.listType : "text";
  });
  //卡片图标
  const fileTypeIcon = szdFile.getFileTypeIcon();
  //上传参数
  const uploadParams = ref({});
  //上传文件控件
  const refUpload = ref();
  //上传文件清单
  const fileList = ref([]);
  const fileProgress = ref({ uid: 0 });

  //监听值数据
  watch(
    () => props.modelValue,
    () => {
      _modelValue.value = props.modelValue;
      nextTick(() => {
        getUploadViewListInfo();
      });
    },
    { immediate: true }
  );

  onMounted(() => {
    initUploadParam();
  });

  //获取文件清单
  const getUploadViewListInfo = () => {
    if (!_modelValue.value) {
      updateFileCount(); //更新文件数量
      return;
    }
    fileList.value = [];
    getUploadViewList(_modelValue.value, props.showDelete).then(res => {
      if (res.code === 200) {
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          item["name"] = item.fileName;
          item["url"] = item.fileUrl;
          item["uid"] = item.fileId;
          item["status"] = "success";
          item["file"] = { name: item.fileName, type: szdFile.getFileMimeType(item.fileName) };
          if (item.fileUrlThumb) {
            item.url = item.fileUrlThumb;
            item.file.type = szdFile.getFileMimeType(item.fileThumbExt);
          }
          fileList.value.push(item);
        }
        //更新业务单号
        updateBussDoc();
        //更新文件数量
        updateFileCount();
      }
    });
  };

  //更新业务单号
  const updateBussDoc = () => {
    if ((!props.bussId && !props.bussDocId) || fileList.value.length === 0) return;
    const _index = fileList.value.findIndex(r => r.bussId !== props.bussId || r.bussDocId !== props.bussDocId);
    if (_index > -1) {
      updUploadViewFileBuss({ fileObjId: _modelValue.value, bussId: props.bussId, bussDocId: props.bussDocId }).then();
    }
  };

  //文件上传
  const submitForm = (file, compressedFile) => {
    let _uploadObj = {
      fileObjId: _modelValue.value,
      fileCate: props.fileCate,
      filePath: props.filePath,
      bussId: props.bussId,
      bussDocId: props.bussDocId,
      watermark: props.watermark
    };
    const formData = new FormData();
    formData.append("param", JSON.stringify(_uploadObj));
    formData.append("file", compressedFile ? compressedFile : file.file, file.name);
    fileList.value.push(file);
    fileProgress.value[file.uid] = 0;
    requestUploadFile(uploadParams.value.uploadUrl, formData, progress => handleProgress(progress, file))
      .then(res => {
        delete fileProgress.value[file.uid];
        if (res.code === 200) {
          if (res.data.fileId && res.data.fileObjId) {
            $mS("文件上传完成");
            if (_modelValue.value !== res.data.fileObjId) {
              _modelValue.value = res.data.fileObjId;
              emit("update:modelValue", res.data.fileObjId);
            }
            file.fileObjId = res.data.fileObjId;
            file.fileId = res.data.fileId;
            file.uid = res.data.fileId;
            file.fileName = res.data.fileName;
            file.fileUrl = res.data.fileUrl;
            file.fileUrlThumb = res.data.fileUrlThumb;
            file.fileThumbExt = res.data.fileThumbExt;
            file.fileDel = res.data.fileDel;
            file.uploadBy = res.data.uploadBy;
            file.uploadByName = res.data.uploadByName;
            file.uploadTime = res.data.uploadTime;
            //更新文件数量
            updateFileCount();
          } else {
            $mE(["文件上传失败", res.msg]);
          }
        } else {
          $mE(["文件上传失败", res.msg]);
        }
      })
      .catch(err => {
        $mE(`上传文件失败${file.name}`);
        console.error("上传失败：", err);
      });
  };

  //文件上传进度
  const handleProgress = (progress, file) => {
    fileProgress.value[file.uid] = progress.percent;
  };

  //检查文件
  const handleBeforeRead = async file => {
    //检查文件名是否重复
    if (props.checkRepeat && fileList.value.find(r => r.name === file.name)) {
      $mW("存在相同的文件名");
      return false;
    }
    //检查文件后缀
    if (uploadParams.value.extensions.length > 0) {
      const _lastIndex = file.name.lastIndexOf(".");
      const _extensions = uploadParams.value.extensions;
      if (_lastIndex === -1 || _lastIndex === file.name.length - 1 || !_extensions.includes(file.name.substring(_lastIndex + 1).toLowerCase())) {
        $mW(["文件不正确,仅支持", _extensions.join(",")]);
        return false;
      }
    }
    //检查图片大小
    return await checkImgDimension(file);
  };

  //检查图片尺寸大小
  const checkImgDimension = file => {
    return new Promise(resolve => {
      if (file.file.type.toLowerCase().startsWith("image/") && uploadParams.value.dimension.length === 4) {
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
      } else {
        resolve(true);
      }
    });
  };

  //检查文件大小
  const handleOversize = () => {
    $m("CORE_CLIENT.E029", uploadParams.value.fileSizeKb); //上传文件大小不能大于 & KB
  };

  //文件读取
  const handleAfterRead = file => {
    if (!file.url) file.url = URL.createObjectURL(file.file);
    if (!file.uid) file.uid = Date.now() + "_" + file.id;
    const _compress = uploadParams.value.compress;
    if (file.file.type.toLowerCase().startsWith("image/") && _compress.compress && file.size > _compress.fileSizeBt) {
      processCompressor(file); //压缩文件
    } else {
      submitForm(file);
    }
  };

  //压缩文件
  const processCompressor = file => {
    new Compressor(file.file, {
      quality: uploadParams.value.compress.quality,
      maxWidth: uploadParams.value.compress.widthMax,
      minWidth: uploadParams.value.compress.widthMin,
      success(result) {
        submitForm(file, result);
      },
      error(err) {
        console.error("压缩文件err-" + file.name, err);
      }
    });
  };

  //编辑文件
  const handleCallEdit = file => {
    refUploadViewEdit.value.callUploadViewEdit(file);
  };

  //编辑保存文件
  const handleUpdFile = updFileObj => {
    updUploadViewFileById(updFileObj).then(res => {
      if (res.code === 200) {
        let _file = fileList.value.find(r => r.fileId === updFileObj.fileId);
        _file.fileDel = updFileObj.fileDel;
        if (_file.name !== updFileObj.fileName) {
          _file.name = updFileObj.fileName;
          _file.fileName = updFileObj.fileName;
        }
        $mS("文件更新成功");
        if (!props.showDelete && updFileObj.fileDel) {
          const _index = fileList.value.findIndex(r => r.uid === _file.uid);
          if (_index !== -1) fileList.value.splice(_index, 1);
        }
        //更新文件数量
        updateFileCount();
      } else {
        $mE("文件删除失败");
      }
    });
  };

  //预览文件
  const handlePreview = file => {
    if (props.previewType === "A") {
      const url = file.fileUrl ? file.fileUrl : file.url;
      if (url) szdFileView({ src: url, fileName: file.name, title: file.name });
    } else if (props.previewType === "B") {
      let _fileList = [];
      const fileIndex = fileList.value.findIndex(r => r.uid === file.uid);
      for (let i = 0; i < fileList.value.length; i++) {
        let item = fileList.value[i];
        _fileList.push({ src: item.fileUrl ? item.fileUrl : item.url, fileName: item.name });
      }
      szdFileView({ fileList: _fileList, fileIndex: fileIndex });
    } else if (props.previewType === "C") {
      const fileIndex = fileList.value.findIndex(r => r.uid === file.uid);
      emit("preview", { fileList: fileList.value, fileIndex: fileIndex });
    }
  };

  //显示文件图标
  const handleShowIcon = fileName => {
    const _lastIndex = fileName.lastIndexOf(".");
    if (_lastIndex === -1) return fileTypeIcon["obj"];
    const ext = fileName.substring(_lastIndex + 1).toLowerCase();
    return ext && fileTypeIcon[ext] ? fileTypeIcon[ext] : fileTypeIcon["obj"];
  };

  //初始化上传参数
  const initUploadParam = () => {
    initData();
    //上传数据参数
    if (!props.fileCate) $m("CORE_CLIENT.E079", ["fileCate"]); //上传地址参数不能为空
    //文件数量
    uploadParams.value.limit = props.limit && props.limit > 0 ? props.limit : props.limit === 0 ? 0 : 100;
    uploadParams.value.multiple = uploadParams.value.limit !== 1;
    //文件大小
    if (props.fileSize && props.fileSize > 0) {
      uploadParams.value.fileSizeBt = props.fileSize * 1024;
      uploadParams.value.fileSizeKb = props.fileSize;
    }
    //文件类型和后缀
    if (props.accept) {
      uploadParams.value.accept = props.accept;
      uploadParams.value.acceptTxt = $t("提示：仅允许导入") + uploadParams.value.accept + $t("格式文件！");
    }
    if (props.acceptTxt) uploadParams.value.acceptTxt = props.acceptTxt;
    if (props.extensions && Array.isArray(props.extensions)) {
      for (let i = 0; i < props.extensions.length; i++) {
        if (props.extensions[i]) {
          let _ext = props.extensions[i].toString().trim().toLowerCase();
          if (_ext && _ext.startsWith(".")) _ext = _ext.substring(1);
          if (_ext && !uploadParams.value.extensions.includes(_ext)) uploadParams.value.extensions.push(_ext);
        }
      }
    }
    //文件尺寸[宽-最小，宽-最大，高-最小，高-最大]
    if (props.dimension && Array.isArray(props.dimension) && props.dimension.length === 4) {
      uploadParams.value.dimension = props.dimension;
    }
    // 压缩图片
    if (props.compress && _.isObject(props.compress) && props.compress.compress === true) {
      if (props.compress.compress) uploadParams.value.compress.compress = props.compress.compress;
      if (props.compress.fileSize && props.compress.fileSize > 0) uploadParams.value.compress.fileSizeKb = props.compress.fileSize;
      uploadParams.value.compress.fileSizeBt = uploadParams.value.compress.fileSizeKb * 1024;
      if (props.compress.quality && props.compress.quality > 0 && props.compress.quality < 1) {
        uploadParams.value.compress.quality = props.compress.quality;
      }
      if (props.compress.widthMax && props.compress.widthMax > 0) uploadParams.value.compress.widthMax = props.compress.widthMax;
      if (props.compress.widthMin && props.compress.widthMin > 0) uploadParams.value.compress.widthMin = props.compress.widthMin;
    }
  };

  //初始化数据
  const initData = () => {
    uploadParams.value = {
      uploadUrl: "/core/file/uploadView",
      limit: 100, //最大上传文件数
      multiple: false, //是否支持多文件
      fileSizeBt: undefined, //文件大小
      fileSizeKb: "",
      accept: "", //上传文件类型 ".xls,.xlsx"
      acceptTxt: "", //提示信息
      extensions: [], //文件后缀
      dimension: [], //尺寸[宽-最小，宽-最大，高-最小，高-最大]
      compress: {
        compress: false, //是否压缩
        fileSizeBt: 0,
        fileSizeKb: 1024, //超过多大进行压缩KB
        quality: 0.8, //压缩质量
        widthMax: 1600, //压缩最大宽度
        widthMin: 100 //压缩最小宽度
      }
    };
  };

  //更新文件数量
  const updateFileCount = () => {
    emit("update:fileCount", getFileCount());
  };

  //获取文件数量-未删除
  const getFileCount = () => {
    let _count = 0;
    if (fileList.value) {
      for (let i = 0; i < fileList.value.length; i++) {
        if (fileList.value[i].fileDel !== true) _count++;
      }
    }
    return _count;
  };

  //获取文件列表
  const getFileList = () => {
    return fileList.value ? fileList.value : [];
  };

  defineExpose({
    getFileCount,
    getFileList
  });
</script>

<style lang="scss" scoped>
  .l-upload-container-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;

    .l-uploader__file {
      position: relative;
      margin: var(--uploader-file-margin);
      border-radius: var(--uploader-file-border-radius);
      overflow: hidden;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      box-shadow: 0 3px 1px -2px var(--shadow-key-umbra-opacity), 0 2px 2px 0 var(--shadow-key-penumbra-opacity),
        0 1px 5px 0 var(--shadow-key-ambient-opacity);
      padding: 1px;
    }

    .l-img-del {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 12px;
      padding: 0 3px;
      background: var(--uploader-action-background);
      color: #606266;
    }

    .l-uploader__file-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .l-uploader__file-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .l-uploader__file-but {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1;

      .l-upload-tap {
        color: #ff9d00;
        text-align: center;
        padding: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 1;
        word-break: break-all;
      }
    }

    :deep(.var-uploader__file-list) {
      justify-content: center;
    }

    .l-uploader__upload {
      position: relative;
      flex: 0 0 auto;
      margin: var(--uploader-file-margin);
    }

    .l-upload-style-card {
      display: block;
      width: 100%;
      height: 100%;
      line-height: 0;

      :deep(.var-uploader--outline-none) {
        display: block;
        width: 100%;
        height: 100%;
      }

      :deep(.var-uploader__action) {
        margin: unset;
      }
    }
  }

  .l-upload-container-text {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: var(--font-size);
    color: var(--button-default-text-color);

    .l-upload-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      border: 1px solid #dcdcdc;
      border-radius: var(--button-border-radius);
      background-color: var(--button-default-color);
      padding: 2px 0;

      .l-upload-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--button-primary-color);
      }

      .l-upload-tap {
        color: #ff9d00;
        text-align: center;
        padding: 0 5px;
        font-size: 14px;
      }
    }

    .l-file-info {
      position: relative;
      display: inline-flex;
      margin-top: 5px;
      padding: 5px 0;
      align-items: center;
      word-break: break-all;
      line-height: 1.2;
      border-bottom: 1px solid #dcdcdc;

      .l-text-info {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .l-text-icon {
        width: 35px;
        padding-left: 10px;
        color: #397bfe;
      }

      .l-text-info-picture {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 85%;
        line-height: 1.8;
        padding-left: 5px;
      }
    }

    .l-text-del-line {
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }

    :deep(.var-uploader--outline-none) {
      width: 100%;
    }
  }

  .l-progress-percentage {
    position: absolute;
    bottom: 0;
    border-radius: 2px;
    width: 100%;
  }

  .l-upload-style {
    width: auto;

    :deep(.var-form-details) {
      display: none;
    }
  }
</style>
