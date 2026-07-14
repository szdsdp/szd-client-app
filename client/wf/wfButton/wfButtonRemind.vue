<template>
  <!-- 选择用户 -->
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
          <szd-textarea label="催办消息" v-model="form.comments" :maxlength="150" :rows="3" clearable />
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
  import { ref } from "vue";
  import {$m, $mE, $mS, $t} from "../../common/utils/globalConfig";
  import { wfRemind } from "../api/wfApi";
  //功能参数
  const dg = ref({
    title: $t("任务催办"),
    open: false
  });
  //表单参数
  const form = ref({
    operate: "", //操作事件
    bussId: "", //业务ID
    comments: "", //催办消息
  });

  //接受并处理
  const callWfDgRemind = (operate, bussId) => {
    initData();
    dg.value.open = true;
    form.value.operate = operate;
    form.value.bussId = bussId;
  };

  //确定
  const okayForm = () => {
    wfRemind(form.value).then(res => {
      if (res.code === 200) {
        $mS("催办成功");
        dg.value.open = false;
      } else {
        $mE("催办失败:" + res.msg);
      }
    });
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
      bussId: "", //业务ID
      comments: "", //转办意见
    };
  };

  //定义父组件可用方法
  defineExpose({
    callWfDgRemind
  });
</script>