import _ from "lodash";
import { $t } from "../../../common/utils/globalConfig";

const const_type = ["string", "number", "boolean", "array", "date", "datetime", "time", "year", "month", "svg", "button"]; //数据类型
const const_type_align_center = ["boolean", "date", "datetime", "time", "year", "month"]; //数据类型-居中
const const_ctrlType = ["input", "input-number", "date", "time", "checkbox", "radio", "select", "textarea", "svg", "button"]; //控件类型
//工具类默认按钮
const const_btn_type = ["", "primary", "success", "warning", "danger", "info"];

//布局
export function initTableLay(layout, fieldCat) {
  let _lay = {
    layout: {}, //表格样式
    fCatCol: [] //列目录数组
  };
  //表格样式
  _lay.layout = tableLayout(layout);
  //表格列目录
  _lay.fCatCol = tableFCat(fieldCat, _lay.layout);

  return _lay;
}

//表格样式
function tableLayout(params) {
  return {
    showMode: ["0", "1"].includes(params.showMode) ? params.showMode : "0", //显示模式 0.table模式 1.card模式
    optionCell: params.optionCell, //控件控制，设置编辑状态
    viewMode: ["0", "1", "9"].includes(params.viewMode) ? params.viewMode : "0", //显示详情 0.不显示 1.显示标准 9.回调
    viewTitle: params.viewTitle, //详情字段
    selection: ["0", "1", "2"].includes(params.selection) ? params.selection : "0", //显示选择列 0.不显示 1.显示 2.显示固定
    pagination: ["0", "1", "2"].includes(params.pagination) ? params.pagination : "2" //分页方式 0.不分页 1.前端分页 2.后端分页
  };
}

//表格列设置
function tableFCat(fieldCat, layout) {
  let fCatCol = []; //列目录数组
  for (let i = 0; i < fieldCat.length; i++) {
    const item = fieldCat[i];
    //列字段键值尾款和重复检查
    if (!item.field || !item.label) {
      console.error("列字段代码field不能重复和为空，且列名称label不能为空:" + item.field);
      continue;
    }
    //添加列字段
    fCatCol.push(tableFCatItem(item, layout));
  }
  return fCatCol;
}

//表格列设置
function tableFCatItem(item, layout) {
  let fCat = {
    field: item.field, //字段
    label: item.label ? item.label : item.field, //列名称
    width: _.isNumber(item.width) ? item.width : undefined, //宽度
    align: undefined, //对齐方式:left center right
    detail: _.isBoolean(item.detail) ? item.detail : false, //详情
    //数据维护
    edit: _.isBoolean(item.edit) ? item.edit : item.type === "button", //编辑
    type: const_type.includes(item.type) ? item.type : "string", //数据类型
    numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
    numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
    noZero: item.type === "number" && _.isBoolean(item.noZero) ? item.noZero : false, //不输出0
    //控件类型
    ctrlType: const_ctrlType.includes(item.ctrlType) ? item.ctrlType : undefined, //控件类型
    ctrlParam: undefined, //控件参数（参数项参照各控件参数配置 disable readOnly 不能使用）
    //点击事件
    click: item.click ? item.click : false,
    //表头设置
    required: _.isBoolean(item.required) ? item.required : false, //必输
    //内部参数
    $SZDDot: false //内部参数-是否设置小数位和千分位
  };

  //翻译
  fCat.label = $t(fCat.label);

  //设置对齐方式
  if (["left", "center", "right"].includes(item.align)) {
    fCat.align = item.align;
  } else if (fCat.type === "number") {
    fCat.align = "right";
  } else if (const_type_align_center.includes(fCat.type)) {
    fCat.align = "center";
  }

  //是否使用千分位和小数位转换
  if (fCat.numDot || !isNaN(fCat.numDec)) {
    fCat.$SZDDot = true;
  }

  //点击事件
  if (fCat.click && ["boolean", "array", "button"].includes(fCat.type)) {
    fCat.click = false;
  }

  //控件设置
  if (fCat.ctrlType || fCat.edit || fCat.type === "button" || fCat.type === "svg") {
    setCtrl(fCat, item.ctrlParam);
  }

  return fCat;
}

