<template>
  <!-- 功能按钮 -->
  <var-button-group type="default">
    <template v-for="but in _lay.schBtn">
      <szd-button-ctrl :ctrl="but" @click="handleSchButImp(but.fCode)" />
    </template>
    <!-- 更多 -->
    <var-menu
      v-if="_lay.schBtnMore && _lay.schBtnMore.length > 0"
      v-model:show="dg.menuOpen"
      placement="bottom-end"
      style="border-left: 1px solid #ffffff">
      <szd-button label="更多" type="primary" />
      <template #menu>
        <template v-for="(but, index) in _lay.schBtnMore">
          <var-cell v-if="index < _lay.schBtnMore.length - 1" class="main-menu-var-cell" @click="handleSchButImp(but.fCode)">
            {{ $t(but.label) }}
          </var-cell>
          <var-cell v-else style="text-align: center" @click="handleSchButImp(but.fCode)">
            {{ $t(but.label) }}
          </var-cell>
        </template>
      </template>
    </var-menu>
  </var-button-group>

  <!-- 查询条件 -->
  <var-popup v-model:show="dg.open" position="left" close-on-click-overlay class="szd__popup__wrapper_w">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button v-if="_lay && _lay.layout && _lay.layout.report" label="变式" @click="handleEventImp('$layout')" />
        <szd-button label="查询" @click="handleEventImp('$search')" />
        <szd-button label="重置" @click="handleEventImp('$reset')" />
      </var-button-group>
    </div>

    <!-- 查询条件 -->
    <div class="szd__popup__main">
      <div v-for="(fCat, index) in _lay.schCat" class="row">
        <szd-sch
          v-model="_modelValue[fCat.field]"
          :type="fCat.type"
          :label="fCat.label"
          :placeholder="fCat.placeholder"
          :numDot="fCat.numDot"
          :numDec="fCat.numDec"
          :help="fCat.help"
          :noTo="fCat.noTo"
          :noExt="fCat.noExt"
          :disabled="fCat.disabled"
          :readonly="fCat.readonly"
          :clearable="fCat.clearable"
          :clearSpace="fCat.clearSpace"
          :selectOpt="fCat.selectOpt"
          :whereOpt="fCat.whereOpt"
          :required="fCat.required" />
      </div>
    </div>

    <!-- 变式管理 -->
    <schLayout ref="refSchLayout" v-model="_modelValue" v-model:lay="_lay" />
  </var-popup>
</template>

<script setup>
  import { computed, ref, watch, nextTick, onBeforeMount } from "vue";
  import _ from "lodash";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { initSchLay } from "./js/schParam";
  import schLayout from "./layout/schLayout.vue";
  import { useRoute } from "vue-router";

  const props = defineProps({
    //高级搜索数据
    modelValue: {
      type: Object,
      required: true,
      default: {}
    },
    //高级搜索字段
    schLay: {
      type: Object,
      default: {}
    },
    //自动获取url参数
    autoQuery: {
      type: Boolean,
      default: true
    }
  });
  const emit = defineEmits(["handleEvent", "update:modelValue"]);
  const refSchLayout = ref(); //保存变式

  //窗口对象
  const dg = ref({
    open: false,
    menuOpen: false
  });

  //表格布局
  const _lay = ref();
  watch(
    () => props.schLay,
    () => {
      _lay.value = initSchLay(props.schLay);
    },
    { deep: true, immediate: true }
  );

  //表格数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });

  //初始化数据记录
  const _modelValueOld = ref();

  //当前路由
  const route = useRoute();

  //解析url参数
  onBeforeMount(() => {
    if (props.autoQuery) initData();
  });

  const initData = () => {
    const queryKey = Object.keys(route.query);
    if (queryKey.length > 0) {
      for (let i = 0; i < _lay.value.schCat.length; i++) {
        const item = _lay.value.schCat[i];
        if (!queryKey.includes(item.field)) continue;
        if (!_modelValue.value[item.field]) _modelValue.value[item.field] = [];
        if (!_modelValue.value[item.field].find(r => r.option === "EQ" && r.low === route.query[item.field])) {
          _modelValue.value[item.field].push({
            type: item.type,
            option: "EQ",
            low: route.query[item.field],
            high: undefined
          });
        }
      }
    }
    _modelValueOld.value = _.cloneDeep(_modelValue.value);
  };

  //打开搜索条件
  const handleSchButImp = fCode => {
    if (fCode === "$search") {
      dg.value.open = true;
    } else if (fCode === "$reset") {
      reset();
    } else {
      emit("handleEvent", fCode);
    }
  };

  //按钮回调事件
  const handleEventImp = fCode => {
    switch (fCode) {
      case "$layout":
        refSchLayout.value.callInitData();
        break;
      case "$reset":
        reset();
        break;
      case "$search":
        //检查数据
        if (checkRanges()) {
          emit("handleEvent", fCode);
          dg.value.open = false;
        }
        break;
    }
  };

  //检查必输
  const checkRanges = () => {
    for (let i = 0; i < _lay.value.schCat.length; i++) {
      const item = _lay.value.schCat[i];
      if (item.required) {
        if (!_modelValue.value[item.field] || _modelValue.value[item.field].length === 0) {
          $m("CORE_CLIENT.E078", item.label); //字段 & 为必输
          return false;
        }
      }
    }
    return true;
  };

  //重置数据
  const reset = () => {
    _modelValue.value = _.cloneDeep(_modelValueOld.value);
    nextTick(() => {
      if (_lay.value.layout.reset) {
        handleEventImp("$search");
      } else {
        handleEventImp("$reset");
      }
    });
  };
</script>