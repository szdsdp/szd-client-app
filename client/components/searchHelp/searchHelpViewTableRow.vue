<template>
  <!-- 详情 -->
  <var-popup v-model:show="dg.open" position="left" close-on-click-overlay class="szd__popup__wrapper_w">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <template v-if="winParams.commonFlag">
          <szd-button
            v-if="winParams.activeTab === 0 && _scope.row.SZDcommonValFlagSZD !== '1'"
            label="添加常用"
            @click="handleRowButton('commonAdd')" />
          <szd-button v-if="winParams.activeTab === 1" label="删除常用" @click="handleRowButton('commonDel')" />
        </template>
        <szd-button label="上一页" :disabled="_scope.$index === 0" @click="handleNextPage(-1)" />
        <szd-button label="下一页" :disabled="_scope.$index >= dg.totalPage - 1" @click="handleNextPage(1)" />
      </var-button-group>
    </div>

    <div class="szd__popup__main" style="padding: 0">
      <div class="card-item" style="padding: 15px 15px 15px 25px; gap: 10px">
        <!-- 详情信息 -->
        <szd-text
          v-for="fCat in fieldCat"
          :label="fCat.label"
          v-model="_scope.row[fCat.field]"
          :align="fCat.align"
          clickColor
          @click="handleRowClick(fCat, _scope.row, _scope.$index)" />
      </div>
    </div>
  </var-popup>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    winParams: {
      type: Object,
      default: {}
    },
    fieldCat: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: []
    }
  });

  //回调事件
  const emit = defineEmits(["handleRowEvent"]);

  //窗口对象
  const dg = ref({
    open: false,
    totalPage: 0
  });
  const _scope = ref({ row: {}, $index: 0 });
  //初始化数据
  const callInitData = rowIndex => {
    //初始化数据
    _scope.value.row = props.data[rowIndex];
    _scope.value.$index = rowIndex;
    dg.value.totalPage = props.data.length;
    //打开窗口
    dg.value.open = true;
  };

  //下一页
  const handleNextPage = next => {
    _scope.value.row = props.data[_scope.value.$index + next];
    _scope.value.$index = _scope.value.$index + next;
  };

  //行事件-按钮
  const handleRowButton = fCode => {
    callEmitRowEvent(fCode, "", _scope.value.row, _scope.value.$index);
  };

  //行事件-数据单击 $click
  const handleRowClick = (fCat, row, rowIndex) => {
    callEmitRowEvent("$click", fCat.field, row, rowIndex);
  };

  //调用父级功能-行处理事件
  const callEmitRowEvent = (fCode, field, row, index) => {
    emit("handleRowEvent", { fCode: fCode, field: field, row: row, index: index });
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>