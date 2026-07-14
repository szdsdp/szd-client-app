<template>
  <!-- 查询条件 -->
  <div class="g-seniorArea">
    <div class="g-seniorWrap">
      <!-- 查询标签 -->
      <div class="header">
        <div class="u-placeholder">
          <szd-title-label :text="_label" :required="required" />
        </div>
        <div v-if="type !== 'boolean' && !_selectOpt && !noExt" :class="['u-but', modelValue.length > 0 ? 'active' : '']" @click="showDialog">
          <var-icon name="menu" />
        </div>
      </div>
      <!--  查询输入框  -->
      <div class="m-input">
        <!--  下拉框 -->
        <template v-if="_selectOpt">
          <szd-select v-model="_selectVal" :baseField="props.help.a" :disabled="readonly || disabled" @change="changeSelect" :clearable="clearable" />
        </template>
        <!-- 输入框 -->
        <template v-else-if="type === 'string' || type === 'number'">
          <div class="m-row">
            <div v-if="!noTo" class="m-placeholder">{{ $t("从") }}:</div>
            <szd-input
              v-model="ranges[0].low"
              :type="type"
              :num-dot="numDot"
              :num-dec="numDec"
              :show-help="_showHelp"
              :help="dealSingleHelp(ranges[0], 'low')"
              :readonly="readonly"
              :disabled="onlyNull.includes(ranges[0].option) || disabled"
              :clearable="clearable"
              :hint="false"
              @change="changeSingle" />
          </div>
          <div v-if="!noTo" class="m-row">
            <div class="m-placeholder">{{ $t("到") }}:</div>
            <szd-input
              v-model="ranges[0].high"
              :type="type"
              :num-dot="numDot"
              :num-dec="numDec"
              :show-help="_showHelp"
              :help="dealSingleHelp(ranges[0], 'high')"
              :readonly="readonly"
              :disabled="onlyNull.includes(ranges[0].option) || disabled"
              :clearable="clearable"
              :hint="false"
              @change="changeSingle" />
          </div>
        </template>
        <!-- 限制为boolean类型   -->
        <template v-else-if="type === 'boolean'">
          <szd-radio
            v-model="_boolean"
            :baseArr="[
              { svalue: 'A', sname: $t('全部') },
              { svalue: '1', sname: $t('是') },
              { svalue: '0', sname: $t('否') }
            ]"
            :disabled="readonly || disabled"
            @change="changeBoolean" />
        </template>
        <!-- 限制为时间 -->
        <template v-else-if="type === 'time'">
          <div class="m-row">
            <div v-if="!noTo" class="m-placeholder">{{ $t("从") }}:</div>
            <szd-time
              v-model="ranges[0].low"
              :disabled="onlyNull.includes(ranges[0].option) || disabled || readonly"
              @change="changeSingle"
              :clearable="clearable"
              :hint="false" />
          </div>
          <div v-if="!noTo" class="m-row">
            <div class="m-placeholder">{{ $t("到") }}:</div>
            <szd-time
              v-if="!noTo"
              v-model="ranges[0].high"
              :disabled="onlyNull.includes(ranges[0].option) || disabled || readonly"
              @change="changeSingle"
              :clearable="clearable"
              :hint="false" />
          </div>
        </template>
        <!--限制为日期或日期时间-->
        <template v-else>
          <div class="m-row">
            <div v-if="!noTo" class="m-placeholder">{{ $t("从") }}:</div>
            <szd-date
              v-model="ranges[0].low"
              :type="type"
              :disabled="onlyNull.includes(ranges[0].option) || disabled || readonly"
              @change="changeSingle"
              :clearable="clearable"
              :hint="false" />
          </div>
          <div v-if="!noTo" class="m-row">
            <div class="m-placeholder">{{ $t("到") }}:</div>
            <szd-date
              v-model="ranges[0].high"
              :type="type"
              :disabled="onlyNull.includes(ranges[0].option) || disabled || readonly"
              @change="changeSingle"
              :clearable="clearable"
              :hint="false" />
          </div>
        </template>
      </div>
    </div>

    <!--高级查询条件弹框-->
    <var-popup v-model:show="visible" position="bottom" close-on-click-overlay class="szd__popup__wrapper_h" style="height: 80vh" @close="cancel">
      <!-- 功能区 -->
      <div class="szd__popup__top">
        <var-button-group type="default">
          <szd-button label="新增" type="primary" @click="addRanges" :disabled="readonly || disabled" />
          <szd-button label="清空" type="primary" @click="clearRanges" :disabled="readonly || disabled" />
          <szd-button label="确认" type="primary" @click="confirm" :disabled="readonly || disabled" />
        </var-button-group>
      </div>
      <div class="main-remark" style="margin-bottom: 5px">
        <span>{{ $t("注：OR为或：查询条件任一关系满足即可，AND为与：查询条件所有关系必须都满足，请注意条件间相互关联。") }}</span>
      </div>

      <!-- 数据区 -->
      <div class="szd__popup__main">
        <div v-for="(row, index) in ranges" class="g-seniorArea-popup">
          <div class="g-seniorWrap">
            <!--  表头   -->
            <div class="header">
              <div class="v-placeholder">{{ $t("操作符") }}</div>
              <div class="v-option">
                <var-select v-model="row.option" @change="changeOperator($event, row)" :disabled="readonly || disabled" clearable :hint="false">
                  <var-option
                    v-for="item in filterOperators"
                    :disabled="!row.high && type !== 'number' && onlyHigh.includes(item.value)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label" />
                </var-select>
              </div>
              <div :class="['v-but', readonly || disabled ? 'disabled' : '']" @click="readonly || disabled ? '' : remove(index)">
                <var-icon name="trash-can-outline" :size="16" />
              </div>
            </div>

            <!--  查询输入框  -->
            <div class="m-input">
              <div class="m-row">
                <div v-if="!noTo" class="m-placeholder">{{ $t("从") }}:</div>
                <szd-input
                  v-if="type === 'string' || type === 'number'"
                  v-model="row.low"
                  :type="type"
                  :num-dot="numDot"
                  :num-dec="numDec"
                  :show-help="_showHelp ? 'A' : false"
                  :help="dealSingleHelp(row, 'low')"
                  @help="dealMultiHelp('low', index)"
                  :readonly="readonly"
                  :disabled="onlyNull.includes(row.option) || disabled"
                  :clearable="clearable"
                  :hint="false"
                  @change="changeLow($event, row)"
                  @click="focusRow(index)" />
                <szd-time
                  v-else-if="type === 'time'"
                  v-model="row.low"
                  :disabled="onlyNull.includes(row.option) || disabled || readonly"
                  @change="changeLow($event, row)"
                  @focus="focusRow(index)"
                  :clearable="clearable"
                  :hint="false" />
                <szd-date
                  v-else
                  v-model="row.low"
                  :type="type"
                  :disabled="onlyNull.includes(row.option) || disabled || readonly"
                  @change="changeLow($event, row)"
                  @focus="focusRow(index)"
                  :clearable="clearable"
                  :hint="false" />
              </div>
              <div v-if="!noTo" class="m-row">
                <div class="m-placeholder">{{ $t("到") }}:</div>
                <szd-input
                  v-if="type === 'string' || type === 'number'"
                  v-model="row.high"
                  :type="type"
                  :num-dot="numDot"
                  :num-dec="numDec"
                  :show-help="_showHelp ? 'A' : false"
                  :help="dealSingleHelp(row, 'high')"
                  @help="dealMultiHelp('high', index)"
                  :readonly="readonly"
                  :disabled="onlyNull.includes(row.option) || disabled"
                  :clearable="clearable"
                  :hint="false"
                  @change="changeHigh($event, row)"
                  @click="focusRow(index)" />
                <szd-time
                  v-else-if="type === 'time'"
                  v-model="row.high"
                  :disabled="onlyNull.includes(row.option) || disabled || readonly"
                  @change="changeHigh($event, row)"
                  @focus="focusRow(index)"
                  :clearable="clearable"
                  :hint="false" />
                <szd-date
                  v-else
                  v-model="row.high"
                  :type="type"
                  :disabled="onlyNull.includes(row.option) || disabled || readonly"
                  @change="changeHigh($event, row)"
                  @focus="focusRow(index)"
                  :clearable="clearable"
                  :hint="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from "vue";
  import _ from "lodash";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { szdSh, szdShShow } from "../searchHelp/serchHelp";

  const props = defineProps({
    //类型支持string,number,boolean,date,datetime,time,year,month
    type: {
      type: String,
      default: "string" //默认字符串
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    numDot: {
      type: Boolean
    },
    numDec: {
      type: Number
    },
    //[基础字段-单值,要回填的字段-单值,查询条件(数组)]
    //{a:baseField, c:mapping, d:baseSelect}
    help: {
      type: Object
    },
    //无范围
    noTo: {
      type: Boolean,
      default: false
    },
    //无扩展
    noExt: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    clearSpace: {
      type: Boolean,
      default: false
    },
    selectOpt: {
      type: Boolean,
      default: false
    },
    //字符串查询规则操作符
    whereOpt: {
      type: String,
      default: "EQ"
    },
    required: {
      type: Boolean,
      default: false
    }
  });
  //单值操作符
  const onlyLow = ["EQ", "NE", "GE", "LE", "GT", "LT", "SP", "NS", "CP", "NC", "EN", "NN"];
  //范围操作符
  const onlyHigh = ["BT", "NB"];
  //日期和数值不允许使用的操作符
  const onlyLike = ["SP", "NS", "CP", "NC"];
  //空操作符禁用输入框框
  const onlyNull = ["EN", "NN"];
  //操作符描述
  const operators = [
    { value: "EQ", label: $t("等于(OR)") },
    { value: "NE", label: $t("不等于(AND)") },
    { value: "GE", label: $t("大于等于(AND)") },
    { value: "LE", label: $t("小于等于(AND)") },
    { value: "GT", label: $t("大于(AND)") },
    { value: "LT", label: $t("小于(AND)") },
    { value: "SP", label: $t("包含(OR)") },
    { value: "NS", label: $t("不包含(AND)") },
    { value: "CP", label: $t("*通配符包含(OR)") },
    { value: "NC", label: $t("*通配符不包含(AND)") },
    { value: "BT", label: $t("范围内(OR)") },
    { value: "NB", label: $t("范围外(AND)") },
    { value: "EN", label: $t("等于空(OR)") },
    { value: "NN", label: $t("不等于空(AND)") }
  ];
  //boolean数据类型
  const _boolean = ref("A");
  //下拉框数据类型
  const _selectVal = ref();
  //是否显示搜索帮助
  const _showHelp = computed(() => {
    return props.help && props.help.a;
  });
  //是否下拉框
  const _selectOpt = computed(() => {
    return props.selectOpt && props.type !== "boolean" && props.help && props.help.a;
  });
  //字符串查询规则操作符
  const _whereOpt = computed(() => {
    if (props.selectOpt || props.type !== "string") return "EQ";
    if (["EQ", "SP"].includes(props.whereOpt)) {
      return props.whereOpt;
    } else {
      return "EQ";
    }
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //查询数据
  const ranges = ref([
    {
      type: props.type,
      option: "",
      low: props.type === "number" ? 0 : "",
      high: props.type === "number" ? 0 : undefined
    }
  ]);
  //初始化行数据
  const addRanges = () => {
    ranges.value.push({
      type: props.type,
      option: "",
      low: props.type === "number" ? 0 : "",
      high: props.type === "number" ? 0 : undefined
    });
  };
  //显示Dialog
  const visible = ref(false);
  //克隆原始值
  const initRanges = ref([]);
  //光标当前行
  const cursorRowIndex = ref(0);
  const initRow = ref(3);
  //更新数据对象返回值
  const emit = defineEmits(["update:modelValue", "keydownEnter"]);

  //单输入框值改变索帮助
  const dealSingleHelp = (row, key) => {
    if (!_showHelp.value) return;
    const _c = props.help.c ? props.help.c : "*";
    return { a: props.help.a, b: row, c: [key + "-" + _c], d: props.help.d, j: true };
  };
  //单输入框值改变处理
  const changeSingle = () => {
    changeRowCheck(ranges.value[0]);
    const result = delDuplicate();
    emit("update:modelValue", result);
  };
  //boolean入框值改变处理
  const changeBoolean = () => {
    let _boolResult = [];
    if (_boolean.value === "0" || _boolean.value === "1") {
      _boolResult.push({
        type: props.type,
        option: "EQ",
        low: _boolean.value === "1",
        high: undefined
      });
    }
    emit("update:modelValue", _boolResult);
  };
  //下拉框值改变处理
  const changeSelect = () => {
    let _selectResult = [];
    if (_selectVal.value !== undefined && _selectVal.value !== null && _selectVal.value !== "") {
      _selectResult.push({
        type: props.type,
        option: "EQ",
        low: _selectVal.value,
        high: undefined
      });
    }
    emit("update:modelValue", _selectResult);
  };
  //弹出Dialog对话框
  const showDialog = () => {
    //初始化光标行
    cursorRowIndex.value = 0;
    //克隆原始值
    initRanges.value = _.cloneDeep(ranges.value);
    //显示弹窗
    visible.value = true;
  };
  //下拉框显示设置
  const filterOperators = computed(() => {
    if (props.type === "string") {
      return operators;
    } else {
      //不显示匹配数据
      return operators.filter(item => !onlyLike.includes(item.value));
    }
  });
  //操作符改变时值处理，当运算符清空时高低值随之清空
  const changeOperator = (e, row) => {
    if (e === "" || e == null || onlyNull.includes(row.option)) {
      row.low = row.high = undefined;
    } else if (!onlyHigh.includes(e)) {
      row.high = props.type === "number" ? 0 : undefined;
    }
  };
  //低值改变时触发业务
  const changeLow = (e, row) => {
    changeRowCheck(row);
  };
  //高值改变时触发业务
  const changeHigh = (e, row) => {
    changeRowCheck(row);
  };
  //点击按钮处理，获取光标当前所在行
  const focusRow = rowIndex => {
    cursorRowIndex.value = rowIndex;
  };
  //删除行数据
  const remove = index => {
    ranges.value.splice(index, 1);
    if (ranges.value.length === 0) {
      addRanges();
    }
  };
  //清空数据
  const clearRanges = () => {
    ranges.value = [];
    for (let i = 0; i < initRow.value; i++) {
      addRanges();
    }
  };
  //取消事件，还原初始值
  const cancel = () => {
    ranges.value = _.cloneDeep(initRanges.value);
    visible.value = false;
  };
  //确认数据
  const confirm = () => {
    //检查有效性
    if (checkValidate.value > -1) {
      $m("CORE_CLIENT.E077", [ranges.value[checkValidate.value].low, ranges.value[checkValidate.value].high]); //低值 & 不能大于高值 &
      return;
    }
    //删除无效行和重复行
    const result = delDuplicate();
    emit("update:modelValue", result);
    cancel();
  };
  //检查数据维护是否正确
  const checkValidate = computed(() => {
    let passedIndex = -1;
    passedIndex = ranges.value.findIndex(item => {
      const low = props.type === "number" ? Number(item.low) : item.low;
      const high = props.type === "number" ? Number(item.high) : item.high;
      return onlyHigh.includes(item.option) && low > high;
    });
    return passedIndex;
  });
  //删除无效行和重复行
  const delDuplicate = () => {
    const res = ranges.value.filter(item => item.option !== "");
    return Array.from(new Set(res.map(JSON.stringify)), JSON.parse);
  };
  //多选数据进行处理
  const dealMultiHelp = (key, index) => {
    szdShShow({ a: props.help.a, d: props.help.d, f: key === "low" ? 2 : 1 }).then(res => {
      if (res) {
        let idx = index;
        const _c = props.help.c ? props.help.c : res.param.defFieldId;
        res.data.forEach(item => {
          ranges.value[idx][key] = item[_c];
          //检查设置数据
          changeRowCheck(ranges.value[idx]);
          //设置下一行
          idx++;
          if (idx >= ranges.value.length) {
            addRanges();
          }
        });
      }
    });
  };
  //监听数值变化
  watch(
    () => props.modelValue,
    val => {
      ranges.value = _.cloneDeep(val);
      if (ranges.value.length < initRow.value) {
        for (let i = 0, len = initRow.value - ranges.value.length; i < len; i++) {
          addRanges();
        }
      }
      //记录初始值
      initRanges.value = _.cloneDeep(ranges.value);
      //boolean类型复制
      if (props.type === "boolean") {
        if (Array.isArray(props.modelValue) && props.modelValue.length > 0 && _.isBoolean(props.modelValue[0].low)) {
          _boolean.value = props.modelValue[0].low ? "1" : "0";
        } else {
          _boolean.value = "A";
        }
      }
      //下拉框赋值
      if (_selectOpt) {
        if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
          _selectVal.value = props.modelValue[0].low;
        } else {
          _selectVal.value = undefined;
        }
      }
    },
    //监听器会在初始化时立即执行
    { deep: true, immediate: true }
  );
  //检查数据和设置已操作符
  const changeRowCheck = row => {
    //选择空
    if (onlyNull.includes(row.option)) {
      row.low = row.high = undefined;
      return;
    }
    //去掉前后空格
    if (props.clearSpace && props.type === "string") {
      if (row.low !== undefined && row.low !== null && row.low !== "") {
        row.low = row.low.trim();
      }
      if (row.high !== undefined && row.high !== null && row.high !== "") {
        row.high = row.high.trim();
      }
    }
    //数值转化
    if (props.type === "number") {
      row.low = Number(row.low);
      row.high = Number(row.high);
    }
    //检查大小
    if (!props.noTo) {
      if (row.high || (props.type === "number" && onlyHigh.includes(row.option))) {
        if (row.low > row.high) {
          $m("CORE_CLIENT.E077", [row.low, row.high]); //低值 & 不能大于高值 &
          row.high = props.type === "number" ? 0 : undefined;
          if (props.type === "number" && onlyHigh.includes(row.option)) row.option = "EQ";
        }
      }
    } else {
      if (row.high) row.high = props.type === "number" ? 0 : undefined;
    }
    //设置操作符号
    if (row.high) {
      row.option = onlyHigh.includes(row.option) ? row.option : "BT";
    } else {
      if (row.low) {
        if (props.type === "string") {
          row.option = onlyLow.includes(row.option) ? row.option : _whereOpt.value;
          if (row.option === _whereOpt.value && row.low.includes("*")) row.option = "CP";
          if ((row.option === "CP" || row.option === "NC") && !row.low.includes("*")) row.option = _whereOpt.value;
        } else {
          row.option = onlyLow.includes(row.option) ? row.option : "EQ";
        }
      } else {
        row.option = "";
      }
    }
  };
</script>
<style scoped lang="scss">
  .g-seniorArea {
    width: 100%;
    padding: 5px 15px 10px 15px;
    background-color: #fff;
    border-radius: 5px;
  }

  .g-seniorArea-popup {
    width: 100%;
    padding: 5px 15px 10px 15px;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 8px;
  }

  .g-seniorWrap {
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      align-items: center;
      height: 36px;
      font-size: var(--font-size);
      border-bottom: 1px solid #cdd0d6;
      width: 100%;
      box-sizing: border-box;
      color: var(--field-decorator-placeholder-color);

      .u-placeholder {
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      .u-but {
        display: flex;
        justify-content: center;
        width: 28px;
        height: 24px;
        border-radius: var(--button-border-radius);
        color: var(--button-default-text-color);
        background-color: var(--button-default-color);
        box-shadow: 0 3px 1px -2px var(--shadow-key-umbra-opacity);

        &.active {
          font-weight: 600;
          color: #008f01;
          background-color: #b3e19d;
          border-color: #b3e19d;
        }
      }

      .v-placeholder {
        padding-right: 5px;
      }

      .v-option {
        flex: 1;
        padding: 5px 10px 5px 5px;
      }

      .v-but {
        display: flex;
        justify-content: center;
        width: 28px;
        height: 24px;
        border-radius: var(--button-border-radius);
        color: var(--button-primary-text-color);
        background-color: var(--button-primary-color);
        box-shadow: 0 3px 1px -2px var(--shadow-key-umbra-opacity);

        &.disabled {
          color: var(--button-default-text-color);
          background-color: var(--button-default-color);
        }
      }
    }

    .m-input {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-bottom: 5px;

      .m-row {
        display: flex;
        align-items: flex-end;
        padding-bottom: 5px;
        min-height: 36px;
      }

      .m-placeholder {
        display: flex;
        color: var(--button-default-text-color);
        font-size: var(--font-size);
        padding: 5px 10px 5px 0;
      }
    }
  }
</style>