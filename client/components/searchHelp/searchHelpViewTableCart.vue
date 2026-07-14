<template>
  <div v-if="_lay.layout.selection !== '0'" class="l-sh-checkbox-all">
    <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" @change="handleChangeCheckAll">
      {{ $t("全选") }}
    </var-checkbox>
  </div>
  <!-- 表体 -->
  <template v-for="(row, index) in _dataObj">
    <szd-card-a>
      <!--  表头   -->
      <template #header>
        <div class="l-sh-head">
          <span class="l-sh-label-line" />
          <div v-if="_lay.layout.selection !== '0'" class="l-sh-ck-box">
            <var-checkbox v-model="_checkSel['c_' + index]" @change="handleChangeCheckRow" />
          </div>
          <div class="l-sh-title">
            <span v-if="_lay.layout.viewTitle">{{ row[_lay.layout.viewTitle] }}</span>
            <span v-else>{{ $t("行号") }}:{{ index + 1 }}</span>
          </div>
          <div v-if="_lay.layout.viewMode !== '0'" class="l-sh-view-but">
            <var-icon name="chevron-right" style="font-size: 24px" @click="handleClickRowView(row, index)" />
          </div>
        </div>
      </template>
      <!--  内容 -->
      <template #main>
        <!-- 列设置 -->
        <template v-for="fCat in _lay.fCatCol">
          <szd-card-row-span
            v-if="!fCat.detail"
            :label="fCat.label"
            :text="row[fCat.field]"
            :align="fCat.align"
            clickColor
            @click="handleRowButton('$click', fCat, row, index)" />
        </template>
      </template>
    </szd-card-a>
  </template>
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
  .l-sh-checkbox-all {
    display: flex;
    width: 100%;
    height: 35px;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 10px;
  }

  .l-sh-head {
    display: flex;
    align-items: center;
    width: 100%;

    .l-sh-label-line {
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background-color: #2772ff;
      margin-right: 5px;
    }

    .l-sh-ck-box {
      width: 30px;
    }

    .l-sh-title {
      flex: 1;
    }

    .l-sh-view-but {
      justify-content: center;
      display: flex;
      width: 30px;
      color: var(--button-primary-color);
    }
  }
</style>