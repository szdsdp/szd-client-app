<template>
  <!-- 表头 -->
  <table>
    <thead>
      <tr>
        <!-- 全选 -->
        <th v-if="_lay.layout.selection !== '0'" style="width: 35px">
          <szd-checkbox-all v-model:data="_dataObj" :label="false" @selection-change="handleChangeCheckboxAll" />
        </th>
        <!-- 列设置 -->
        <template v-for="fCat in _lay.fCatCol">
          <th v-if="!fCat.hide && fCat.appShow !== '1'" :style="handelHeadStyle(fCat)">
            {{ $t(fCat.label) }}
          </th>
        </template>
        <!-- 详情列 -->
        <th v-if="_lay.layout.viewMode !== '0'" class="fixed-col-th"></th>
      </tr>
    </thead>
    <!-- 表体 -->
    <tbody>
      <template v-for="(row, index) in _dataObj">
        <tr>
          <!-- 选择 -->
          <td v-if="_lay.layout.selection !== '0'" style="text-align: center">
            <var-checkbox v-model="row.$SZDCHECKBOX" />
          </td>
          <!-- 列设置 -->
          <template v-for="fCat in _lay.fCatCol">
            <td v-if="!fCat.hide && fCat.appShow !== '1'">
              <div class="td-div" :style="handelBodyStyle(fCat)" @click="fCat.click ? handleRowButton('$click', fCat, row, index) : ''">
                <!-- 按钮 -->
                <template v-if="fCat.ctrlType === 'button'">
                  <template v-for="ctrl in fCat.ctrlParam">
                    <szd-button-ctrl
                      size="mini"
                      :ctrl="handleCtrlParamButton(fCat, ctrl, row)"
                      @click="handleRowButton(ctrl.fCode, fCat, row, index)" />
                  </template>
                </template>
                <!-- 千分位符 -->
                <template v-else-if="fCat.$SZDDot">
                  <szd-dot v-model="row[fCat.field]" :numDot="fCat.numDot" :numDec="fCat.numDec" :noZero="fCat.noZero" />
                </template>
                <!-- 文字 -->
                <template v-else>
                  {{ row[fCat.field] }}
                </template>
              </div>
            </td>
          </template>
          <!-- 详情列 -->
          <td v-if="_lay.layout.viewMode !== '0'" class="fixed-col-td">
            <var-icon name="chevron-right" style="font-size: 24px" @click="handleClickRowView(row, index)" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <!-- 详情 -->
  <tableView ref="refTableView" :oper="oper" @handleRowEvent="handleRowEventImp" @handleNextPage="handleNextPageImp" />
</template>

<script setup>
  import { computed, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import { getCtrlParamButton } from "./js/tableParamCtrl";
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

  //表格样式
  const handelHeadStyle = fCat => {
    let _style = {};
    if (fCat.width && fCat.width > 0) _style["width"] = fCat.width + "px";
    return _style;
  };

  //表体样式
  const handelBodyStyle = fCat => {
    let _style = {};
    if (fCat.align) {
      _style["textAlign"] = fCat.align;
      if (fCat.align === "center") {
        _style["justifyContent"] = "center";
      } else if (fCat.align === "right") {
        _style["justifyContent"] = "flex-end";
      }
    }
    return _style;
  };

  //设置全选或取消选择
  const handleChangeCheckboxAll = v => {
    emit("handleEvent", { fCode: "$checkboxAll", v: v });
  };

  //设置按钮操作状态
  const handleCtrlParamButton = (fCat, ctrlParam, row) => {
    return getCtrlParamButton(_lay.value.layout, fCat, ctrlParam, row);
  };

  //行事件-按钮
  const handleRowButton = (fCode, fCat, row, rowIndex) => {
    emit("handleRowEvent", { fCode: fCode, field: fCat.field, row: row, index: rowIndex });
  };

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
  table {
    table-layout: fixed;
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  th {
    text-align: center;
    background-color: #eef1f6;
    color: #515a6e;
    padding: 0;
    height: 30px;
    border: 1px solid #ddd;
    font-weight: 600;
    word-wrap: break-word;
    word-break: break-all;
    position: sticky;
    top: -1px;
    z-index: 2;
  }

  td {
    text-align: left;
    border: 1px solid #ddd;
    border-top: none;
    color: var(--field-decorator-text-color);
    padding: 0;
  }

  .td-div {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 2px;
    min-height: 30px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
  }

  /* 固定最后一列 */
  .fixed-col-th {
    position: sticky;
    background-color: #eef1f6;
    right: 0;
    z-index: 2;
    width: 30px;
  }

  .fixed-col-td {
    position: sticky;
    background: #fafcff;
    right: 0;
    z-index: 1;
    width: 30px;
    text-align: center;
    color: var(--button-primary-color);
  }
</style>