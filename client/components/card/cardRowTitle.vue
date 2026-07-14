<template>
  <!-- 卡片显示内容 -->
  <div class="l-card-row-title">
    <div class="title-left">
      <span class="title-label-line" />
      <var-checkbox v-if="checkbox" v-model="_modelValue" :disabled="_fst.disabled" @change="emit('change')">
        <span v-text="_label" :class="{ 'title-label-required': required }" />
      </var-checkbox>
      <span v-else-if="_label" v-text="_label" :class="{ 'title-label-required': required }" />
      <szd-light v-if="lighted" :light="light" />
    </div>
    <div class="title-right">
      <var-icon v-if="btnCopy" name="content-copy" size="20px" :color="!_fst.disabled ? '#397bfe' : ''" @click="!_fst.disabled ? emit('copy') : ''" />
      <var-icon
        v-if="btnDelete"
        name="trash-can-outline"
        size="24px"
        :color="!_fst.disabled ? '#f5a623' : ''"
        @click="!_fst.disabled ? emit('delete') : ''" />
      <var-icon v-if="btnView" name="chevron-right" size="28px" color="#397bfe" @click="emit('view')" />
    </div>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    index: {
      type: [String, Number],
      default: 0
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    lighted: {
      type: Boolean,
      default: false
    },
    light: {
      type: [String, Number],
      default: ""
    },
    btnCopy: {
      type: Boolean,
      default: false
    },
    btnDelete: {
      type: Boolean,
      default: false
    },
    btnView: {
      type: Boolean,
      default: false
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
  const emit = defineEmits(["update:modelValue", "change", "copy", "delete", "view"]);
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //标签名称
  const _label = computed(() => {
    if (props.text) return props.text;
    if (props.label) return $t(props.label);
    if (props.index > 0) return $t("行号：") + props.index;
    return "";
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled);
  });
</script>
<style lang="scss" scoped>
  .l-card-row-title {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: var(--font-size);
    font-weight: 600;
    color: var(--field-decorator-placeholder-color);
    padding: 5px 0;

    .title-label-line {
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background-color: #2772ff;
      margin-right: 5px;
    }

    .title-label-required {
      position: relative;
      padding-right: 12px;
    }

    .title-label-required::after {
      content: "*";
      position: absolute;
      padding-left: 3px;
      font-size: 1.5em;
      line-height: 1.5em;
      color: #ff4949;
    }

    .title-left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .title-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-left: 10px;
      gap: 10px;
    }
  }
</style>