<template>
  <div v-if="_objData.invFol && _objData.invFol.length > 0" class="c-checkbox-all">
    <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" @change="handleChangeCheckAll">
      {{ $t("全选") }}
    </var-checkbox>
  </div>

  <!-- 表体 -->
  <template v-for="(row, index) in _objData.invFol">
    <szd-card-a :footer="false">
      <!--  表头   -->
      <template #header>
        <div class="c-head">
          <div class="ck-box">
            <var-checkbox v-model="row.$SZDCHECKBOX" @change="handleChangeCheckRow" />
          </div>
          <div class="title">
            <span>{{ row.invNo }} ; {{ row.invAmt }}</span>
          </div>
          <div class="view-but">
            <var-icon name="chevron-right" style="font-size: 24px" @click="handleClickRowView(index)" />
          </div>
        </div>
      </template>

      <!--  内容 -->
      <template #main>
        <span>
          <szd-input
            placeholder="业务小类"
            v-model="row.bsub"
            showHelp
            :help="{ a: 'CORE_BSUB01', b: row, c: ['bsub', 'bsubName'], d: [['bstp', props.bussBase.bstp]] }"
            :desc="row.bsubName" />
        </span>
        <szd-card-row-span label="票据类型" :text="row.invTypeName" />
        <szd-card-row-span label="发票日期" :text="row.invDate" />
        <szd-card-row-span label="销方信息" :text="row.sellerName" />
        <szd-card-row-span label="附件名称" :text="row.attachName" />
        <szd-card-row-span label="所属票夹" :text="row.folderName" />
      </template>
    </szd-card-a>
  </template>

  <!-- 详情 -->
  <wfConsumeInvView ref="refWfConsumeInvView" :tableObj="_objData.invFol" @viewClose="handleChangeCheckRow" />
</template>

<script setup>
  import { computed, nextTick, onMounted, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import { wfEisConsumeFol } from "../api/wfComsume";
  import wfConsumeInvView from "./wfConsumeInvView.vue";

  const emit = defineEmits(["update:objData"]);
  //详情
  const refWfConsumeInvView = ref();

  const props = defineProps({
    bussParam: {
      type: Object
    },
    objData: {
      type: Object
    }
  });

  const _objData = computed({
    get: () => props.objData,
    set: val => {
      emit("update:objData", val);
    }
  });

  const query = ref({
    bussId: "",
    bstp: "",
    invList: [],
    folderId: "",
    attachName: "",
    date: []
  });

  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);

  onMounted(() => {
    resetQuery();
  });

  const initData = () => {
    query.value.bussId = "";
    query.value.bstp = "";
    query.value.invList = [];
    query.value.folderId = "";
    query.value.attachName = "";
    query.value.date = [];
  };

  //重置
  const resetQuery = () => {
    initData();
    handleQuery();
  };

  //查询数据
  const handleQuery = () => {
    query.value.bussId = props.bussParam.bussId;
    query.value.bstp = props.bussParam.bstp;
    query.value.invList = props.bussParam.invList;
    query.value.startTime = null;
    query.value.endTime = null;
    if (query.value.date && query.value.date.length > 0) {
      query.value.startTime = query.value.date[0];
      query.value.endTime = query.value.date[1];
    }
    wfEisConsumeFol(query.value).then(res => {
      if (res.code === 200) {
        _objData.value.invFol = res.data;
      }
    });
  };

  //设置全选或取消选择
  const handleChangeCheckAll = v => {
    for (let i = 0; i < _objData.value.invFol.length; i++) {
      _objData.value.invFol[i]["$SZDCHECKBOX"] = false;
    }
    nextTick(() => {
      if (v) {
        for (let i = 0; i < _objData.value.invFol.length; i++) {
          _objData.value.invFol[i]["$SZDCHECKBOX"] = true;
        }
      }
      _isIndeterminate.value = false;
    });
  };

  const handleChangeCheckRow = v => {
    nextTick(() => {
      let count = 0;
      for (let i = 0; i < _objData.value.invFol.length; i++) {
        if (_objData.value.invFol[i]["$SZDCHECKBOX"]) count++;
      }
      _isIndeterminate.value = count > 0 && count < _objData.value.invFol.length;
    });
  };

  //详情信息
  const handleClickRowView = rowIndex => {
    refWfConsumeInvView.value.callInitData(rowIndex);
  };
</script>

<style scoped lang="scss">
  .c-checkbox-all {
    display: flex;
    width: 100%;
    height: 35px;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 10px;
  }

  .c-head {
    display: flex;
    width: 100%;

    .ck-box {
      width: 30px;
    }

    .title {
      flex: 1;
    }

    .view-but {
      justify-content: center;
      display: flex;
      width: 30px;
      color: var(--button-primary-color);
    }
  }
</style>