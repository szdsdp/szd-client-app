<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      :placeholder="$t(placeholder)"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      :hint="label ? false : hint"
      v-model="_modelValueInput"
      @click="handleOpen"
      style="width: 100%">
      <template #append-icon>
        <var-icon class="prepend-icon" name="calendar-month-outline" style="padding-left: 5px" />
      </template>
    </var-input>
    <!-- 日期弹窗 -->
    <var-popup position="bottom" v-model:show="_show" close-on-click-overlay @closed="handleClosed">
      <!-- 日期和时间选择 -->
      <div v-if="_dateAtr.type === 'datetime'">
        <var-date-picker type="date" v-model="_datetimeValue.date" :range="_dateAtr.range">
          <template v-if="_dateAtr.range" #range="scope">
            <div v-if="scope.choose && scope.choose.length === 2" class="l-datetime">
              <div class="l-range">
                <div>{{ scope.choose[0] }}</div>
                <div class="l-time" @click="handleTimeClick(0)">{{ _datetimeValue.time[0] }}</div>
              </div>
              <div>~</div>
              <div class="l-range">
                <div>{{ scope.choose[1] }}</div>
                <div class="l-time" @click="handleTimeClick(1)">{{ _datetimeValue.time[1] }}</div>
              </div>
            </div>
          </template>
          <template v-else #date="scope">
            <div class="l-datetime">
              <div>{{ scope.year }}-{{ scope.month }}-{{ scope.date }}</div>
              <div class="l-time" @click="handleTimeClick">{{ _datetimeValue.time }}</div>
            </div>
          </template>
        </var-date-picker>
      </div>
      <!-- 日期 -->
      <var-date-picker
        v-else
        :type="_dateAtr.type"
        v-model="_modelValue"
        @change="handleChange"
        :range="_dateAtr.range"
        :multiple="_dateAtr.multiple" />
    </var-popup>

    <!-- 时间选择 -->
    <var-popup v-if="_dateAtr.type === 'datetime'" position="bottom" v-model:show="_showTime" close-on-click-overlay>
      <var-picker :columns="_timeColumn" v-model="_timeValue.time" @confirm="handleTimeConfirm" />
    </var-popup>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import _ from "lodash";
  import { $mE, $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    type: {
      type: String,
      default: "date"
    },
    modelValue: {
      type: [String, Date, Array]
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    hint: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });

  //定义事件
  const emit = defineEmits(["update:modelValue", "change"]);
  //原值
  const _valOld = ref();
  //日期属性
  const _dateAtr = computed(() => {
    let _atr = {
      type: "date",
      multiple: ["dates", "years", "months"].includes(props.type),
      range: ["daterange", "yearrange", "monthrange", "datetimerange"].includes(props.type)
    };
    if (["year", "years", "yearrange"].includes(props.type)) {
      _atr.type = "year";
    } else if (["month", "months", "monthrange"].includes(props.type)) {
      _atr.type = "month";
    } else if (["datetime", "datetimerange"].includes(props.type)) {
      _atr.type = "datetime";
    }
    return _atr;
  });
  //值数据
  const _modelValue = computed({
    get: () => {
      if (props.modelValue) {
        return props.modelValue;
      } else {
        return _dateAtr.value.multiple || _dateAtr.value.range ? [] : "";
      }
    },
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //日期和时间值
  const _datetimeValue = ref({
    date: undefined,
    time: undefined
  });
  const _timeValue = ref({ index: 0, time: [] });
  //输出显示
  const _modelValueInput = computed(() => {
    if (_dateAtr.value.range && _modelValue.value && _modelValue.value.length === 2) {
      return props.modelValue[0] + " ~ " + props.modelValue[1];
    } else {
      return _modelValue.value ? _modelValue.value.toString() : "";
    }
  });
  //日期选择窗口
  const _show = ref(false);
  const _showTime = ref(false);
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
  });

  //打开日期选择器
  const handleOpen = v => {
    _valOld.value = _.cloneDeep(_modelValue.value);
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      handleClear();
    } else {
      if (_dateAtr.value.type === "datetime") parseToDateTime();
      _show.value = true;
    }
  };

  //清空数据
  const handleClear = () => {
    _modelValue.value = _dateAtr.value.multiple || _dateAtr.value.range ? [] : "";
    if (_dateAtr.value.type === "datetime") initDateTime();
    emit("change", _modelValue.value);
  };

  //更改事件
  const handleChange = () => {
    if (!_dateAtr.value.multiple) _show.value = false;
  };

  const handleClosed = () => {
    if (_dateAtr.value.type === "datetime") parseToModelValue();
    if (JSON.stringify(_valOld.value) !== JSON.stringify(_modelValue.value)) {
      emit("change", _modelValue.value);
    }
  };

  // 设置日期和时间的初始值
  const initDateTime = () => {
    if (_dateAtr.value.range) {
      _datetimeValue.value.date = [];
      _datetimeValue.value.time = ["00:00:00", "00:00:00"];
    } else {
      _datetimeValue.value.date = "";
      _datetimeValue.value.time = "00:00:00";
    }
  };

  // 解析modelValue为日期和时间
  const parseToDateTime = () => {
    initDateTime();
    if (_modelValue.value) {
      if (_dateAtr.value.range) {
        if (_modelValue.value.length === 2) {
          if (_modelValue.value[0]) {
            _datetimeValue.value.date[0] = _modelValue.value[0].split(" ")[0];
            _datetimeValue.value.time[0] = _modelValue.value[0].split(" ")[1];
          }
          if (_modelValue.value[1]) {
            _datetimeValue.value.date[1] = _modelValue.value[1].split(" ")[0];
            _datetimeValue.value.time[1] = _modelValue.value[1].split(" ")[1];
          }
        }
      } else if (_modelValue.value) {
        _datetimeValue.value.date = _modelValue.value.split(" ")[0];
        _datetimeValue.value.time = _modelValue.value.split(" ")[1];
      }
    }
  };

  // 转换成日期和时间到modelValue
  const parseToModelValue = () => {
    if (_dateAtr.value.range) {
      if (_datetimeValue.value.date.length !== 2 || !_datetimeValue.value.date[0] || !_datetimeValue.value.date[1]) {
        _modelValue.value = [];
      } else {
        if (_datetimeValue.value.date[0] === _datetimeValue.value.date[1] && _datetimeValue.value.time[0] > _datetimeValue.value.time[1]) {
          $mE("结束时间不能小于开始时间");
          return;
        }
        _modelValue.value[0] = _datetimeValue.value.date[0] + " " + _datetimeValue.value.time[0];
        _modelValue.value[1] = _datetimeValue.value.date[1] + " " + _datetimeValue.value.time[1];
      }
    } else {
      if (_datetimeValue.value.date) {
        _modelValue.value = _datetimeValue.value.date + " " + _datetimeValue.value.time;
      } else {
        _modelValue.value = "";
      }
    }
  };

  // 时间选择
  const handleTimeClick = pIndex => {
    if (_dateAtr.value.range) {
      _timeValue.value.index = pIndex;
      _timeValue.value.time = _datetimeValue.value.time[pIndex].split(":");
    } else {
      _timeValue.value.time = _datetimeValue.value.time.split(":");
    }
    _showTime.value = true;
  };

  // 时间选择确认
  const handleTimeConfirm = () => {
    if (_dateAtr.value.range) {
      _datetimeValue.value.time[_timeValue.value.index] = _timeValue.value.time.join(":");
    } else {
      _datetimeValue.value.time = _timeValue.value.time.join(":");
    }
    _showTime.value = false;
  };

  // 获取时间列
  const _timeColumn = computed(() => {
    let _arrColumn = [];
    let _hh = [];
    for (let i = 0; i < 24; i++) {
      _hh.push({ text: i.toString().padStart(2, "0") });
    }
    _arrColumn.push(_hh);
    let _mm = [];
    for (let i = 0; i < 60; i++) {
      _mm.push({ text: i.toString().padStart(2, "0") });
    }
    _arrColumn.push(_mm);
    let _ss = [];
    for (let i = 0; i < 60; i++) {
      _ss.push({ text: i.toString().padStart(2, "0") });
    }
    _arrColumn.push(_ss);
    return _arrColumn;
  });
</script>

<style scoped lang="scss">
  .l-datetime {
    display: flex;
    font-size: var(--date-picker-title-date-range-font-size);
    gap: 10px;
    align-items: center;

    .l-range {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .l-time {
      text-align: center;
      border-bottom: 2px solid #ffffff;
    }
  }
</style>