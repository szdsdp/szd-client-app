<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-select
      v-model="_modelValue"
      :size="size"
      :placeholder="$t(placeholder)"
      :hint="label ? false : hint"
      :clearable="clearable"
      :disabled="_fst.disabled"
      @change="handleChange"
      @clear="handleClear"
      style="width: 100%">
      <var-option v-for="(item, index) in _options" :key="index" :label="showKey ? item.svalname : item.sname" :value="item.svalue" />
    </var-select>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, watch } from "vue";
  import store from "~store";
  import { selectBaseView } from "../api/selectOption";
  import szdStoreLocal from "../../common/store/storeLocal";
  import szdComp from "../../common/utils/component";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean]
    },
    size: {
      type: String
    },
    //基础字段
    baseField: {
      type: String,
      default: ""
    },
    //单选数组[{svalue:"",sname:""}]
    baseArr: {
      type: Array,
      default: () => []
    },
    //[['字段',值],['字段',值]] 可选
    baseSelect: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
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
    //显示key
    showKey: {
      type: Boolean,
      default: true
    },
    //默认首个
    first: {
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

  //监听值数据
  watch(
    () => [props.baseArr, props.baseField, props.baseSelect],
    () => {
      initData();
    }
  );

  onMounted(() => {
    initData();
  });

  //初始化单选数据
  const initData = () => {
    if (props.baseArr && Array.isArray(props.baseArr) && props.baseArr.length > 0) {
      _options.value = props.baseArr; //数据范围-来源前端
      getSvalName();
    } else if (props.baseField) {
      getBaseField(props.baseField); //数据范围-基础字段
    } else {
      console.error("select数据范围请输入baseArr或baseField");
    }
  };

  //数据范围-基础字段
  const getBaseField = baseField => {
    if (props.baseSelect && Array.isArray(props.baseSelect) && props.baseSelect.length > 0) {
      //设置查询条件数组
      let arr = [];
      props.baseSelect.forEach(item => {
        arr.push({ paramName: item[0], paramValue: item[1], paramMode: "EQ" });
      });
      //获取实时数据
      selectBaseView({ baseField: baseField, _paramGroup: arr }).then(res => {
        if (res.code === 200) {
          _options.value = res.data;
          getSvalName();
        } else {
          if (arr.length === 0) console.error("基础字段" + baseField + "查询报错" + res.msg);
        }
      });
    } else {
      //获取localStorage数据
      const localDict = szdStoreLocal.getDict();
      if (localDict && localDict[baseField]) {
        _options.value = localDict[baseField];
        getSvalName();
      } else {
        const vuexBase = store.state.vuexData.dict;
        if (vuexBase && vuexBase[baseField]) {
          _options.value = vuexBase[baseField];
          getSvalName();
        } else {
          //获取实时数据
          selectBaseView({ baseField: baseField, _paramGroup: [] }).then(res => {
            if (res.code === 200) {
              _options.value = res.data;
              getSvalName();
              //Vuex存储数据
              store.dispatch("setVuexDataDict", { baseField: baseField, options: _options.value });
            } else {
              console.error("基础字段" + baseField + "查询报错" + res.msg);
            }
          });
        }
      }
    }
  };

  //数据显示处理
  const getSvalName = () => {
    if (Array.isArray(_options.value) && _options.value.length > 0) {
      for (let i = 0; i < _options.value.length; i++) {
        //值为空默认第一个
        if (i === 0 && props.first && !_modelValue.value) {
          _modelValue.value = _options.value[i].svalue;
        }
        _options.value[i].svalname = _options.value[i].svalue + "." + _options.value[i].sname;
      }
    }
  };

  //更改事件
  const handleChange = v => {
    let res = { svalue: undefined, sname: undefined, svalname: undefined };
    for (let i = 0; i < _options.value.length; i++) {
      if (v === _options.value[i].svalue) {
        res.svalue = _options.value[i].svalue;
        res.sname = _options.value[i].sname;
        res.svalname = _options.value[i].svalname;
        break;
      }
    }
    emit("change", v, res);
  };

  //清除事件
  const handleClear = () => {
    _modelValue.value = "";
    handleChange("");
  };
</script>
