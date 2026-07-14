<template>
  <div v-if="dataObj && dataObj.length > 0" class="c-checkbox-all">
    <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" @change="handleChangeCheckAll">
      {{ $t("全选") }}
    </var-checkbox>
  </div>

  <!-- 表体 -->
  <template v-for="(row, index) in dataObj">
    <szd-card-a :footer="false">
      <!--  表头   -->
      <template #header>
        <div class="c-head">
          <div class="ck-box">
            <var-checkbox v-model="row.$SZDCHECKBOX" @change="handleChangeCheckRow" />
          </div>
          <div class="title">
            <span>{{ row.invCode }} ; {{ row.invAmt }}</span>
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
            @help="
              szdSh({
                a: 'CORE_BSUB01',
                b: row,
                c: ['bsub', 'bsubName'],
                d: [
                  ['bstp', props.bussBase.bstp],
                  ['compCode', row.compCode]
                ]
              })
            "
            :desc="row.bsubName" />
        </span>
        <span>
          <szd-select placeholder="票据类型" v-model="row.invTypeCode" baseField="CORE_INVT" />
        </span>
        <span>
          <szd-date placeholder="发票日期" v-model="row.invDate" type="date" />
        </span>
        <span>
          <szd-input placeholder="销方信息" v-model="row.sellerName" :maxlength="200" />
        </span>
        <template v-if="props.mDg.actTab === 'invFol'">
          <span>
            <szd-text placeholder="附件名称" v-model="row.attachName" />
          </span>
          <span>
            <szd-text placeholder="所属票夹" v-model="row.folderName" />
          </span>
        </template>
      </template>
    </szd-card-a>
  </template>

  <!-- 详情 -->
  <wfConsumeInvView ref="refWfConsumeInvView" :mDg="mDg" :dataObj="dataObj" @viewClose="handleChangeCheckRow" />
</template>

<script setup>
  import { computed, nextTick, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import wfConsumeInvView from "./wfConsumeInvView.vue";

  //详情
  const refWfConsumeInvView = ref();

  const props = defineProps({
    mDg: {
      type: Object
    },
    bussBase: {
      type: Object
    },
    dataObj: {
      type: Array
    }
  });

  //定义事件
  const emit = defineEmits(["update:dataObj"]);

  //表格数据
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });

  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);

  //设置全选或取消选择
  const handleChangeCheckAll = v => {
    for (let i = 0; i < _dataObj.value.length; i++) {
      _dataObj.value[i]["$SZDCHECKBOX"] = false;
    }
    nextTick(() => {
      if (v) {
        for (let i = 0; i < _dataObj.value.length; i++) {
          _dataObj.value[i]["$SZDCHECKBOX"] = true;
        }
      }
      _isIndeterminate.value = false;
    });
  };

  const handleChangeCheckRow = v => {
    nextTick(() => {
      let count = 0;
      for (let i = 0; i < _dataObj.value.length; i++) {
        if (_dataObj.value[i]["$SZDCHECKBOX"]) count++;
      }
      _isIndeterminate.value = count > 0 && count < _dataObj.value.length;
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