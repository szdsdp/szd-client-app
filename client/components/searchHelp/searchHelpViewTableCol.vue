<template>
  <!-- 表头 -->
  <table>
    <thead>
      <tr>
        <!-- 多选 -->
        <th v-if="_lay.layout.selection !== '0'" style="width: 35px">
          <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" @change="handleChangeCheckAll" />
        </th>
        <!-- 列设置 -->
        <template v-for="fCat in _lay.fCatCol">
          <th v-if="!fCat.detail" :style="handelHeadStyle(fCat)">
            {{ $t(fCat.label) }}
          </th>
        </template>
        <!-- 详情列 -->
        <th v-if="_lay.layout.viewMode !== '0'" class="l-sh-fixed-col-th"></th>
      </tr>
    </thead>
    <!-- 表体 -->
    <tbody>
      <template v-for="(row, index) in _dataObj">
        <tr>
          <!-- 多选 -->
          <td v-if="_lay.layout.selection !== '0'" style="text-align: center">
            <var-checkbox v-model="_checkSel['c_' + index]" @change="handleChangeCheckRow" />
          </td>
          <!-- 列设置 -->
          <template v-for="fCat in _lay.fCatCol">
            <td v-if="!fCat.detail">
              <div class="l-sh-td-div" :style="handelBodyStyle(fCat)" @click="handleRowButton('$click', fCat, row, index)">
                {{ row[fCat.field] }}
              </div>
            </td>
          </template>
          <!-- 详情列 -->
          <td v-if="_lay.layout.viewMode !== '0'" class="l-sh-fixed-col-td">
            <var-icon name="chevron-right" style="font-size: 24px" @click="handleClickRowView(row, index)" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup>
  import { computed, ref, nextTick } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    lay: {
      type: Object
    },
    dataObj: {
      type: Array
    },
    checkSel: {
      type: Object
    }
  });

  //定义事件
  const emit = defineEmits(["update:checkSel", "update:dataObj", "handleRowEvent", "selection-change"]);

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

  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);
  const _checkSel = computed({
    get: () => props.checkSel,
    set: val => {
      emit("update:checkSel", val);
    }
  });

  //表格样式
  const handelHeadStyle = fCat => {
    let _style = {};
    if (fCat.width > 0) _style["width"] = fCat.width + "px";
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
  const handleChangeCheckAll = v => {
    _checkSel.value = {};
    nextTick(() => {
      if (v) {
        for (let i = 0; i < _dataObj.value.length; i++) {
          _checkSel.value["c_" + i] = true;
        }
      }
      _isIndeterminate.value = false;
      emit("selection-change");
    });
  };

  const handleChangeCheckRow = v => {
    nextTick(() => {
      let count = 0;
      for (let key in _checkSel.value) {
        if (_checkSel.value[key]) count++;
      }
      _isIndeterminate.value = count > 0 && count < _dataObj.value.length;
      emit("selection-change");
    });
  };

  //行事件-按钮
  const handleRowButton = (fCode, fCat, row, rowIndex) => {
    emit("handleRowEvent", { fCode: fCode, field: fCat.field, row: row, index: rowIndex });
  };

  //详情信息
  const handleClickRowView = (row, rowIndex) => {
    if (_lay.value.layout.viewMode === "9") {
      emit("handleRowEvent", { fCode: "$view", row: row, index: rowIndex });
    }
  };
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

  .l-sh-td-div {
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
  .l-sh-fixed-col-th {
    position: sticky;
    background-color: #eef1f6;
    right: 0;
    z-index: 2;
    width: 30px;
  }

  .l-sh-fixed-col-td {
    position: sticky;
    background: #fafcff;
    right: 0;
    z-index: 1;
    width: 30px;
    text-align: center;
    color: var(--button-primary-color);
  }
</style>