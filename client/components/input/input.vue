<template>
  <div v-if="!_fst.hide" class="main-form-item" :class="{ 'main-form-item-required': required }" ref="refInputDiv">
    <div v-if="label" class="main-form-item-label">
      <div :class="['label', _fst.disabled ? 'label-disabled' : '']">{{ _label }}</div>
    </div>
    <var-input
      ref="inputRef"
      v-model="_modelValue"
      :placeholder="$t(placeholder)"
      :hint="label ? false : hint"
      :maxlength="maxlength"
      :readonly="_fst.readonly"
      :disabled="_fst.disabled"
      :clearable="clearable && !_fst.disabled"
      :oninput="handleOninput"
      @keydown.enter="enter ? handleKeydownEnter() : ''"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
      :class="handleClass()"
      style="width: 100%">
      <template #append-icon>
        <var-icon v-if="showHelp && !_fst.disabled" name="magnify" @click="_fst.disabled ? '' : handleHelp()" size="20" style="padding-left: 5px" />
      </template>
      <template v-if="desc" #extra-message>
        {{ desc }}
      </template>
    </var-input>
    <!-- 自动补全 -->
    <var-menu
      v-if="_autocomplete && _autocompleteVisible"
      v-model:show="_autocompleteVisible"
      placement="bottom"
      :reference="refInputDiv"
      same-width
      @click-outside="handleAutocompleteClose">
      <template #menu>
        <var-cell v-for="item in _autocompleteList" @click="handleAutocompleteSelect(item)" class="l-auto-complete-row">
          <span style="padding-right: 5px">{{ item.svalue }}</span>
          <span>{{ item.sname }}</span>
        </var-cell>
      </template>
    </var-menu>
  </div>
</template>

