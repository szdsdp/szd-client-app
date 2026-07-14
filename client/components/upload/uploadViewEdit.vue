<template>
  <var-dialog
    :title="dg.title"
    v-model:show="dg.open"
    :close-on-click-overlay="false"
    @close="closeForm"
    :confirm-button="false"
    :cancel-button="false">
    <template #title>
      <szd-dialog-title :title="dg.title" v-model="dg.open" @close="handleCloseForm" />
    </template>

    <div class="szd__popup__main" style="padding: 5px 0; max-height: 75vh">
      <szd-card-a>
        <template #main>
          <szd-input v-model="dataObj.fileName" label="文件名称" :disabled="dataObj.fileDel" :maxlength="64" required />
          <szd-checkbox v-model="dataObj.fileDel" boxLabel="删除" disabled />
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button v-if="dataObj.fileDel" label="撤回删除" type="primary" @click="handleSave(false)" />
        <szd-button v-if="!dataObj.fileDel" label="删除" type="primary" @click="handleSave(true)" />
        <szd-button v-if="!dataObj.fileDel" label="保存" type="primary" @click="handleSave(false)" />
        <szd-button label="取消" type="primary" @click="handleCloseForm" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { ref } from "vue";
  import szdFile from "../../common/tools/fileTool";
  import { szdPopDel } from "../../common/message/popup";

  const dataObj = ref({
    fileObjId: "",
    fileId: "",
    fileName: "",
    fileExt: "",
    fileDel: false
  });

  const emit = defineEmits(["updFile"]);

  //窗口对象
  const dg = ref({
    open: false
  });

  const callUploadViewEdit = file => {
    dataObj.value.fileObjId = file.fileObjId;
    dataObj.value.fileId = file.fileId;
    dataObj.value.fileName = file.name;
    dataObj.value.fileExt = szdFile.getFileExtension(file.name);
    dataObj.value.fileDel = file.fileDel === true;
    dg.value.open = true;
  };

  //保存数据
  const handleSave = fileDel => {
    if (fileDel) {
      szdPopDel("文件将被删除，请确认？").then(() => {
        processSave(fileDel);
      });
    } else {
      processSave(fileDel);
    }
  };

  const processSave = fileDel => {
    let ext = szdFile.getFileExtension(dataObj.value.fileName);
    if (ext !== dataObj.value.fileExt) {
      dataObj.value.fileName = dataObj.value.fileName + "." + dataObj.value.fileExt;
    }
    dataObj.value.fileDel = fileDel;
    emit("updFile", dataObj.value);
    dg.value.open = false;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //定义调用组件
  defineExpose({
    callUploadViewEdit
  });
</script>