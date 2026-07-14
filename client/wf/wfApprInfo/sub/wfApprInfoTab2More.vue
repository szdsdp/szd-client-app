<template>
  <var-popup v-model:show="dg.open" close-on-click-overlay :teleport="false" class="szd__tb__wrapper">
    <!-- 回退按钮 -->
    <szd-top-back @click="closeForm" />
    <!-- 消息 -->
    <div class="szd__popup__main wf-appr">
      <div v-for="(item, index) in msgList" :key="index" :class="['msg', item.userId === userId ? 'align-right' : '']">
        <!--  人员信息 userId===item.userId -->
        <div class="msg-title">{{ item.userName }} | {{ item.createTime }}</div>
        <!--  消息内容  -->
        <div class="msg-content">
          <!-- 文件消息-附件 -->
          <div v-if="item.fileUrl" class="msg-content-file">
            <!--  图标和名称 -->
            <div class="msg-content-file-img" @click="preFile(item.fileUrl)">
              <var-image v-if="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(item.fileType)" :src="item.fileUrl" class="file-img" />
              <img v-else :src="item.fileType && fileTypeIcon[item.fileType] ? fileTypeIcon[item.fileType] : fileTypeIcon['obj']" class="file-img" />
              <div class="file-name">{{ item.fileName }}</div>
            </div>
            <!-- 按钮 -->
            <div class="msg-content-file-btns">
              <szd-button label="查看" type="primary" link @click="preFile(item.fileUrl)" />
            </div>
          </div>
          <!-- 文件消息-文字 -->
          <span v-else class="msg-content-text">{{ item.message }}</span>
        </div>
      </div>
    </div>
  </var-popup>
</template>

<script setup>
  import "../css/wfApprInfoTab2.scss";
  import { ref } from "vue";
  import store from "@/store";
  import { wfMsgList } from "../../api/wfApi.js";
  import { szdFileView } from "../../../components/fileView/fileView";

  const props = defineProps({
    fileTypeIcon: {
      type: Object
    }
  });
  //窗口对象
  const dg = ref({
    open: false,
    bussId: "",
    nodeDoc: ""
  });
  const userId = store.state.loginUser.user.userId;
  //数据对象
  const msgList = ref([]);

  //接受数据
  const initDataMsgList = params => {
    msgList.value = [];
    dg.value.bussId = params.bussId;
    dg.value.nodeDoc = params.nodeDoc;
    getData();
  };
  //获取后台参数
  const getData = () => {
    wfMsgList(dg.value.bussId, dg.value.nodeDoc).then(res => {
      msgList.value = res.data;
      dg.value.open = true;
    });
  };

  //预览文件
  const preFile = url => {
    szdFileView({ src: url });
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    initDataMsgList
  });
</script>