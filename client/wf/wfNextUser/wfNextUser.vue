<template>
  <!-- 审批未找到用户，选择用户 -->
  <var-dialog
    :title="dg.title + dg.nodeName"
    v-model:show="dg.open"
    :close-on-click-overlay="false"
    @close="handleClose"
    :confirm-button="false"
    :cancel-button="false">
    <template #title>
      <szd-dialog-title :title="dg.title + dg.nodeName" v-model="dg.open" @close="handleCloseForm" />
    </template>

    <div class="szd__popup__main" style="padding: 5px 0; max-height: 75vh">
      <szd-card-a>
        <template #main>
          <szd-input
            v-model="form.nextUserId"
            label="用户"
            showHelp
            :help="{ a: 'CORE_USER', b: form, c: ['nextUserId-userId', 'nextUserName-userName'] }"
            readonly
            required
            :desc="form.nextUserName" />
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="确定" type="primary" @click="okayForm" />
        <szd-button label="取消" type="primary" @click="closeForm" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";

  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);

  const props = defineProps({
    wfParam: {
      type: Object
    }
  });

  //功能参数
  const dg = ref({
    title: "用户选择 下一审批节点",
    open: false,
    nodeName: ""
  });

  //用户选择
  const form = ref({
    nextUserId: "",
    nextUserName: ""
  });

  onMounted(() => {
    initData();
  });

  //初始化数据
  const initData = () => {
    form.value = {
      nextUserId: "",
      nextUserName: ""
    };
    dg.value.title = $t("用户选择 下一审批节点");
    dg.value.nodeName = "";
    if (props.wfParam.wfResult && props.wfParam.wfResult.nextWfInst) {
      dg.value.nodeName = ":" + props.wfParam.wfResult.nextWfInst.nodeId + "_" + props.wfParam.wfResult.nextWfInst.nodeName;
    }
    dg.value.open = true;
  };

  //数据确定
  const okayForm = () => {
    if (!form.value.nextUserId || form.value.nextUserId.trim() === "") {
      $m("CORE_CLIENT.E108"); //用户不能为空
      return;
    }
    emit("okay", { nextUserId: form.value.nextUserId, nextUserName: form.value.nextUserName });
    dg.value.open = false;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const closeForm = () => {
    dg.value.open = false;
  };

  //取消
  const handleClose = () => {
    emit("closeForm");
  };
</script>