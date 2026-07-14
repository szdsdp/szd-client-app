<template>
  <!-- 输出列-字段 -->
  <template v-for="card in _cardList">
    <!-- 折叠详情页 -->
    <template v-if="card.cardType === 'tabs-fold'">
      <div class="szd-page-bg">
        <tableViewScr
          v-model:scope="_scope"
          :layout="layout"
          :viewCat="card.fCat.children"
          :cardTitleLabel="card.fCat.label"
          @handleRowEvent="handleRowEventImp" />
      </div>
    </template>
    <!-- 子表 -->
    <template v-else-if="card.cardType === 'table'">
      <div class="flex ovh szd-page-bg">
        <szd-table
          ref="refTable1"
          :layout="card.fCat.layout"
          :toolbar="card.fCat.toolbar"
          :fieldCat="card.fCat.fieldCat"
          :sortRule="card.fCat.sortRule"
          :oper="handleSubTableOper(card.fCat.field)"
          v-model:data="_scope.row[card.fCat.field]"
          :row-key="card.fCat.layout.rowKey"
          border
          stripe
          @handleRowEvent="handleSubRowEventImp($event, card.fCat.field, card.fCat.layout)"
          @handleEvent="handleSubEventImp($event, card.fCat.field, card.fCat.layout)" />
      </div>
    </template>
    <!-- 字段 -->
    <template v-else>
      <szd-card-a>
        <!-- 表头 -->
        <template v-if="cardTitleLabel" #header>
          <szd-title-label :text="cardTitleLabel" />
        </template>
        <!-- 内容 -->
        <template #main>
          <template v-for="(fCat, index) in card.viewCat">
            <!--  控件类型 scan -->
            <template v-if="fCat.ctrlType === 'input' && fCat.appScan === true">
              <szd-scan
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                :desc="fCat.ctrlParam.descField ? _scope.row[fCat.ctrlParam.descField] : ''"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 input -->
            <template v-if="fCat.ctrlType === 'input'">
              <szd-input-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                :desc="fCat.ctrlParam.descField ? _scope.row[fCat.ctrlParam.descField] : ''"
                @help="handleRowHelp(fCat, _scope.row, _scope.$index)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)"
                @dblclick="handleRowClick(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 input-number -->
            <template v-else-if="fCat.ctrlType === 'input-number'">
              <szd-input-number-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 date -->
            <template v-else-if="fCat.ctrlType === 'date'">
              <szd-date-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 time -->
            <template v-else-if="fCat.ctrlType === 'time'">
              <szd-time-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 checkbox -->
            <template v-else-if="fCat.ctrlType === 'checkbox'">
              <szd-checkbox-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 radio -->
            <template v-else-if="fCat.ctrlType === 'radio'">
              <szd-radio-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 select -->
            <template v-else-if="fCat.ctrlType === 'select'">
              <szd-select-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 textarea -->
            <template v-else-if="fCat.ctrlType === 'textarea'">
              <szd-textarea-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 password -->
            <template v-else-if="fCat.ctrlType === 'password'">
              <szd-password-ctrl
                v-model="_scope.row[fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)"
                @change="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 svg -->
            <template v-else-if="fCat.ctrlType === 'svg'">
              <szd-svg
                :name="_scope.row[fCat.ctrlParam.nameField]"
                :fixed="fCat.ctrlParam.fixed"
                :color="fCat.ctrlParam.colorField ? _scope.row[fCat.ctrlParam.colorField] : fCat.ctrlParam.color"
                :fontSize="fCat.ctrlParam.fontSize"
                :label="fCat.ctrlParam.labelField ? _scope.row[fCat.labelField] : ''"
                :clicked="fCat.ctrlParam.clicked"
                @click="handleRowChange(fCat, _scope.row, _scope.$index)" />
            </template>
            <!--  控件类型 upload -->
            <template v-else-if="fCat.ctrlType === 'upload'">
              <szd-upload-view-ctrl
                v-model="_scope.row[fCat.field]"
                v-model:fileCount="_scope.row['$SZDUpload_' + fCat.field]"
                :ctrl="handleCtrlParam(fCat, _scope.row)" />
            </template>
            <!--  控件类型 button -->
            <template v-else-if="fCat.ctrlType === 'button' && fCat.ctrlParam && fCat.ctrlParam.length > 0">
              <span class="card-text-row" :style="{ border: !fCat.label ? 'none' : '' }">
                <div class="title" v-if="fCat.label">{{ fCat.label }}:</div>
                <div class="content">
                  <template v-for="ctrl in fCat.ctrlParam">
                    <szd-button-ctrl
                      :ctrl="handleCtrlParamButton(fCat, ctrl, _scope.row)"
                      @click="handleRowButton(ctrl.fCode, fCat, _scope.row, _scope.$index)" />
                  </template>
                </div>
              </span>
            </template>
            <!-- 千分位符 -->
            <template v-else-if="fCat.$SZDDot">
              <szd-dot
                :label="fCat.label"
                v-model="_scope.row[fCat.field]"
                :numDec="fCat.numDec"
                :numDot="fCat.numDot"
                :noZero="fCat.noZero"
                :clickColor="fCat.clickColor"
                @click="handleRowClick(fCat, _scope.row, _scope.$index)" />
            </template>
            <!-- 文本输出 -->
            <template v-else>
              <szd-text
                :label="fCat.label"
                v-model="_scope.row[fCat.field]"
                :align="fCat.align"
                :clickColor="fCat.clickColor"
                @click="handleRowClick(fCat, _scope.row, _scope.$index)" />
            </template>
          </template>
        </template>
      </szd-card-a>
    </template>
  </template>
