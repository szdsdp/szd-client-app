<template>
  <!-- 城市搜索帮助    -->
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      :placeholder="$t(placeholder)"
      readonly
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      :hint="label ? false : hint"
      v-model="_modelValueInput"
      @click="handleOpen"
      style="width: 100%">
      <template #append-icon>
        <var-icon class="prepend-icon" name="map-marker-radius-outline" style="padding-left: 5px" />
      </template>
    </var-input>
    <!-- 地区弹窗 -->
    <var-popup position="bottom" v-model:show="_show" close-on-click-overlay>
      <var-picker
        v-if="_options.length > 0"
        cascade
        :columns="_options"
        textKey="label"
        v-model="_optVal"
        @confirm="handleConfirm"
        @cancel="handleCancel" />
    </var-popup>
  </div>
</template>

<script setup>
  import { computed, ref, nextTick, onBeforeMount, watch } from "vue";
  import store from "~store";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";
  import { getCityList } from "../api/searchHelpCity";

  const props = defineProps({
    modelValue: {
      type: [String, Number]
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
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //数据范围
  const _options = ref([]);
  const _optVal = ref([]);
  //输出显示
  const _modelValueInput = ref();
  //选择窗口
  const _show = ref(false);

  //值数据
  const _modelValue = computed({
    get: () => {
      return props.modelValue;
    },
    set: val => {
      emit("update:modelValue", val);
    }
  });

  watch(
    () => props.modelValue,
    () => {
      nextTick(() => {
        getShowVal();
      });
    },
    { immediate: true }
  );

  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });

  onBeforeMount(() => {
    initData();
  });

  //初始化单选数据
  const initData = () => {
    getCity();
  };

  //获取城市信息
  const getCity = () => {
    const vuexGroup = store.state.vuexData.group;
    if (vuexGroup && vuexGroup["$SZD_CITY"]) {
      _options.value = vuexGroup["$SZD_CITY"];
      getShowVal();
    } else {
      getCityList().then(res => {
        if (res.code === 200) {
          _options.value = res.data;
          getShowVal();
          //Vuex存储数据
          store.dispatch("setVuexDataGroup", { key: "$SZD_CITY", value: _options.value });
        } else {
          console.error("地区查询报错" + res.msg);
        }
      });
    }
  };

  //获取输出值
  const getShowVal = () => {
    let result = { optValue: [], optLabel: [] };
    if (_options.value.length > 0) {
      getShowValDo(result, _options.value);
    }
    _optVal.value = result.optValue;
    _modelValueInput.value = "";
    for (let i = 0; i < result.optLabel.length; i++) {
      if (i === 0) {
        _modelValueInput.value = result.optLabel[i];
      } else {
        _modelValueInput.value += " / " + result.optLabel[i];
      }
    }
  };

  const getShowValDo = (result, options) => {
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === props.modelValue) {
        result.optValue.push(options[i].value);
        result.optLabel.push(options[i].label);
        return;
      } else if (options[i].children && options[i].children.length > 0) {
        getShowValDo(result, options[i].children);
        if (result.optValue.length > 0) {
          result.optValue.splice(0, 0, options[i].value);
          result.optLabel.splice(0, 0, options[i].label);
          return;
        }
      }
    }
  };

  //打开选择器
  const handleOpen = v => {
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      handleClear();
    } else {
      getShowVal();
      _show.value = true;
    }
  };

  //清空数据
  const handleClear = () => {
    _modelValue.value = "";
    nextTick(() => {
      emit("change", _modelValue.value);
    });
  };

  //确认事件
  const handleConfirm = v => {
    _modelValue.value = v.length > 0 ? v[v.length - 1] : "";
    nextTick(() => {
      emit("change", _modelValue.value);
      _show.value = false;
    });
  };

  const handleCancel = () => {
    _show.value = false;
  };
</script>
