<template>
  <!-- 同意、后加签、驳回、作废页面 -->
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
          <szd-textarea label="审批意见" v-model="form.comments" :maxlength="150" :rows="3" clearable required />
          <szd-select label="常用语" v-model="form.dailyItem" baseField="CORE_WF_DALY" @change="changeComments" helpTip="CORE_WF_APPR.CORE_WF_DALY" />
          <szd-select
            v-if="dg.wfRejectReasonFlag && (form.operate === 'btn_reject' || form.operate === 'btn_delete')"
            label="操作原因"
            v-model="form.operateReason"
            baseField="CORE_WF_OPRE"
            required />
          <szd-radio
            v-if="form.operate === 'btn_reject' && dg.rejectAct"
            label="驳回方式"
            v-model="form.rejectToFlag"
            :baseArr="
              !form.bussId
                ? [
                    { svalue: 'A', sname: $t('拒绝节点') },
                    { svalue: 'B', sname: $t('发起人') }
                  ]
                : [
                    { svalue: 'A', sname: $t('拒绝节点') },
                    { svalue: 'B', sname: $t('发起人') },
                    { svalue: 'C', sname: $t('指定节点') }
                  ]
            " />
          <szd-input
            v-if="form.rejectToFlag === 'C'"
            label="指定驳回节点"
            v-model="form.rejectToNodeName"
            showHelp
            :help="{ a: 'CORE_WF_REJECT_TO', b: form, c: ['rejectToNodeCode-instId', 'rejectToNodeName-nodeName'], d: [['bussId', form.bussId]] }"
            readonly
            clearable />
          <szd-input
            v-if="form.operate === 'btn_postAddSign'"
            v-model="form.addUserId"
            label="加签"
            showHelp
            :help="{ a: 'CORE_USER', b: form, c: ['addUserId-userId', 'addUserName-userName'] }"
            readonly
            clearable
            :desc="form.addUserName" />
          <szd-input
            label="@用户ID"
            v-model="form.noticeUserIds"
            showHelp
            :help="{ a: 'CORE_USER', b: form, c: ['noticeUserIds-userId', 'noticeUserNames-userName'], f: 5, i: 'noticeUserIds-userId' }"
            readonly
            clearable
            @change="handleChangeNoticeUserIds" />
          <szd-input label="@用户姓名" v-model="form.noticeUserNames" disabled />
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="确定并关闭" type="primary" @click="okayForm(true)" />
        <szd-button label="确定" type="primary" @click="okayForm(false)" />
        <szd-button label="取消" type="primary" @click="closeForm" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { nextTick, ref } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  //更新数据对象
  const emit = defineEmits(["okaySubmit"]);
  //功能参数
  const dg = ref({
    title: $t("审批意见"),
    open: false,
    wfRejectReasonFlag: false,
    rejectAct: false
  });
  //表单参数
  const form = ref({
    operate: "", //操作事件
    operateOkayClose: false, //确认并关闭
    bussId: "", //单据ID
    comments: "", //审批意见
    noticeUserIds: "", //@用户ID
    noticeUserNames: "", //@用户姓名
    addUserId: "", //加签ID
    addUserName: "", //加签姓名
    dailyItem: "", //日常用语
    operateReason: "", //操作原因
    operateReasonName: "",
    rejectToFlag: "A", //驳回方式
    rejectToNodeCode: "", //驳回节点
    rejectToNodeName: ""
  });

  //接受并处理
  const callWfDgAppr = (operate, btnParam = {}, bussId = "", wfRejectReasonFlag = false) => {
    initData();
    form.value.operate = operate;
    form.value.bussId = bussId;
    dg.value.wfRejectReasonFlag = wfRejectReasonFlag === true;
    dg.value.rejectAct = btnParam.rejectAct === true;
    if (btnParam && btnParam.comments) {
      form.value.comments = btnParam.comments;
    }
    if (btnParam && btnParam.closeDg) {
      emit("okaySubmit", form.value);
    } else {
      dg.value.open = true;
    }
  };

  //确定
  const okayForm = operateOkayClose => {
    if (checkOkayForm()) {
      form.value.operateOkayClose = operateOkayClose;
      emit("okaySubmit", form.value);
      dg.value.open = false;
    }
  };

  // 检查提交数据
  const checkOkayForm = () => {
    if (!form.value.comments || form.value.comments.trim() === "") {
      $m("CORE_CLIENT.E106"); //审批意见不能为空
      return false;
    }
    if (form.value.rejectToFlag === "C" && !form.value.rejectToNodeCode) {
      $m("CORE_CLIENT.E115"); //驳回节点不能为空
      return false;
    }
    if (form.value.operate === "btn_postAddSign") {
      if (!form.value.addUserId || form.value.addUserId.trim() === "") {
        $m("CORE_CLIENT.E107"); //加签用户不能为空
        return false;
      }
    }
    if (dg.value.wfRejectReasonFlag && (form.value.operate === "btn_reject" || form.value.operate === "btn_delete")) {
      if (!form.value.operateReason || form.value.operateReason.trim() === "") {
        $m("CORE_CLIENT.E116"); //操作原因不能为空
        return false;
      }
    }
    return true;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //常用语赋值审批意见
  const changeComments = (v, res) => {
    if (res.sname) {
      form.value.comments = form.value.comments + res.sname;
    }
    form.value.dailyItem = "";
  };

  const handleChangeNoticeUserIds = () => {
    nextTick(() => {
      if (!form.value.noticeUserIds) form.value.noticeUserNames = "";
    });
  };

  //初始化数据
  const initData = () => {
    form.value = {
      operate: "", //操作事件
      operateOkayClose: false, //确认并关闭
      bussId: "", //单据ID
      comments: "", //审批意见
      noticeUserIds: "", //@用户ID
      noticeUserNames: "", //@用户姓名
      addUserId: "", //加签ID
      addUserName: "", //加签姓名
      dailyItem: "", //日常用语
      operateReason: "", //操作原因
      operateReasonName: "",
      rejectToFlag: "A", //驳回方式
      rejectToNodeCode: "", //驳回节点
      rejectToNodeName: ""
    };
  };

  //定义父组件可用方法
  defineExpose({
    callWfDgAppr
  });
</script>