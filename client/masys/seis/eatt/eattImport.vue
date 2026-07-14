<template>
  <div class="l-upload-style">
    <var-uploader
      ref="refUpload"
      :accept="uploadParams.accept"
      :multiple="uploadParams.limit && uploadParams.limit > 1"
      :maxlength="uploadParams.limit"
      :maxsize="uploadParams.fileSize"
      hide-list
      @before-filter="handleBeforeFilter"
      @before-read="handleBeforeRead"
      @after-read="handleAfterRead"
      @oversize="handleOversize"
      style="border-right: 1px solid #ffffff">
      <szd-button :disabled="uploadParams.disabled" label="上传附件" type="primary" @click="handleUploadBtn" />
    </var-uploader>
    <var-progress v-if="dg.progress > 0 && dg.progress <= 100" :value="dg.progress" type="success" />
  </div>
</template>

<script>
  import { requestUploadFile } from "../../../common/utils/requestUpload";

  export default {
    props: ["eisId", "uplParams"],
    data() {
      return {
        dg: {
          retCode: "", //返回码，S成功(刷新) Q或空取消操作 E 操作错误
          eisId: "",
          progress: 0
        },
        uploadParams: {
          accept: "",
          fileSize: undefined, //文件大小
          fileSizeKb: "",
          limit: 2, //最大上传文件数
          disabled: false,
          uploadUrl: "" //上传的地址
        },
        currentFileTask: []
      };
    },
    mounted() {
      this.initDataEattImport();
    },
    methods: {
      //上传参数
      initDataEattImport() {
        this.dg.retCode = "";
        this.dg.eisId = this.eisId;
        this.uploadParams.uploadUrl = "/seis/eatt/api/upload/" + this.dg.eisId;
        if (this.uplParams.accept) {
          this.uploadParams.accept = this.uplParams.accept;
        }
        if (this.uplParams.fileSize) {
          this.uploadParams.fileSize = this.uplParams.fileSize * 1024;
          this.uploadParams.fileSizeKb = this.uplParams.fileSize;
        }
        if (this.uplParams.limit && this.uplParams.limit > 0) {
          this.uploadParams.limit = this.uplParams.limit;
        }
      },
      //清空文件
      handleUploadBtn() {
        this.$refs.refUpload.reset();
        this.dg.progress = 0;
        this.currentFileTask = [];
      },
      //上传检查文件和添加上传文件进度
      handleBeforeFilter(files) {
        if (files.length > 1 && this.uploadParams.limit && this.uploadParams.limit > 1 && files.length > this.uploadParams.limit) {
          this.$mE(`同时选择多文件最多支持${this.uploadParams.limit}个`);
          files = [];
        }
        return files;
      },
      //上传检查文件和添加上传文件进度
      handleBeforeRead(file) {
        const fileType = file.name.split(".").pop();
        if (this.uploadParams.accept) {
          if (this.uploadParams.accept.indexOf("." + fileType) === -1) {
            this.$mW("不支持的文件类型");
            return false;
          }
        }
        if (this.uploadParams.fileSize) {
          const fileSize = Number(file.size);
          if (fileSize > this.uploadParams.fileSize) {
            this.$m("CORE_CLIENT.E029", this.uploadParams.fileSizeKb); //上传文件大小不能大于 & KB
            return false;
          }
        }
        return true;
      },
      //文件读取
      handleAfterRead(file) {
        this.uploadParams.disabled = true;
        //记录文件上传进度
        this.currentFileTask.push({ name: file.name, percent: 0 });
        //上传文件
        const formData = new FormData();
        formData.append("file", file.file, file.name); // 文件对象 + 文件名
        requestUploadFile(this.uploadParams.uploadUrl, formData, progress => this.handleUploadProgress(progress, file))
          .then(response => {
            this.currentFileTaskDel(file);
            if (response.code === 200) {
              this.dg.retCode = "S";
              this.$mS(response.msg);
              this.$emit("updResult", this.dg);
            } else {
              this.$mE(response.msg);
            }
          })
          .catch(err => {
            this.currentFileTaskDel(file);
            this.$mE(`上传文件失败${file.name}`);
            console.error("上传失败：", err);
          });
      },
      //进度处理
      handleUploadProgress(progress, file) {
        let uplFile = this.currentFileTask.find(r => r.name === file.name);
        if (uplFile) uplFile.percent = progress.percent;
        let _percentSum = 0;
        for (let i = 0; i < this.currentFileTask.length; i++) {
          _percentSum = _percentSum + this.currentFileTask[i].percent;
        }
        this.dg.progress = Math.round(_percentSum / this.currentFileTask.length);
      },
      //删除临时添加的上传文件-用于显示上传进度
      currentFileTaskDel(file) {
        let _index = this.currentFileTask.findIndex(r => r.name === file.name);
        if (_index !== -1) this.currentFileTask.splice(_index, 1);
        if (this.currentFileTask.length === 0) {
          this.uploadParams.disabled = false;
          this.dg.progress = 0;
        }
      },
      //文件查过允许范围触发
      handleOversize() {
        this.$m("CORE_CLIENT.E029", this.uploadParams.fileSizeKb); //上传文件大小不能大于 & KB
      }
    }
  };
</script>
<style scoped lang="scss">
  .l-upload-style {
    :deep(.var-form-details) {
      display: none;
    }

    :deep(.var-button) {
      border-radius: 0;
    }
  }
</style>