<template>
  <div class="szd__tb__wrapper szd__wrapper__scroll__top">
    <template v-if="_lay && _lay.fCatCol.length > 0">
      <!-- table格式 -->
      <div v-if="_lay.layout.showMode === '0'" class="l-sh-table szd-page-white" style="padding: 0 5px">
        <searchHelpViewTableCol
          v-model:lay="_lay"
          v-model:dataObj="_dataObj"
          v-model:checkSel="_checkSel"
          @selection-change="handleSelectionChangeImp"
          @handleRowEvent="handleRowEventImp" />
      </div>
      <!--  card格式  -->
      <div v-else class="l-sh-table">
        <searchHelpViewTableCart
          v-model:lay="_lay"
          v-model:dataObj="_dataObj"
          v-model:checkSel="_checkSel"
          @selection-change="handleSelectionChangeImp"
          @handleRowEvent="handleRowEventImp" />
      </div>
      <!-- 分页 -->
      <szd-pagination
        v-if="_lay.layout.pagination !== '0'"
        :total="_page.total"
        v-model:page="_page.pageNum"
        v-model:limit="_page.pageSize"
        :page-sizes="_page.pageSizes"
        @pagination="handleRequestImp" />
    </template>
  </div>
</template>

<script setup>
  import { computed, ref, nextTick } from "vue";
  import searchHelpViewTableCol from "./searchHelpViewTableCol.vue";
  import searchHelpViewTableCart from "./searchHelpViewTableCart.vue";

  const props = defineProps({
    //表格样式
    layout: {
      type: Object,
      default: {}
    },
    //字段目录
    fieldCat: {
      type: Array,
      default: []
    },
    //输出数据
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    //分页
    page: {
      type: Object,
      default: {}
    }
  });
  //定义事件
  const emit = defineEmits(["handleRequest", "handleRowEvent", "selection-change", "update:data", "update:page"]);
  //多选参数
  const _checkSel = ref({});
  //表格布局
  const _lay = computed(() => {
    return { layout: props.layout, fCatCol: props.fieldCat };
  });
  //表格数据
  const _dataObj = computed({
    get: () => {
      _checkSel.value = {};
      return props.data;
    },
    set: val => {
      emit("update:data", val);
    }
  });
  //分页
  const _page = computed({
    get: () => props.page,
    set: val => {
      emit("update:page", val);
    }
  });

  //回调数据查询 $request 分页和排序触发请求数据
  const handleRequestImp = () => {
    emit("handleRequest");
  };

  //选中回调事件
  const handleSelectionChangeImp = () => {
    emit("selection-change", getSelectionRows());
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //获取选中行
  const getSelectionRows = () => {
    let _selection = [];
    for (let i = 0; i < _dataObj.value.length; i++) {
      if (_checkSel.value["c_" + i]) _selection.push(_dataObj.value[i]);
    }
    return _selection;
  };

  //设置选择行
  const toggleRowSelection = (row, selected) => {
    nextTick(() => {
      let _index = _dataObj.value.indexOf(row);
      if (_index > -1) {
        _checkSel.value["c_" + _index] = selected;
        handleSelectionChangeImp();
      }
    });
  };

  //定义父组件可用方法
  defineExpose({
    toggleRowSelection
  });
</script>

<style scoped lang="scss">
  .l-sh-table {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
    position: relative;
    flex: 1;
  }
</style>