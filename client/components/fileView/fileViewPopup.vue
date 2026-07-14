<template>
  <var-popup
    v-model:show="dg.open"
    @close="handleClose"
    style="display: flex; align-items: center; height: 100vh; width: 100%; overflow: hidden; background-color: #2b2b2d">
    <!-- 回退按钮 -->
    <szd-top-back @click="handleCloseForm" />
    <!-- 下载按钮 -->
    <div class="l-top-download">
      <var-icon v-if="download" name="download" size="40" @click="handleDownload" />
    </div>
    <!-- 走马灯 -->
    <var-swipe
      v-if="fileList.length > 1"
      :initial-index="dg.index"
      trigger="click"
      :loop="false"
      :indicator="false"
      navigation
      @change="handleChangeCarousel"
      class="l-var-swipe">
      <var-swipe-item v-for="(item, index) in fileList" :key="'item_' + index">
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
          <szd-file-view v-if="item.src" :src="item.src" :fileName="item.fileName" :key="'file_' + index" />
        </div>
      </var-swipe-item>
    </var-swipe>
    <!-- 单个文件 -->
    <szd-file-view v-else :src="_fileObj.src" :fileName="_fileObj.fileName" />
  </var-popup>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import szdFile from "../../common/tools/fileTool";
  //定义事件
  const emit = defineEmits(["closeForm"]);

  const props = defineProps({
    fileList: {
      type: Array
    },
    fileIndex: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: "查看文件"
    },
    download: {
      type: Boolean,
      default: true
    }
  });

  //功能参数
  const dg = ref({
    open: false,
    title: "查看文件",
    index: 0
  });
  const _fileList = ref([]);
  const _fileObj = ref();

  onMounted(() => {
    setFileList();
    dg.value.open = true;
    dg.value.title = props.title || "查看文件";
  });

  //设置文件列表
  const setFileList = () => {
    _fileList.value = [];
    for (let i = 0; i < props.fileList.length; i++) {
      const item = props.fileList[i];
      _fileList.value.push({ src: item.src, fileName: item.fileName });
    }
    handleChangeCarousel(props.fileIndex, 0);
  };

  //当前显示的文件
  const handleChangeCarousel = (current, prev) => {
    dg.value.index = current;
    _fileObj.value = { src: "", fileName: "" };
    if (dg.value.index < 0) dg.value.index = 0;
    if (dg.value.index >= props.fileList.length) dg.value.index = _fileList.value.length - 1;
    _fileObj.value = _fileList.value[dg.value.index];
  };

  //下载文件
  const handleDownload = () => {
    szdFile.downloadFile(_fileObj.value.src, _fileObj.value.fileName);
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emit("closeForm");
  };
</script>

<style scoped lang="scss">
  .l-top-download {
    position: absolute;
    z-index: 3000;
    top: 40px;
    left: 95px;
    border-radius: 50%;
    color: #ffffff;
    background: #397bfe;
  }

  .l-var-swipe {
    width: 100%;
    height: 100%;
  }
</style>