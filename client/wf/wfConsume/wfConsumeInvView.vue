<template>
  <!-- 详情 -->
  <var-popup v-model:show="dg.open" position="left" close-on-click-overlay @close="handleClose" class="szd__popup__wrapper_w">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="上一页" :disabled="_scope.$index === 0" @click="handleNextPage(-1)" />
        <szd-button label="下一页" :disabled="_scope.$index >= dg.totalPage - 1" @click="handleNextPage(1)" />
      </var-button-group>
    </div>
    <!-- 详情信息 -->
    <div class="szd__popup__main">
      <szd-card-a>
        <template #main>
          <div class="row">
            <szd-checkbox placeholder="选择" v-model="_scope.row.$SZDCHECKBOX" />
          </div>
          <div class="row">
            <szd-input
              placeholder="业务小类"
              v-model="_scope.row.bsub"
              showHelp
              :help="{ a: 'CORE_BSUB01', b: _scope.row, c: ['bsub', 'bsubName'], d: [['bstp', props.bussBase.bstp]] }"
              :desc="_scope.row.bsubName" />
          </div>
          <szd-text placeholder="发票号码" :text="row.invNo" />
          <szd-text placeholder="票据类型" :text="row.invTypeName" />
          <szd-text placeholder="发票日期" :text="row.invDate" />
          <szd-text placeholder="发票日期" :text="row.invDate" />
          <szd-text placeholder="金额" :text="row.invAmt" :numDec="2" numDot />
          <szd-text placeholder="税额" :text="row.invAmtTax" :numDec="2" numDot />
          <szd-text placeholder="金额(不含税)" :text="row.invAmtNoTax" :numDec="2" numDot />
          <szd-text placeholder="税率" :text="row.invTaxRate" />
          <szd-text placeholder="销方信息" :text="row.sellerName" />
          <szd-text placeholder="纳税人识别号" :text="row.sellerTaxNum" />
          <szd-text placeholder="座位等级" :text="row.bsubPjName" />
          <szd-text placeholder="出发城市" :text="row.startCityName" />
          <szd-text placeholder="到达城市" :text="row.endCityName" />
          <szd-text placeholder="发票代码" :text="row.invCode" />
          <szd-text placeholder="发票代码" :text="row.invCode" />
          <szd-text placeholder="是否抵扣" :text="row.invFlagName" />
        </template>
      </szd-card-a>
    </div>
  </var-popup>
</template>

<script setup>
  import { computed, ref } from "vue";

  const props = defineProps({
    mDg: {
      type: Object
    },
    bussBase: {
      type: Object
    },
    dataObj: {
      type: Object
    }
  });

  //定义事件
  const emit = defineEmits(["viewClose"]);

  //表格数据
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });

  //窗口对象
  const dg = ref({
    open: false,
    totalPage: 0
  });
  const _scope = ref({ row: {}, $index: 0 });

  //初始化数据
  const callInitData = rowIndex => {
    //初始化数据
    _scope.value.row = _dataObj.value[rowIndex];
    _scope.value.$index = rowIndex;
    dg.value.totalPage = _dataObj.value.length;
    //打开窗口
    dg.value.open = true;
  };

  //下一页
  const handleNextPage = next => {
    _scope.value.row = _dataObj.value[_scope.value.$index + next];
    _scope.value.$index = _scope.value.$index + next;
  };

  const handleClose = () => {
    dg.value.open = false;
    emit("viewClose");
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>