<template>
  <div class="szd__tb__wrapper">
    <div class="szd__popup__main" style="padding: 5px 0">
      <szd-card-a v-for="row in props.objData.meetingList">
        <!--  内容 -->
        <template #main>
          <span class="card-text-row">
            <div class="title">{{ $t("发起人") }}:</div>
            <div class="content">{{ row.header.userName }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("发起节点") }}:</div>
            <div class="content">{{ row.header.nodeName }}</div>
          </span>
          <span class="card-text-row" style="align-items: center">
            <div class="title">{{ $t("人员") }}:</div>
            <div class="content">
              <div v-for="item in row.userList" class="row">
                {{ item.userId + "." + item.userName + "(" + item.cmpyName + "|" + item.cstcName + ") " }}
              </div>
            </div>
          </span>
        </template>
        <!-- 表尾 -->
        <template #footer>
          <szd-button label="消息" type="primary" @click="handleMore(row.header)" />
        </template>
      </szd-card-a>
    </div>

    <wfApprInfoTab2More ref="refWfApprInfoTab2More" :fileTypeIcon="fileTypeIcon" />
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import store from "@/store";
  import szdFile from "../../../common/tools/fileTool";
  import { $t } from "../../../common/utils/globalConfig";
  import wfApprInfoTab2More from "./wfApprInfoTab2More.vue";

  const props = defineProps({
    objData: {
      type: Object
    }
  });
  //子屏幕ref
  const refWfApprInfoTab2More = ref();

  const userId = store.state.loginUser.user.userId;
  //文件图标
  const fileTypeIcon = szdFile.getFileTypeIcon();

  //点击更多
  const handleMore = params => {
    refWfApprInfoTab2More.value.initDataMsgList(params);
  };
</script>
<style scoped lang="scss"></style>