<template>
  <div v-if="_objData.invImg && _objData.invImg.length > 0" class="c-checkbox-all">
    <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" @change="handleChangeCheckAll">
      {{ $t("全选") }}
    </var-checkbox>
  </div>

  <!-- 表体 -->
  <template v-for="(row, index) in _objData.invImg">
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
      </template>
    </szd-card-a>
  </template>

  <!-- 详情 -->
  <wfConsumeInvView ref="refWfConsumeInvView" :tableObj="_objData.invImg" @viewClose="handleChangeCheckRow" />
</template>

<script setup>
  import { computed, onMounted, ref, nextTick } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import { wfEisConsumeImg } from "../api/wfComsume";
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

  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);

  onMounted(() => {
    getData();
  });

  const getData = () => {
    wfEisConsumeImg(props.bussParam).then(res => {
      if (res.code === 200) {
        _objData.value.invImg = res.data;
      }
    });
  };

  //设置全选或取消选择
  const handleChangeCheckAll = v => {
    for (let i = 0; i < _objData.value.invImg.length; i++) {
      _objData.value.invImg[i]["$SZDCHECKBOX"] = false;
    }
    nextTick(() => {
      if (v) {
        for (let i = 0; i < _objData.value.invImg.length; i++) {
          _objData.value.invImg[i]["$SZDCHECKBOX"] = true;
        }
      }
      _isIndeterminate.value = false;
    });
  };

  const handleChangeCheckRow = v => {
    nextTick(() => {
      let count = 0;
      for (let i = 0; i < _objData.value.invImg.length; i++) {
        if (_objData.value.invImg[i]["$SZDCHECKBOX"]) count++;
      }
      _isIndeterminate.value = count > 0 && count < _objData.value.invImg.length;
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