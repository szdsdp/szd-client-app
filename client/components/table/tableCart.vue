<template>
  <!-- 表体 -->
  <template v-for="(row, index) in _dataObj">
    <szd-card-a>
      <!-- 表头 -->
      <template v-if="_cardHeader" #header>
        <!-- 表头 -->
        <szd-card-row-title
          v-model="row.$SZDCHECKBOX"
          :text="_lay.layout.viewTitle && row[_lay.layout.viewTitle] ? row[_lay.layout.viewTitle] : ''"
          :index="index + 1"
          :checkbox="_lay.layout.selection !== '0'"
          :lighted="!!_lay.layout.light"
          :light="_lay.layout.light ? row[_lay.layout.light] : ''"
          :btnView="_lay.layout.viewMode !== '0'"
          @view="handleClickRowView(row, index)" />
      </template>
      <!--  内容-列设置 -->
      <template #main>
        <template v-for="fCat in _lay.fCatCol">
          <tableCartColumn
            v-if="!fCat.hide && fCat.appShow !== '1'"
            :layout="_lay.layout"
            :layFCat="fCat"
            :row="row"
            :index="index"
            @handleRowEvent="handleRowEventImp" />
        </template>
      </template>
    </szd-card-a>
  </template>
  <!-- 详情 -->
  <tableView ref="refTableView" :oper="oper" @handleRowEvent="handleRowEventImp" @handleNextPage="handleNextPageImp" />
</template>

<script setup>
  import { computed, ref } from "vue";
  import tableCartColumn from "./tableCartColumn.vue";
  import tableView from "./view/tableView.vue";

  //定义事件
  const emit = defineEmits(["update:dataObj", "handleEvent", "handleRowEvent"]);

  const props = defineProps({
    lay: {
      type: Object
    },
    dataObj: {
      type: Array
    },
    oper: {
      type: Object
    }
  });

  //表格
  const refTableView = ref();

  //表格布局
  const _lay = computed(() => {
    return props.lay;
  });

  //表格数据
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });

  // 卡片头是否显示
  const _cardHeader = computed(() => {
    return (
      _lay.value.layout.selection !== "0" ||
      !!_lay.value.layout.viewTitle ||
      _lay.value.layout.viewMode !== "0" ||
      !!_lay.value.layout.light ||
      _lay.value.layout.showIndex
    );
  });

  //详情信息
  const handleClickRowView = (row, rowIndex) => {
    if (_lay.value.layout.viewMode === "9") {
      emit("handleRowEvent", { fCode: "$view", row: row, index: rowIndex });
    } else {
      refTableView.value.callInitData(_lay.value, row, rowIndex, _dataObj.value.length);
    }
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //上一页 下一页
  const handleNextPageImp = rowIndex => {
    handleClickRowView(_dataObj.value[rowIndex], rowIndex);
  };

  //关闭详情
  const closeView = () => {
    refTableView.value.closeView();
  };

  //定义父组件可用方法
  defineExpose({
    closeView
  });
</script>

<style scoped lang="scss">
  .l-table-head {
    display: flex;
    align-items: center;
    width: 100%;

    .l-table-label-line {
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background-color: #2772ff;
      margin-right: 5px;
    }

    .l-table-ck-box {
      width: 30px;
    }

    .l-table-title {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 3px;
    }

    .l-table-view-but {
      justify-content: center;
      display: flex;
      width: 30px;
      color: var(--button-primary-color);
    }
  }
</style>