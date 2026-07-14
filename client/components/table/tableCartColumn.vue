<template>
  <!-- 控件设置 -->
  <template v-if="_fCat.ctrlType">
    <!--  控件类型 scan -->
    <template v-if="_fCat.ctrlType === 'input' && _fCat.appScan === true">
      <szd-scan
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        :desc="_fCat.ctrlParam.descField ? scope.row[_fCat.ctrlParam.descField] : ''"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 input -->
    <template v-else-if="_fCat.ctrlType === 'input'">
      <szd-input-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        :desc="_fCat.ctrlParam.descField ? scope.row[_fCat.ctrlParam.descField] : ''"
        @help="handleRowHelp(_fCat, scope.row, scope.$index)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)"
        @click="handleRowClick(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 input-number -->
    <template v-else-if="_fCat.ctrlType === 'input-number'">
      <szd-input-number-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 date -->
    <template v-else-if="_fCat.ctrlType === 'date'">
      <szd-date-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 time -->
    <template v-else-if="_fCat.ctrlType === 'time'">
      <szd-time-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 checkbox -->
    <template v-else-if="_fCat.ctrlType === 'checkbox'">
      <szd-checkbox-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 radio -->
    <template v-else-if="_fCat.ctrlType === 'radio'">
      <szd-radio-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 select -->
    <template v-else-if="_fCat.ctrlType === 'select'">
      <szd-select-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 textarea -->
    <template v-else-if="_fCat.ctrlType === 'textarea'">
      <szd-textarea-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 password -->
    <template v-else-if="_fCat.ctrlType === 'password'">
      <szd-password-ctrl
        v-model="scope.row[_fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)"
        @change="handleRowChange(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 svg -->
    <template v-else-if="_fCat.ctrlType === 'svg'">
      <szd-svg
        :name="_fCat.ctrlParam.nameField ? scope.row[_fCat.ctrlParam.nameField] : _fCat.ctrlParam.name"
        :fixed="_fCat.ctrlParam.fixed"
        :color="_fCat.ctrlParam.colorField ? scope.row[_fCat.ctrlParam.colorField] : _fCat.ctrlParam.color"
        :fontSize="_fCat.ctrlParam.fontSize"
        :label="_fCat.ctrlParam.labelField ? scope.row[_fCat.labelField] : ''"
        :clicked="_fCat.ctrlParam.clicked"
        @click="handleRowClick(_fCat, scope.row, scope.$index)" />
    </template>
    <!--  控件类型 upload -->
    <template v-else-if="_fCat.ctrlType === 'upload'">
      <szd-upload-view-ctrl
        v-model="scope.row[_fCat.field]"
        v-model:fileCount="scope.row['$SZDUpload_' + _fCat.field]"
        :ctrl="handleCtrlParam(_fCat, scope.row)" />
    </template>
    <!--  控件类型 button -->
    <template v-else-if="_fCat.ctrlType === 'button' && _fCat.ctrlParam && _fCat.ctrlParam.length > 0">
      <span class="card-text-row" :style="{ border: !_fCat.label ? 'none' : '' }">
        <div class="title" v-if="_fCat.label">{{ _fCat.label }}:</div>
        <div class="content">
          <template v-for="ctrl in _fCat.ctrlParam">
            <szd-button-ctrl
              :ctrl="handleCtrlParamButton(_fCat, ctrl, scope.row)"
              @click="handleRowButton(ctrl.fCode, _fCat, scope.row, scope.$index)" />
          </template>
        </div>
      </span>
    </template>
  </template>
  <!-- 文本输出-数值 -->
  <szd-card-row-span
    v-else-if="_fCat.$SZDDot"
    :label="_fCat.label"
    :text="scope.row[_fCat.field]"
    :numDot="_fCat.numDot"
    :numDec="_fCat.numDec"
    :noZero="_fCat.noZero"
    :align="_fCat.align"
    :clickColor="_fCat.clickColor"
    @click="_fCat.clickColor ? handleRowClick(_fCat, scope.row, scope.$index) : ''" />
  <!-- 文本输出-文本 -->
  <szd-card-row-span
    v-else
    :label="_fCat.label"
    :text="scope.row[_fCat.field]"
    :align="_fCat.align"
    :clickColor="_fCat.clickColor"
    @click="_fCat.clickColor ? handleRowClick(_fCat, scope.row, scope.$index) : ''" />
</template>

<script setup>
  import { computed } from "vue";
  import { setRowHelp } from "./js/tableFunc";
  import { getCtrlParam, getCtrlParamButton } from "./js/tableParamCtrl";

  //回调事件
  const emit = defineEmits(["handleRowEvent"]);

  const props = defineProps({
    layout: {
      type: Object
    },
    layFCat: {
      type: Object
    },
    row: {
      type: Object
    },
    index: {
      type: Number
    }
  });
  const scope = computed(() => {
    return { row: props.row, $index: props.index };
  });

  //列表头
  const _fCat = computed(() => {
    return props.layFCat;
  });

  //设置单元格是否可编辑
  const handleCtrlParam = (fCat, row) => {
    return getCtrlParam(props.layout, fCat, row);
  };

  //设置按钮操作状态
  const handleCtrlParamButton = (fCat, ctrlParam, row) => {
    return getCtrlParamButton(props.layout, fCat, ctrlParam, row);
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
</script>