<template>
  <div class="szd__tb__wrapper l-table-wrapper szd__wrapper__scroll__top">
    <template v-if="_lay && _lay.fCatCol.length > 0">
      <!-- 工具栏 -->
      <div
        class="l-table-toolbar"
        :style="{ 'justify-content': _lay.layout.selection !== '0' && _lay.layout.showMode !== '0' ? 'space-between' : '' }">
        <div v-if="_lay.layout.selection !== '0' && _lay.layout.showMode !== '0'" class="l-table-checkbox-all">
          <szd-checkbox-all v-model:data="_dataObj" @selection-change="handleSelectionChange" />
        </div>
        <tableToolbar ref="refToolbar" :lay="_lay" :dataObj="_dataObj" @clickToolbar="handleClickToolbar" />
      </div>

      <!-- table格式 -->
      <div v-if="_lay.layout.showMode === '0'" class="l-table-table szd-page-white" style="padding: 0 5px">
        <tableCol
          ref="refTableComp"
          v-model:lay="_lay"
          v-model:dataObj="_dataObj"
          :oper="_oper"
          @handleEvent="handleEventImp"
          @handleRowEvent="handleRowEventImp" />
      </div>
      <!--  card格式  -->
      <div v-else class="l-table-table">
        <tableCart
          ref="refTableComp"
          v-model:lay="_lay"
          v-model:dataObj="_dataObj"
          :oper="_oper"
          @handleEvent="handleEventImp"
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
  import { computed, ref, nextTick, watch } from "vue";
  import { appInitTableLay } from "./js/appTableParam";
  import { initLayAuth, initOper } from "./js/tableParamAuth";
  import { dataAdd, dataCopy, dataDel } from "./js/tableFunc";
  import tableToolbar from "./tableToolbar.vue";
  import tableCol from "./tableCol.vue";
  import tableCart from "./tableCart.vue";

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
    //工具类按钮
    toolbar: {
      type: Object,
      default: {}
    },
    //排序规则 数组[{field,order}]
    sortRule: {
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
    },
    //权限对象 {szdopt:操作权限字符,szdkey:主表key字符,szdfst:字段状态对象,szdbtn:按钮状态对象}
    oper: {
      type: Object
    }
  });
  //定义事件
  const emit = defineEmits(["handleRequest", "handleEvent", "handleRowEvent", "selection-change", "update:data", "update:page"]);
  //子屏幕
  const refToolbar = ref();
  const refTableComp = ref();
  //表格布局
  const _lay = computed(() => {
    return appInitTableLay(props.layout, props.fieldCat, props.toolbar, props.sortRule);
  });
  //表格数据
  const _dataObj = computed({
    get: () => props.data,
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
  //获取权限对象
  const _oper = computed(() => {
    return initOper(props.oper, _lay);
  });

  //回调数据查询 $request 分页和排序触发请求数据
  const handleRequestImp = () => {
    emit("handleRequest");
  };

  //按钮回调事件
  const handleEventImp = obj => {
    obj["selection"] = getSelectionRows();
    emit("handleEvent", obj);
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //点击工具栏按钮
  const handleClickToolbar = obj => {
    switch (obj.fCode) {
      case "$checkboxAll":
        handleSelectionChange(obj.v);
        break;
      case "$add":
        if (_lay.value.layout.addRowMode) {
          obj.fCode = "$addCall";
          handleEventImp({ fCode: obj.fCode, fCatUse: _lay.value.fCatUse });
        } else {
          handleClickToolbarImp("$add", dataAdd(_dataObj, _lay.value.fCatUse));
        }
        break;
      case "$copy":
        handleClickToolbarImp("$copy", dataCopy(_dataObj, _lay.value.fCatUse, getSelectionRows()));
        break;
      case "$del":
        handleClickToolbarImp("$del", dataDel(_dataObj, getSelectionRows()));
        break;
      default:
        if (!obj.fCode.startsWith("$") || ["$upload"].includes(obj.fCode)) {
          handleEventImp(obj);
        }
        break;
    }
  };
  //工具栏执行
  const handleClickToolbarImp = (fCode, obj) => {
    if (obj) {
      obj["fCode"] = fCode;
      handleEventImp(obj);
    }
  };

  //权限设置
  watch(
    () => [_lay.value, _oper.value],
    () => {
      nextTick(() => {
        initLayAuth(_lay, _oper);
      });
    }
  );

  //定义父组件可用方法
  const getRef = () => {
    return refTableComp.value;
  };

  //关闭详情
  const closeView = () => {
    refTableComp.value.closeView();
  };

  //刷新表格
  const refreshTable = () => {
    _lay.value = appInitTableLay(props.layout, props.fieldCat, props.toolbar, props.sortRule);
  };

  /*************设置选中行处理*************************************************/
  //回调传输选中行
  const handleSelectionChange = selections => {
    emit("selection-change", selections);
  };

  //获取选中行
  const getSelectionRows = () => {
    if (!_dataObj.value || !_dataObj.value.length) return [];
    let _selection = [];
    for (let i = 0; i < _dataObj.value.length; i++) {
      if (_dataObj.value[i].$SZDCHECKBOX) _selection.push(_dataObj.value[i]);
    }
    return _selection;
  };

  //定义父组件可用方法
  defineExpose({
    getRef,
    closeView,
    refreshTable
  });
</script>

<style scoped lang="scss">
  .l-table-wrapper {
    width: 100%;
  }

  .l-table-table {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;
    position: relative;
    flex: 1;
  }

  .l-table-toolbar {
    display: flex;
    width: 100%;
    height: auto;
    align-items: center;
  }

  .l-table-checkbox-all {
    height: 35px;
    line-height: 35px;
    padding: 0 5px;
  }
</style>