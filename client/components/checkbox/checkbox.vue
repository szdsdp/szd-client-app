<template>
  <div v-if="!_fst.hide" class="main-form-item main-form-item-border" :class="{ 'main-form-item-required': required }">
    <div v-if="_label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <template v-if="_checkboxGroup">
      <div :class="_checkboxAll === 'top' ? 'check-group-box-top' : 'check-group-box-left'">
        <div v-if="_checkboxAll" :class="_checkboxAll === 'top' ? '' : 'check-group-box-left-chk'">
          <var-checkbox v-model="_checkAll" :indeterminate="_isIndeterminate" :disabled="_fst.disabled" @change="handleChangeCheckAll">
            {{ $t("全选") }}
          </var-checkbox>
        </div>
        <div>
          <var-checkbox-group v-model="_modelValue" :direction="direction" :max="max" @change="handleChange">
            <var-checkbox v-for="item in _options" :checked-value="item.svalue" :disabled="handleDisabled(item.svalue)">
              {{ item.sname }}
            </var-checkbox>
          </var-checkbox-group>
        </div>
      </div>
    </template>
    <template v-else>
      <var-checkbox v-model="_modelValue" :disabled="_fst.disabled" @change="handleChange">{{ $t(boxLabel) }} </var-checkbox>
    </template>
  </div>
</template>
<script setup>
  import { computed, onMounted, ref, watch } from "vue";
  import store from "~store";
  import { selectBaseView } from "../api/selectOption";
  import szdStoreLocal from "../../common/store/storeLocal";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //单复选框数据类型：[String, Number, Boolean],返回值都是bool
    //多复选框数据类型 [Array]
    modelValue: {
      type: [String, Number, Boolean, Array]
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    //单复选框 标签名称
    boxLabel: {
      type: String,
      default: ""
    },
    //多复选框 基础字段
    baseField: {
      type: String,
      default: ""
    },
    //多复选框 数组[{svalue:"",sname:""}]
    baseArr: {
      type: Array,
      default: () => []
    },
    //多复选框 最大选择数
    max: {
      type: Number
    },
    //多复选框 最小选择数
    min: {
      type: Number
    },
    //多复选框 显示全选 top 显示在上边 left 在左边 与 max 和 min不能同时使用
    checkboxAll: {
      type: String
    },
    //多复选框 + 单复选框
    disabled: {
      type: Boolean,
      default: false
    },
    //垂直布局
    direction: {
      type: String
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
  //检查是否未数组
  const _checkboxGroup = computed(() => {
    if ((Array.isArray(props.baseArr) && props.baseArr.length > 0) || props.baseField) {
      return true;
    } else {
      return false;
    }
  });
  const _checkboxAll = computed(() => {
    if (props.max > 0 || props.min > 0) {
      return "";
    } else {
      return ["top", "left"].includes(props.checkboxAll) ? props.checkboxAll : "";
    }
  });
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });
  //数据范围
  const _options = ref([]);
  //全选参数
  const _checkAll = ref(false);
  const _isIndeterminate = ref(false);

  //监听值数据
  watch(
    () => [props.baseArr, props.baseField],
    () => {
      initData();
    }
  );

  onMounted(() => {
    initData();
  });
  //初始化单选数据
  const initData = () => {
    if (_checkboxGroup.value) {
      if (props.baseArr && Array.isArray(props.baseArr) && props.baseArr.length > 0) {
        _options.value = props.baseArr; //数据范围-来源前端
      } else if (props.baseField) {
        getBaseField(props.baseField); //数据范围-基础字段
      } else {
        console.error("checkbox的数据范围请输入darr或baseField");
      }
    }
  };
  //数据范围-基础字段
  const getBaseField = baseField => {
    //获取localStorage数据
    const localDict = szdStoreLocal.getDict();
    if (localDict && localDict[baseField]) {
      _options.value = localDict[baseField];
      setIndeterminate();
    } else {
      const vuexBase = store.state.vuexData.dict;
      if (vuexBase && vuexBase[baseField]) {
        _options.value = vuexBase[baseField];
        setIndeterminate();
      } else {
        //获取实时数据
        selectBaseView({ baseField: baseField, _paramGroup: [] }).then(res => {
          if (res.code === 200) {
            _options.value = res.data;
            setIndeterminate();
            //Vuex存储数据
            store.dispatch("setVuexDataDict", { baseField: baseField, options: _options.value });
          } else {
            console.error("基础字段" + baseField + "查询报错" + res.msg);
          }
        });
      }
    }
  };

  //设置全选标识
  const setIndeterminate = () => {
    if (_checkboxGroup.value) {
      setTimeout(() => {
        const count = _modelValue.value.length;
        _checkAll.value = count === _options.value.length;
        _isIndeterminate.value = count > 0 && count < _options.value.length;
      });
    }
  };

  //更改事件
  const handleChange = v => {
    setIndeterminate();
    emit("change", v);
  };

  //设置全选或取消选择
  const handleChangeCheckAll = v => {
    _modelValue.value = [];
    if (v) {
      for (let i = 0; i < _options.value.length; i++) {
        _modelValue.value.push(_options.value[i].svalue);
      }
      emit("update:modelValue", _modelValue.value);
    }
    _isIndeterminate.value = false;
    emit("change", v);
  };

  //设置不可编辑和最大最小选择数量
  const handleDisabled = val => {
    if (_fst.value.disabled) return _fst.value.disabled;
    const _min = props.min && props.min > 0 ? props.min : 0;
    const _max = props.max && props.max > 0 ? props.max : 0;
    if (_max >= _min) {
      if (_max > 0 && _max <= _modelValue.value.length) {
        return !_modelValue.value.includes(val);
      }
      if (_min > 0 && _min >= _modelValue.value.length) {
        return _modelValue.value.includes(val);
      }
    }
    return false;
  };
</script>
<style lang="scss" scoped>
  .check-group-box-top {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .check-group-box-left {
    width: 100%;
    display: flex;

    .check-group-box-left-chk {
      flex-shrink: 0;
      padding-right: 10px;
    }
  }
</style>