//控件及参数设置
function setCtrl(fCat, ctrlParam) {
  //控件类型 ["string", "number", "boolean", "array", "date", "datetime", "time", "year", "month", "svg", "button"]
  switch (fCat.type) {
    case "string":
      if (!["input", "radio", "select", "textarea"].includes(fCat.ctrlType)) fCat.ctrlType = "input";
      break;
    case "number":
      if (!["input", "input-number", "radio", "select"].includes(fCat.ctrlType)) fCat.ctrlType = "input";
      break;
    case "boolean":
      fCat.ctrlType = "checkbox";
      break;
    case "array":
      fCat.ctrlType = "checkbox";
      break;
    case "time":
      fCat.ctrlType = "time";
      break;
    case "svg":
      fCat.ctrlType = "svg";
      break;
    case "button":
      fCat.ctrlType = "button";
      break;
    default:
      fCat.ctrlType = "date";
      break;
  }
  //控件参数 ["input", "input-number", "date", "time", "checkbox", "radio", "select", "textarea", "svg", "button"];
  switch (fCat.ctrlType) {
    case "input":
      setCtrlInput(fCat, ctrlParam);
      break;
    case "input-number":
      setCtrlInputNumber(fCat, ctrlParam);
      break;
    case "time":
      setCtrlTime(fCat, ctrlParam);
      break;
    case "checkbox":
      setCtrlCheckbox(fCat, ctrlParam);
      break;
    case "radio":
      setCtrlRadio(fCat, ctrlParam);
      break;
    case "select":
      setCtrlSelect(fCat, ctrlParam);
      break;
    case "textarea":
      setCtrlTextarea(fCat, ctrlParam);
      break;
    case "svg":
      setCtrlSvg(fCat, ctrlParam);
      break;
    case "button":
      setCtrlButton(fCat, ctrlParam);
      break;
    default:
      setCtrlDate(fCat, ctrlParam);
      break;
  }
}

//控件及参数设置 input
function setCtrlInput(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    type: fCat.type, //类型支持string,number
    numDot: fCat.numDot, //千分位符
    numDec: fCat.numDec, //类型支持string,number
    numMax: _.isNumber(ctrlParam.numMax) ? ctrlParam.numMax : undefined, //最大值
    numMin: _.isNumber(ctrlParam.numMin) ? ctrlParam.numMin : undefined, //最小值
    placeholder: ctrlParam.placeholder, //占位符
    maxlength: _.isNumber(ctrlParam.maxlength) ? ctrlParam.maxlength : undefined, //最大长度
    showHelp: _.isBoolean(ctrlParam.showHelp) ? ctrlParam.showHelp : false, //显示搜索帮助

    //仅在Table中使用，如果baseField为空，则回调事件
    baseField: ctrlParam.baseField, //基础字段
    baseMapping: ctrlParam.baseMapping, //字段映射 数组 ['字段(目标)-字段(源)','字段(目标和源相同)]
    baseSelect: ctrlParam.baseSelect, //查询条件，数组 [['字段',"row.字段（row取行值）"],['字段',"值"]]

    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable, //清空按钮
    clickColor: fCat.click, //单击颜色
    align: fCat.align, //对齐方式
    noZero: fCat.noZero, //不输出0
    format: ctrlParam.format, //数据格式化
    scan: _.isBoolean(ctrlParam.scan) ? ctrlParam.scan : false, //扫描
    descField: ctrlParam.descField ? ctrlParam.descField : "" //描述字段
  };
}

//控件及参数设置 input-number
function setCtrlInputNumber(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    max: _.isNumber(ctrlParam.max) ? ctrlParam.max : Infinity, //最大值
    min: _.isNumber(ctrlParam.min) ? ctrlParam.min : -Infinity, //最小值
    precision: fCat.numDec, //精度
    step: _.isNumber(ctrlParam.step) ? ctrlParam.step : 1, //步进
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
  };
}

//控件及参数设置 date
function setCtrlDate(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    type: fCat.type, //类型
    placeholder: ctrlParam.placeholder, //占位符
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable //清空按钮
  };
}

//控件及参数设置 time
function setCtrlTime(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable //清空按钮
  };
}