<script setup>
  import { computed, ref, nextTick, watch, onMounted, onUnmounted } from "vue";
  import { Snackbar } from "@varlet/ui";
  import _ from "lodash";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { addThousandSeparator, removeThousandSeparator } from "pixiu-number-toolkit";
  import { szdSh } from "../searchHelp/serchHelp";
  import szdComp from "../../common/utils/component";
  import store from "~store";
  import { getAutocompleteList } from "../../components/api/searchHelp";

  const props = defineProps({
    modelValue: {
      type: [String, Number]
    },
    //类型支持string,number
    type: {
      type: String,
      default: "string"
    },
    numDot: {
      type: Boolean,
      default: false
    },
    numDec: {
      type: [Number, String]
    },
    numMax: {
      type: Number
    },
    numMin: {
      type: Number
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
    maxlength: {
      type: [Number, String]
    },
    showHelp: {
      type: [Boolean, String],
      default: false
    },
    help: {
      type: Object
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
    clickColor: {
      type: Boolean,
      default: false
    },
    align: {
      type: String
    },
    noZero: {
      type: Boolean,
      default: false
    },
    format: {
      type: [Object, String]
    },
    enter: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    desc: {
      type: String,
      default: ""
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  const inputRef = ref();
  const refInputDiv = ref();
  //定义事件
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "help", "click", "keydownEnter"]);
  //值数据
  const _modelValue = ref();
  //标签名称
  const _label = computed(() => {
    if (props.label) return props.label;
    return props.placeholder;
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
  });
  //对齐方式 文本默认左对齐，数值默认右对齐
  const _align = computed(() => {
    let alignTemp = "left";
    if (props.align) {
      alignTemp = props.align;
    } else if (props.type === "number") {
      alignTemp = "right";
    }
    return alignTemp;
  });
  //数值不显示0
  const _noZero = computed(() => {
    return props.disabled || props.readonly ? props.noZero : true;
  });
  //数据格式化
  const _format = computed(() => {
    if (props.disabled || props.readonly || !props.format || props.type === "number") {
      return false;
    } else {
      return setFormatObj();
    }
  });
  //自动补全
  const _autocomplete = computed(() => {
    if (props.type === "string" && props.showHelp && props.help && props.help.a && !_fst.value.disabled && !_fst.value.readonly) {
      if (store.state.loginUser && store.state.loginUser.autocomplete.includes(props.help.a)) return true;
    }
    return false;
  });
  const _autocompleteVisible = ref(false);
  const _autocompleteList = ref([]);
  let debounceTimer = null;

  //样式
  const handleClass = () => {
    let _class = [];
    if (_align.value === "center") {
      _class.push("align-c");
    } else if (_align.value === "right") {
      _class.push("align-r");
    }
    if (props.clickColor && !props.disabled) _class.push("div-click");
    if (props.desc) {
      _class.push("div-extra-desc");
    } else {
      _class.push("div-extra-none");
    }
    return _class;
  };

  //监听值数据
  watch(
    () => props.modelValue,
    () => {
      if (props.type === "number" && props.modelValue !== undefined && props.modelValue !== null) {
        _modelValue.value = props.modelValue.toString();
      } else {
        _modelValue.value = props.modelValue;
      }
      if (props.type === "number") {
        nextTick(() => {
          setNumFormat();
        });
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    if (props.type === "number" && props.numDot) {
      window.addEventListener("resize", setListenerReSize);
    }
  });

  onUnmounted(() => {
    if (props.type === "number" && props.numDot) {
      window.removeEventListener("resize", setListenerReSize);
    }
  });

  //设置屏幕变化监听
  const setListenerReSize = () => {
    setTimeout(() => {
      setNumFormat();
    }, 0);
  };

  //设置千分位和小数位
  const setNumFormat = () => {
    if (props.type === "number") {
      if (_noZero.value && (!_modelValue.value || _modelValue.value == 0)) {
        setTimeout(() => {
          if (inputRef.value) inputRef.value.el.value = "";
        }, 0);
      } else {
        // 小数位设置
        if (!isNaN(props.numDec) && props.numDec >= 0 && props.numDec !== null && props.numDec !== undefined && !isNaN(_modelValue.value)) {
          _modelValue.value = Number(_modelValue.value).toFixed(props.numDec);
        }
        // 千分位设置
        if (props.numDot && _modelValue.value) {
          setTimeout(() => {
            if (inputRef.value && !inputRef.value.el.value.includes(",")) {
              inputRef.value.el.value = addThousandSeparator(inputRef.value.el.value);
            }
          }, 0);
        }
      }
    }
  };
  //顺序1.当选择器的输入框获得焦点时触发
  const handleFocus = e => {
    if (_fst.value.disabled || _fst.value.readonly) return;
    //数值型
    if (props.type === "number" && e && e.target && e.target.value) {
      //去除千分位符
      if (props.numDot && e.target.value && e.target.value.includes(",")) {
        e.target.value = removeThousandSeparator(e.target.value);
      }
      //格式化小数位
      if (!isNaN(props.numDec) && props.numDec >= 0 && e.target.value) {
        e.target.value = Number(e.target.value).toFixed(props.numDec);
      }
      //赋值
      _modelValue.value = e.target.value;
    }
    emit("focus", e);
  };
  //顺序2.原生输入事件
  const handleOninput = e => {
    if (props.type === "number") {
      //包含,直接替换
      e.target.value = e.target.value.replace(/,/g, "");
      // 非输入.和-和数字 || 自动恢复数据 检测2个. || 检测2个以上负号 || 检测负号出现在非首位 || 负号后边不允许出现连续0
      if (
        /[^\-\d.]/.test(e.target.value) ||
        /(\.\d*)\./.test(e.target.value) ||
        /\-{2,}/.test(e.target.value) ||
        /(\d+|\.)-/.test(e.target.value) ||
        /-(0){2,}/.test(e.target.value)
      ) {
        e.target.value = _modelValue.value;
      } else {
        _modelValue.value = e.target.value; //赋值
      }
    } else {
      if (_format.value && !_format.value.error && !_format.value.regex.test(e.target.value) && !_autocomplete.value) {
        e.target.value = _modelValue.value;
      } else {
        _modelValue.value = e.target.value; //赋值
      }
    }
  };
  //顺序4.文本输入事件
  const handleInput = v => {
    nextTick(() => {
      emit("input", v);
    });
    //防抖触发
    if (_autocomplete.value) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        handleAutocompleteQueryAsync(v);
      }, 400);
    }
  };
  //顺序5.更改事件
  const handleChange = v => {
    if (_autocompleteVisible.value) return;
    if (props.type === "number") {
      let val = v;
      //包含,直接替换
      val = val.replace(/,/g, "");
      //检查数据 非输入.和-和数字 || 自动恢复数据 检测2个. || 检测2个以上负号 || 检测负号出现在非首位 || 负号后边不允许出现连续0
      if (/[^\-\d.]/.test(val) || /(\.\d*)\./.test(val) || /\-{2,}/.test(val) || /(\d+|\.)-/.test(val) || /-(0){2,}/.test(val)) {
        $m("CORE_CLIENT.E070", val); //数据 & 格式错误
        val = "0";
      }
      //检查大小
      if (props.numMax !== undefined && props.numMax !== null && !isNaN(props.numMax) && Number(val) > Number(props.numMax)) {
        //检查数值是否超过最大值
        $m("CORE_CLIENT.E071", props.numMax); //最大值为 &
        val = props.numMax;
      }
      if (props.numMin !== undefined && props.numMin !== null && !isNaN(props.numMin) && Number(val) < Number(props.numMin)) {
        //检查数值是否超过最小值
        $m("CORE_CLIENT.E072", props.numMin); //最小值为 &
        val = props.numMin;
      }
      //最多允许输入的小数位
      if (!isNaN(props.numDec) && props.numDec >= 0) {
        if (new RegExp("\\.\\d{" + (props.numDec + 1) + ",}$").test(val)) {
          $m("CORE_CLIENT.E073", props.numDec); //小数位超过 & 位，数据被更正
          val = Number(val).toFixed(props.numDec);
        }
      }
      //字符串格式化为数字
      _modelValue.value = val;
      val = Number(val);
      //更新数据
      emit("update:modelValue", val);
      emit("change", val);
    } else {
      if (_format.value) {
        if (!_format.value.regex.test(v)) {
          Snackbar.error(_format.value.errMsg);
          v = "";
          if (inputRef.value) inputRef.value.el.value = "";
        }
        if (v) {
          if (_format.value.convert === "upper") {
            v = v.toUpperCase();
          } else if (_format.value.convert === "lower") {
            v = v.toLowerCase();
          }
        }
        _modelValue.value = v;
      }
      //更新数据
      emit("update:modelValue", v);
      emit("change", v);
    }
  };
  //顺序6.当选择器的输入框失去焦点时触发,不对数据变更返回到存储对象
  const handleBlur = e => {
    if (_fst.value.disabled || _fst.value.readonly) return;
    // 数值类型进行检查
    if (props.type === "number") {
      nextTick(() => {
        if (e.target.value && !e.target.value.includes(",")) {
          if (_noZero.value && !Number(_modelValue.value)) {
            e.target.value = "";
          } else {
            //添加小数位，与千分位符顺序不能错
            if (!isNaN(props.numDec) && props.numDec >= 0) {
              e.target.value = Number(e.target.value).toFixed(props.numDec);
            } else {
              e.target.value = Number(e.target.value);
            }
            //设置千分位付
            if (props.numDot && e.target.value) {
              e.target.value = addThousandSeparator(e.target.value);
            }
          }
        }
      });
    }
    emit("blur", e);
  };

  //调用搜索帮助事件
  const handleHelp = () => {
    if (inputRef.value) inputRef.value.blur();
    setTimeout(() => {
      if (!props.help || !props.help.a || props.showHelp === "A") {
        emit("help");
      } else {
        szdSh(props.help).then(res => {
          if (res && res.data.length > 0) {
            //未给数据对象,此处直接复制
            if (!props.help.b || !props.help.c) {
              handleChange(res.chgValue);
            } else if (res.chgFlag) {
              setTimeout(() => {
                handleChange(_modelValue.value);
              }, 0);
            }
          }
        });
      }
    }, 0);
  };

  //点击事件
  const handleClick = v => {
    if (v && v.target && v.target.tagName === "I" && v.target.className.includes("var-field-decorator__clear-icon")) {
      handleChange("");
    } else {
      emit("click", v);
    }
  };

  //回车事件
  const handleKeydownEnter = () => {
    setTimeout(() => {
      emit("keydownEnter");
    });
  };

  //设置数据检查正则规则
  const setFormatObj = () => {
    if (_.isObject(props.format)) {
      if (props.format.regex) {
        //{regex正则 convert：转化大写和小写upper、lower  error：true 报错 false 替换和报错 errMsg：报错的消息}
        return setFormatObjJson(props.format.regex, props.format.convert, props.format.error, props.format.errMsg);
      } else {
        return false;
      }
    } else {
      switch (props.format) {
        case "upper": //大写  字母、数字、下划线、中划线、点
          return setFormatObjJson("^[A-Za-z0-9._-]*$", "upper", false, $t("请输入字母、数字、下划线、中划线、点"));
        case "upper_": //大写  字母、数字、下划线、中划线
          return setFormatObjJson("^[A-Za-z0-9_-]*$", "upper", false, $t("请输入字母、数字、下划线、中划线"));
        case "upperAlp": //大写  字母
          return setFormatObjJson("^[A-Za-z]*$", "upper", false, $t("请输入字母"));
        case "upperAlpNum": //大写  字母、数字、
          return setFormatObjJson("^[A-Za-z0-9]*$", "upper", false, $t("请输入字母和数字"));
        case "lower": //小写  字母、数字、下划线、中划线、点
          return setFormatObjJson("^[A-Za-z0-9._-]*$", "lower", false, $t("请输入字母、数字、下划线、中划线、点"));
        case "lower_": //小写  字母、数字、下划线、中划线
          return setFormatObjJson("^[A-Za-z0-9_-]*$", "lower", false, $t("请输入字母、数字、下划线、中划线"));
        case "lowerAlp": //小写  字母
          return setFormatObjJson("^[A-Za-z]*$", "lower", false, $t("请输入字母"));
        case "lowerAlpNum": //小写  字母、数字、
          return setFormatObjJson("^[A-Za-z0-9]*$", "lower", false, $t("请输入字母和数字"));
        case "num": //数字  数字
          return setFormatObjJson("^[0-9]*$", "", false, $t("请输入数字"));
        case "alp": //字母
          return setFormatObjJson("^[A-Za-z0-9]*$", "", false, $t("请输入字母"));
        case "alpNum": //字母、数字
          return setFormatObjJson("^[A-Za-z0-9]*$", "", false, $t("请输入字母和数字"));
        default:
          return false;
      }
    }
  };
  const setFormatObjJson = (_regex, _convert, _error, _errMsg) => {
    return {
      regex: new RegExp(_regex),
      convert: ["upper", "lower"].includes(_convert) ? _convert : "",
      error: _.isBoolean(_error) ? _error : false,
      errMsg: _errMsg ? _errMsg : $t("数据格式错误")
    };
  };

  //自动补全-查询
  const handleAutocompleteQueryAsync = v => {
    _autocompleteVisible.value = false;
    _autocompleteList.value = [];
    if (v) {
      getAutocompleteList(props.help.a, v).then(res => {
        if (res && res.data && res.data.valList && res.data.valList.length > 0) {
          _autocompleteVisible.value = true;
          _autocompleteList.value = res.data.valList;
        }
      });
    }
  };
  //自动补全-选择
  const handleAutocompleteSelect = item => {
    if (props.help.b && props.help.j && props.help.j !== true) {
      props.help.b[props.help.j] = item.sname;
    }
    _autocompleteVisible.value = false;
    handleChange(item.svalue);
  };
  //自动补全关闭
  const handleAutocompleteClose = () => {
    _autocompleteVisible.value = false;
    handleChange(_modelValue.value);
  };
</script>
<style scoped lang="scss">
  .align-c {
    :deep(.var-input__input) {
      text-align: center;
    }
  }

  .align-r {
    :deep(.var-input__input) {
      text-align: right;
    }
  }

  :deep(.var-form-details) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :deep(.var-form-details__extra-message) {
    word-wrap: break-word;
    word-break: break-all;
  }

  .div-extra-desc {
    :deep(.var-form-details__extra-message) {
      text-align: left;
    }
  }

  .div-extra-none {
    :deep(.var-form-details) {
      display: none;
    }
  }

  .div-click {
    :deep(.var-input__input) {
      color: var(--button-primary-color);
    }
  }

  .l-auto-complete-row {
    display: flex;
    padding: 5px 10px;
    line-height: 1.5;
  }
</style>