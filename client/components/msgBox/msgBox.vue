<template>
  <var-dialog :title="'消息提示'" v-model:show="dg.open" close-on-click-overlay @close="handleClose" :confirm-button="false" :cancel-button="false">
    <template #title>
      <szd-dialog-title title="消息提示" v-model="dg.open" @close="handleCloseForm" />
    </template>

    <div class="szd__popup__main" style="padding: 5px 0; max-height: 75vh">
     <szd-card-a v-for="row in msg">
        <!--  表头   -->
        <template #header>
          <div class="header">
            <div style="padding-right: 3px">
              <szd-light :light="row.light" />
            </div>
            <div>{{ $t("消息码") }} : {{ row.retCode }}</div>
          </div>
        </template>
        <!--  内容 -->
        <template #main>
          <div class="div-text">{{ row.retMsg }}</div>
        </template>
      </szd-card-a>
    </div>

    <template #actions>
      <div v-if="okayFlag" class="main-dialog-footer">
        <szd-button label="确认" type="primary" @click="okayForm" />
        <szd-button label="取消" type="primary" @click="handleCloseForm" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);

  const props = defineProps({
    msg: {
      type: Array,
      default: []
    },
    okayFlag: {
      type: Boolean,
      default: false
    }
  });

  //功能参数
  const dg = ref({
    open: false
  });

  onMounted(() => {
    dg.value.open = true;
  });

  //数据确定
  const okayForm = () => {
    emit("okay");
    dg.value.open = false;
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emit("closeForm");
  };
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    align-items: center;
  }

  .div-text {
    display: flex;
    align-items: center;
    width: 100%;
    color: var(--field-decorator-text-color);
    min-height: 24px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }
</style>