//控件及参数设置 复选框 checkbox
function setCtrlCheckbox(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  if (fCat.type === "boolean") {
    fCat.ctrlParam = {
      disabled: !fCat.edit, //不可用
      hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
    };
  } else {
    fCat.ctrlParam = {
      placeholder: ctrlParam.placeholder, //占位符
      baseField: ctrlParam.baseField, //多复选框 基础字段
      baseArr: ctrlParam.baseArr, //多复选框 数组[{svalue:"",sname:""}]
      max: ctrlParam.max, //多复选框 最大选择数
      min: ctrlParam.min, //多复选框 最小选择数
      checkboxAll: ctrlParam.checkboxAll, //多复选框 显示全选 true 显示在上边 left 在左边
      disabled: !fCat.edit, //不可用
      hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
    };
  }
}

//控件及参数设置 单选框 radio
function setCtrlRadio(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    baseField: ctrlParam.baseField, //基础字段
    baseArr: ctrlParam.baseArr, //数组
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    first: _.isBoolean(ctrlParam.first) ? ctrlParam.first : false //值为空默认第一个
  };
}

//控件及参数设置 下拉框 select
function setCtrlSelect(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    baseField: ctrlParam.baseField, //基础字段
    baseArr: ctrlParam.baseArr, //数组
    baseSelect: ctrlParam.baseSelect, //查询条件
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false, //隐藏
    clearable: ctrlParam.clearable, //清空按钮
    placeholder: ctrlParam.placeholder, //占位符
    showKey: _.isBoolean(ctrlParam.showKey) ? ctrlParam.showKey : true, //显示Key值
    first: _.isBoolean(ctrlParam.first) ? ctrlParam.first : false //值为空默认第一个
  };
}

//控件及参数设置 textarea
function setCtrlTextarea(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    placeholder: ctrlParam.placeholder, //占位符
    maxlength: _.isNumber(ctrlParam.maxlength) ? ctrlParam.maxlength : "", //最大值
    rows: _.isNumber(ctrlParam.rows) ? ctrlParam.rows : 1, //显示行数
    readonly: ctrlParam.readonly, //仅显示
    disabled: !fCat.edit, //不可用
    hide: _.isBoolean(ctrlParam.hide) ? ctrlParam.hide : false //隐藏
  };
}

//控件及参数设置 svg
function setCtrlSvg(fCat, ctrlParam) {
  if (!ctrlParam) ctrlParam = {};
  fCat.ctrlParam = {
    name: ctrlParam.name, //svg代码
    nameField: ctrlParam.nameField, //svg代码-动态
    fixed: _.isBoolean(ctrlParam.fixed) ? ctrlParam.fixed : false, //是否框架内置
    color: ctrlParam.color, //颜色
    colorField: ctrlParam.colorField, //动态颜色
    fontSize: fCat.fontSize, //字体大小
    labelField: ctrlParam.labelField, //显示标签
    clicked: _.isBoolean(ctrlParam.clicked) ? ctrlParam.clicked : false //是否点击事件
  };
}

//控件及参数设置 button
function setCtrlButton(fCat, ctrlParam) {
  if (ctrlParam && !_.isArray(ctrlParam)) {
    console.error("按钮列的参数应为数组" + fCat.field);
    return;
  }
  fCat.ctrlParam = [];
  if (_.isArray(ctrlParam)) {
    for (let i = 0; i < ctrlParam.length; i++) {
      if (ctrlParam[i].fCode) {
        fCat.ctrlParam.push({
          fCode: ctrlParam[i].fCode, //功能KEY
          label: ctrlParam[i].label ? ctrlParam[i].label : "", //功能名称
          type: const_btn_type.includes(ctrlParam[i].type) ? ctrlParam[i].type : "primary", //类型
          text: _.isBoolean(ctrlParam[i].text) ? ctrlParam[i].text : true, //是否为文字按钮
          link: _.isBoolean(ctrlParam[i].link) ? ctrlParam[i].link : true, //是否为连接按钮
          disabled: fCat.edit ? ctrlParam[i].disabled : true, //是否可用
          noAuth: _.isBoolean(ctrlParam[i].noAuth) ? ctrlParam[i].noAuth : false, //不控制权限
          detail: _.isBoolean(ctrlParam[i].detail) ? ctrlParam[i].detail : false, //详情
          color: ctrlParam[i].color, //按钮颜色
          hide: _.isBoolean(ctrlParam[i].hide) ? ctrlParam[i].hide : false //是否隐藏
        });
      }
    }
  }
}