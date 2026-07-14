<template>
  <var-dialog
    :title="dg.title"
    v-model:show="dg.open"
    :close-on-click-overlay="false"
    @close="handleCloseForm"
    :confirm-button="false"
    :cancel-button="false">
    <template #title>
      <szd-dialog-title :title="dg.title" v-model="dg.open" @close="handleCloseForm" />
    </template>

    <div class="szd__popup__main" style="padding: 5px 0; max-height: 75vh">
      <szd-card-a>
        <template #main>
          <szd-input label="文件ID" v-model="objData.fileId" disabled />
          <szd-textarea label="文件名称" v-model="objData.fileName" :maxlength="50" disabled :rows="2" />
          <szd-textarea label="备注" v-model="objData.remark" :maxlength="150" :rows="2" />
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="保存" type="primary" @click="submitForm" />
        <szd-button label="取消" type="primary" @click="closeForm" />
      </div>
    </template>
  </var-dialog>
</template>
<script>
  import { updApiFile } from "../api/eatt.js";

  export default {
    data() {
      return {
        dg: {
          title: this.$t("修改备注"),
          open: false,
          retCode: "" //返回码，S成功(刷新) Q或空取消操作 E 操作错误
        },
        objData: {
          eisId: "",
          fileId: "",
          fileName: "",
          remark: ""
        }
      };
    },
    methods: {
      //接受参数
      acceptData(infoParam) {
        this.dg.open = true;
        this.objData.eisId = infoParam.eisId;
        this.objData.fileId = infoParam.fileId;
        this.objData.fileName = infoParam.fileName;
        this.objData.remark = infoParam.remark;
        this.dg.retCode = "";
      },
      //保存数据
      submitForm() {
        updApiFile(this.objData).then(response => {
          if (response.code === 200) {
            this.$mS("修改数据成功");
            this.dg.retCode = "S";
            this.closeForm();
          }
        });
      },
      //关闭窗口
      closeForm() {
        this.dg.open = false;
      },
      handleCloseForm() {
        this.$emit("updResult", this.dg);
      }
    }
  };
</script>