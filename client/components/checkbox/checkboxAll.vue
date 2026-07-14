<template>
  <var-checkbox
    v-if="!_fst.hide"
    v-model="_checkBox.checkAll"
    :indeterminate="_checkBox.isIndeterminate"
    :disabled="_fst.disabled"
    @change="handleChange">
    {{ label ? $t(label) : "" }}
  </var-checkbox>
</template>
<script setup>
  import { computed, nextTick, ref, watch } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    label: {
      type: [String, Boolean],
      default: "全选"
    },
    disabled: {
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
  const emit = defineEmits(["selection-change", "update:data"]);
  //全选参数
  const _checkBox = ref({ checkAll: false, isIndeterminate: false });
  //值数据
  const _dataList = computed({
    get: () => props.data,
    set: val => {
      emit("update:data", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });

  //监听值数据
  watch(
    () => props.data.map(item => item.$SZDCHECKBOX),
    () => {
      nextTick(() => {
        setSelection();
      });
    },
    { immediate: true }
  );

  //更改事件
  const handleChange = v => {
    nextTick(() => {
      for (let i = 0; i < _dataList.value.length; i++) {
        _dataList.value[i].$SZDCHECKBOX = _checkBox.value.checkAll;
      }
    });
  };

  //设置选中行
  const setSelection = () => {
    let count = 0;
    let selectionRows = [];
    for (let i = 0; i < _dataList.value.length; i++) {
      if (_dataList.value[i].$SZDCHECKBOX) {
        count++;
        selectionRows.push(_dataList.value[i]);
      }
    }
    _checkBox.value.isIndeterminate = count > 0 && count < _dataList.value.length;
    _checkBox.value.checkAll = count > 0 && count === _dataList.value.length;
    emit("selection-change", selectionRows);
  };
</script>