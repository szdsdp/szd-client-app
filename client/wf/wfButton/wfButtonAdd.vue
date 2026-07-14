<template>
  <!-- 加签选择用户 -->
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
          <szd-input
            v-model="form.addUserId"
            label="用户"
            showHelp
            :help="{ a: 'CORE_USER', b: form, c: ['addUserId-userId', 'addUserName-userName'] }"
            readonly
            :desc="form.addUserName" />
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
  import { ref } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  //更新数据对象
  const emit = defineEmits(["okaySubmit"]);
  //功能参数
  const dg = ref({
    title: $t("用户选择"),
    open: false
  });
  //表单参数
  const form = ref({
    operate: "", //操作事件
    operateOkayClose: false, //确认并关闭
    addUserId: "", //前加签ID
    addUserName: "" //前加签姓名
  });

  //接受并处理
  const callWfDgAdd = operate => {
    initData();
    dg.value.open = true;
    form.value.operate = operate;
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
    if (!form.value.addUserId || form.value.addUserId.trim() === "") {
      $m("CORE_CLIENT.E108"); //用户不能为空
      return false;
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

  //初始化数据
  const initData = () => {
    form.value = {
      operate: "", //操作事件
      operateOkayClose: false, //确认并关闭
      addUserId: "", //前加签ID
      addUserName: "" //前加签姓名
    };
  };

  //定义父组件可用方法
  defineExpose({
    callWfDgAdd
  });
</script>