<template>
  <!-- 详情 -->
  <var-popup v-model:show="dg.open" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" style="height: 85vh">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button label="上一页" :disabled="scope.$index === 0" @click="handleNextPage(-1)" />
        <szd-button label="下一页" :disabled="scope.$index >= dg.totalPage - 1" @click="handleNextPage(1)" />
        <szd-button label="关闭" @click="handleClose" />
      </var-button-group>
    </div>
    <!-- 详情信息 -->
    <template v-if="_layView.tabCount === 1">
      <div class="flex-1 ovh">
        <div class="szd__popup__main hp100 szd-page-bg" style="padding: 0; margin: 5px 0">
          <tableViewScr
            v-model:scope="scope"
            :layout="_layView.layout"
            :viewCat="_layView.tabGroup[0].children"
            :oper="oper"
            @handleRowEvent="handleRowEventImp" />
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 页标签信息 -->
      <var-tabs
        elevation
        color="var(--color-primary)"
        active-color="var(--color-on-primary)"
        inactive-color="var(--color-on-info)"
        v-model:active="dg.actTab">
        <template v-for="viewCat in _layView.tabGroup">
          <var-tab :name="viewCat.$SZDTabName">{{ $t(viewCat.label) }}</var-tab>
        </template>
      </var-tabs>
      <!-- 页标签内容 -->
      <var-tabs-items v-model:active="dg.actTab" class="flex-1">
        <template v-for="viewCat in _layView.tabGroup">
          <var-tab-item :name="viewCat.$SZDTabName">
            <div class="szd__popup__main hp100 szd-page-bg" style="padding: 0; margin: 5px 0">
              <tableViewScr
                v-model:scope="scope"
                :layout="_layView.layout"
                :viewCat="viewCat.children"
                :oper="oper"
                @handleRowEvent="handleRowEventImp" />
            </div>
          </var-tab-item>
        </template>
      </var-tabs-items>
    </template>
  </var-popup>
</template>

<script setup>
  import { ref } from "vue";
  import { $t } from "../../../common/utils/globalConfig";
  import { initDataView, initDataViewSubTable } from "../js/tableView";
  import tableViewScr from "./tableViewScr.vue";
  //回调事件
  const emit = defineEmits(["handleRowEvent", "handleNextPage"]);

  const props = defineProps({
    oper: {
      type: Object
    }
  });

  //窗口对象
  const dg = ref({
    open: false,
    title: "详情",
    actTab: "tab0",
    totalPage: 0
  });
  const scope = ref({ row: {}, $index: 0 });
  //获取View布局
  const _layView = ref({});
  //初始化数据
  const callInitData = (lay, row, rowIndex, totalPage) => {
    //初始化数据
    initDataViewSubTable(row, lay);
    scope.value.row = row;
    scope.value.$index = rowIndex;
    dg.value.totalPage = totalPage;
    //初始化
    _layView.value = initDataView(lay, props.oper);
    //打开窗口
    dg.value.open = true;
    if (lay.layout.viewTitle && row[lay.layout.viewTitle]) {
      dg.value.title = $t("详情") + ": " + row[lay.layout.viewTitle];
    } else {
      dg.value.title = $t("详情");
    }
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //关闭窗口
  const handleClose = () => {
    dg.value.open = false;
  };

  //下一页
  const handleNextPage = next => {
    emit("handleNextPage", scope.value.$index + next);
  };

  //关闭详情
  const closeView = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData,
    closeView
  });
</script>