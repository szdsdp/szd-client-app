<template>
  <var-popup
    v-model:show="dg.open"
    position="bottom"
    close-on-click-overlay
    class="szd__popup__wrapper_h"
    :teleport="false"
    style="height: 80vh"
    @close="closeForm">
    <!-- 功能按钮 -->
    <div class="szd__popup__top">
      <var-button-group>
        <eattImport v-if="objData.szdopt === 'U'" ref="eattImport" :eisId="eisId" :uplParams="uplParams" @updResult="updResult" />
        <szd-button label="关闭" type="primary" @click="handleCloseForm" />
      </var-button-group>
    </div>

    <!-- 表格输出 -->
    <div class="szd__popup__main">
      <szd-card-a v-for="row in objData.fileList" :header="false">
        <template #main>
          <span class="card-text-row">
            <div class="title">{{ $t("文件ID") }}:</div>
            <div class="content">{{ row.fileId }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("文件名称") }}:</div>
            <div class="content">{{ row.fileName }}</div>
          </span>
          <span v-if="row.delFlag === '0'" class="card-text-row">
            <div class="title">{{ $t("删除标记") }}:</div>
            <div class="content">{{ row.delFlagName }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("备注") }}:</div>
            <div class="content">{{ row.remark }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("创建人") }}:</div>
            <div class="content">{{ row.createByName }} | {{ row.createTime }}</div>
          </span>
        </template>
        <!-- 表尾 -->
        <template #footer>
          <szd-button v-if="objData.szdopt === 'U'" label="删除" type="primary" @click="handleDelRow(row)" />
          <szd-button v-if="objData.szdopt === 'U'" label="修改" type="primary" @click="handleUpdRow(row)" />
          <szd-button v-if="row.$fileExtType" label="查看" type="primary" @click="handleViewRow(row)" />
        </template>
      </szd-card-a>
    </div>
    <!-- 批导/更新 -->
    <eattRemark ref="eattRemark" @updResult="updResult" />
  </var-popup>
</template>

<script>
  import { getApiEatt, delApiFile } from "../api/eatt.js";
  import eattImport from "./eattImport.vue";
  import eattRemark from "./eattRemark.vue";

  export default {
    props: ["eisId", "szdopt", "uplParams"],
    components: {
      eattImport,
      eattRemark
    },
    data() {
      return {
        //参数
        dg: {
          open: false,
          eisId: "",
          szdopt: "" //权限标识
        },
        objData: {
          header: {},
          fileList: [],
          szdopt: "" //权限标识
        },
        //列表多选
        listSel: []
      };
    },
    created() {
      //获取参数
      this.dg.eisId = this.eisId;
      this.dg.szdopt = this.szdopt;
    },
    mounted() {
      if (this.dg.eisId) {
        this.getApiEattInfo();
      } else {
        this.$mE("附件ID不能为空");
        this.$emit("closeForm");
      }
    },
    methods: {
      //获取后端数据
      getApiEattInfo() {
        getApiEatt(this.dg.eisId, this.dg.szdopt).then(response => {
          if (response.code === 200) {
            this.dg.open = true;
            this.objData = response.data;
            for (let i = 0; i < this.objData.fileList.length; i++) {
              let item = this.objData.fileList[i];
              item["$fileExtType"] = this.szdFile.getFileViewType(item.url);
            }
          } else {
            this.$emit("closeForm");
          }
        });
      },
      //查看
      handleViewRow(row) {
        this.szdFileView({ src: row.url });
      },
      //更改文件备注
      handleUpdRow(row) {
        let json = {
          eisId: this.dg.eisId,
          fileId: row.fileId,
          fileName: row.fileName,
          remark: row.remark
        };
        this.$refs.eattRemark.acceptData(json);
      },
      // 处理返回结果
      updResult(resultData) {
        if (resultData.retCode === "S") {
          this.getApiEattInfo();
        }
      },
      //单行删除
      handleDelRow(row) {
        let idArr = [];
        idArr.push(row.fileId);
        this.deletePross(idArr);
      },
      //删除处理
      deletePross(idArr) {
        this.szdPopDel().then(() => {
          let json = {
            eisId: this.dg.eisId,
            fileIds: idArr
          };
          delApiFile(json).then(res => {
            if (res.code === 200) {
              this.getApiEattInfo();
              this.$mS("删除成功");
            }
          });
        });
      },
      //关闭
      handleCloseForm() {
        this.dg.open = false;
      },
      closeForm() {
        this.dg.open = false;
        this.$emit("closeForm");
      }
    }
  };
</script>