</template>

<script setup>
  import _ from "lodash";
  import { computed } from "vue";
  import { setRowHelp } from "../js/tableFunc";
  import { getCtrlSubTableOper, getCtrlParam, getCtrlParamButton } from "../js/tableParamCtrl";

  //回调事件
  const emit = defineEmits(["update:scope", "handleRowEvent"]);

  const props = defineProps({
    layout: {
      type: Object
    },
    viewCat: {
      type: Array,
      default: []
    },
    scope: {
      type: Object
    },
    oper: {
      type: Object
    },
    cardTitleLabel: {}
  });

  //行数据
  const _scope = computed({
    get: () => props.scope,
    set: val => {
      emit("update:scope", val);
    }
  });

  //设置单元格是否可编辑
  const handleCtrlParam = (fCat, row) => {
    return getCtrlParam(props.layout, fCat, row);
  };

  //设置按钮操作状态
  const handleCtrlParamButton = (fCat, ctrlParam, row) => {
    return getCtrlParamButton(props.layout, fCat, ctrlParam, row);
  };

  //获取子表oper权限
  const handleSubTableOper = field => {
    return getCtrlSubTableOper(props.oper, field);
  };

  //搜索帮助
  const handleRowHelp = (fCat, row, rowIndex) => {
    if (fCat.ctrlParam.showHelp) {
      if (fCat.ctrlParam.baseField) {
        setRowHelp(props.layout, fCat, row).then(res => {
          if (res) {
            callEmitRowEvent("$change", fCat.field, row, rowIndex);
          }
        });
      } else {
        callEmitRowEvent("$help", fCat.field, row, rowIndex); //搜索帮助回调
      }
    }
  };
  //行事件-按钮
  const handleRowButton = (fCode, fCat, row, rowIndex) => {
    callEmitRowEvent(fCode, fCat.field, row, rowIndex);
  };
  //行事件-数据更改 $change
  const handleRowChange = (fCat, row, rowIndex) => {
    callEmitRowEvent("$change", fCat.field, row, rowIndex);
  };
  //行事件-数据单击 $click
  const handleRowClick = (fCat, row, rowIndex) => {
    callEmitRowEvent("$click", fCat.field, row, rowIndex);
  };

  //调用父级功能-行处理事件
  const callEmitRowEvent = (fCode, field, row, index) => {
    emit("handleRowEvent", { fCode: fCode, field: field, row: row, index: index });
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //行事件-数据更改
  const handleSubRowEventImp = (obj, field, vLayout) => {
    emit("handleRowEvent", {
      fCode: "$sub-table",
      tableUKey: vLayout.tableUKey,
      field: field,
      row: _scope.value.row,
      index: _scope.value.$index,
      handle: { event: "handleRowEvent", obj: obj }
    });
  };

  //按钮事件
  const handleSubEventImp = (obj, field, vLayout) => {
    emit("handleRowEvent", {
      fCode: "$sub-table",
      tableUKey: vLayout.tableUKey,
      field: field,
      row: _scope.value.row,
      index: _scope.value.$index,
      handle: { event: "handleEvent", obj: obj }
    });
  };

  //卡片分块显示 tabs-fold table
  const _cardList = computed(() => {
    let cardList = [];
    let cardObj = { cardType: "ctrl", viewCat: [] };
    for (let i = 0; i < props.viewCat.length; i++) {
      let fCat = props.viewCat[i];
      if (fCat.children) {
        if (cardObj.viewCat.length > 0) cardList.push(_.cloneDeep(cardObj));
        cardList.push({ cardType: "tabs-fold", fCat: fCat });
        cardObj = { cardType: "ctrl", viewCat: [] };
      } else if (fCat.fieldCat && fCat.fieldCat.length > 0) {
        if (cardObj.viewCat.length > 0) cardList.push(_.cloneDeep(cardObj));
        cardList.push({ cardType: "table", fCat: fCat });
        cardObj = { cardType: "ctrl", viewCat: [] };
      } else {
        cardObj.viewCat.push(fCat);
      }
    }
    if (cardObj.viewCat.length > 0) cardList.push(_.cloneDeep(cardObj));
    return cardList;
  });
</script>