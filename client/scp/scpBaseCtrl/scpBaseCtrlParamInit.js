import _ from "lodash";
import { c_colParam, c_colCtrlParam, c_schCatParam, c_tabCatParam } from "./scpBaseCtrlParamBean";

/**
 * 初始化控件参数
 */
export function ctrlSetParamInit(col) {
  //初始化ctrl数据
  initCtrlType(col);
  //初始化upd信息
  initCtrlUpdStatus(col);
  //初始化upd数据类型
  initCtrlUpdFieldType(col);
  //初始化upd控件类型
  initCtrlUpdCtrlType(col);
  //初始化udp自动填写
  initCtrlUpdFieldAuto(col);
  //控件字段赋值
  setCtrlFieldMove(col);
  //控件字段映射关系
  setCtrlFieldBaseMp(col);
  //表格字段
  setCtrlTabCatParam(col);
  //查询字段
  setCtrlSchCatParam(col);
}

/**
 * 初始化ctrl类型和参数信息
 */
function initCtrlType(col) {
  //对象未初始化，进行初始化
  if (!col.tabCatParam) col.tabCatParam = {}; //表格字段参数
  if (!col.schCatParam) col.schCatParam = {}; //查询字段参数
  if (!col.baseParam) col.baseParam = {}; //基础字段
  if (!col.checkParam) col.checkParam = {}; //数据检查
  if (!col.moveParam) col.moveParam = {}; //数据赋值
  if (!col.clickParam) col.clickParam = {}; //点击穿透
  if (col.ctrlType) return;
  //控件类型
  col["ctrlType"] = ""; //控件类型
  //控件初始化
  if (col.fieldType === "string" || col.fieldType === "number") {
    col.ctrlType = "input";
  } else if (col.fieldType === "boolean") {
    col.ctrlType = "checkbox";
  } else if (col.fieldType === "date") {
    col.ctrlType = "date";
  } else if (col.fieldType === "datetime") {
    col.ctrlType = "date";
  } else if (col.fieldType === "month") {
    col.ctrlType = "month";
  } else if (col.fieldType === "year") {
    col.ctrlType = "year";
  } else if (col.fieldType === "time") {
    col.ctrlType = "time";
  }
  col["ctrlParam"] = _.cloneDeep(c_colCtrlParam.val);
}

/**
 * 初始化ctrl更新upd状态 true是不编辑，false是可编辑
 */
function initCtrlUpdStatus(col) {
  col["$upd"] = _.cloneDeep(c_colParam.upd); //设置状态初始化

  if (!col.fieldCodeDb) {
    col.$upd.fieldLen = false;
    if (col.fieldType === "number") {
      col.$upd.fieldPos = false;
    } else {
      col.$upd.fieldPos = true;
    }
    col.$upd.fieldCache = true;
    col.$upd.fieldSch = true;
  }
}

/**
 * 设置数据类型-根据数据类型设置允许的数据类型数组
 */
function initCtrlUpdFieldType(col) {
  col.$upd.fieldTypeArr = [];
  const _type = [
    { svalue: "string", sname: "字符串" },
    { svalue: "number", sname: "数值" },
    { svalue: "boolean", sname: "布尔型" },
    { svalue: "date", sname: "日期类型YYYY-MM-DD" },
    { svalue: "datetime", sname: "日期时间类型YYYY-MM-DD HH:mm:ss" },
    { svalue: "month", sname: "年月YYYY-MM" },
    { svalue: "year", sname: "年YYYY" },
    { svalue: "time", sname: "时间类型HH:mm:ss" },
    { svalue: "array", sname: "数组(多复选框)" }
  ];

  switch (col.fieldTypeDb) {
    case "string":
      col.$upd.fieldTypeArr.push(_type[0]);
      col.$upd.fieldTypeArr.push(_type[8]);
      break;
    case "number":
      col.$upd.fieldTypeArr.push(_type[1]);
      break;
    case "boolean":
      col.$upd.fieldTypeArr.push(_type[2]);
      break;
    case "date":
    case "datetime":
      col.$upd.fieldTypeArr.push(_type[3]);
      col.$upd.fieldTypeArr.push(_type[4]);
      col.$upd.fieldTypeArr.push(_type[5]);
      col.$upd.fieldTypeArr.push(_type[6]);
      break;
    case "year":
      col.$upd.fieldTypeArr.push(_type[6]);
      break;
    case "time":
      col.$upd.fieldTypeArr.push(_type[7]);
      break;
  }

  if (col.$upd.fieldTypeArr.length > 1) {
    col.$upd.fieldType = false;
  } else {
    col.$upd.fieldType = true;
  }
}

/**
 * 设置控件类型-根据数据类型设置允许的控件类型
 */
function initCtrlUpdCtrlType(col) {
  col.$upd.ctrlTypeArr = [];
  const _ctrl = [
    { svalue: "input", sname: "常规输入框" },
    { svalue: "input-number", sname: "数值输入框" },
    { svalue: "date", sname: "日期输入框" },
    { svalue: "time", sname: "时间输入框" },
    { svalue: "checkbox", sname: "复选框输入框" },
    { svalue: "radio", sname: "单选框输入框" },
    { svalue: "select", sname: "下拉框输入框" },
    { svalue: "textarea", sname: "文本域输入框" },
    { svalue: "password", sname: "密码框" },
    { svalue: "upload", sname: "上传" }
  ];

  switch (col.fieldType) {
    case "string":
      col.$upd.ctrlTypeArr.push(_ctrl[0]);
      col.$upd.ctrlTypeArr.push(_ctrl[5]);
      col.$upd.ctrlTypeArr.push(_ctrl[6]);
      col.$upd.ctrlTypeArr.push(_ctrl[7]);
      col.$upd.ctrlTypeArr.push(_ctrl[8]);
      col.$upd.ctrlTypeArr.push(_ctrl[9]);
      break;
    case "number":
      col.$upd.ctrlTypeArr.push(_ctrl[0]);
      col.$upd.ctrlTypeArr.push(_ctrl[1]);
      col.$upd.ctrlTypeArr.push(_ctrl[5]);
      col.$upd.ctrlTypeArr.push(_ctrl[6]);
      break;
    case "boolean":
      col.$upd.ctrlTypeArr.push(_ctrl[4]);
      break;
    case "date":
    case "datetime":
    case "month":
    case "year":
      col.$upd.ctrlTypeArr.push(_ctrl[2]);
      break;
    case "time":
      col.$upd.ctrlTypeArr.push(_ctrl[3]);
      break;
    case "array":
      col.$upd.ctrlTypeArr.push(_ctrl[4]);
      break;
  }

  if (col.$upd.ctrlTypeArr.length > 0 && !col.$upd.ctrlTypeArr.find(r => r.svalue === col.ctrlType)) {
    col.ctrlType = col.$upd.ctrlTypeArr[0].svalue;
  }

  if (col.$upd.ctrlTypeArr.length > 1) {
    col.$upd.ctrlType = false;
  } else {
    col.$upd.ctrlType = true;
  }
}

/**
 * 自动填写-根据数据类型设置允许的规则
 */
function initCtrlUpdFieldAuto(col) {
  col.$upd.fieldAuto = true;
  col.$upd.fieldAutoArr = [];
  const _auto = [
    { svalue: "A", sname: "自动生成行号" },
    { svalue: "B", sname: "删除标记" },
    { svalue: "C", sname: "创建时间" },
    { svalue: "D", sname: "创建人" },
    { svalue: "E", sname: "修改时间" },
    { svalue: "F", sname: "修改人" },
    { svalue: "G", sname: "唯一Key值-随机生成" },
    { svalue: "H", sname: "唯一Key值-号码对象" }
  ];

  switch (col.fieldType) {
    case "string":
      if (col.ctrlType === "input") {
        col.$upd.fieldAuto = false;
        col.$upd.fieldAutoArr.push(_auto[3]);
        col.$upd.fieldAutoArr.push(_auto[5]);
        col.$upd.fieldAutoArr.push(_auto[6]);
        col.$upd.fieldAutoArr.push(_auto[7]);
      }
      break;
    case "boolean":
      col.$upd.fieldAuto = false;
      col.$upd.fieldAutoArr.push(_auto[1]);
      break;
    case "datetime":
      col.$upd.fieldAuto = false;
      col.$upd.fieldAutoArr.push(_auto[2]);
      col.$upd.fieldAutoArr.push(_auto[4]);
      break;
  }

  if (col.$upd.fieldAutoArr.length === 0) {
    col.$upd.fieldAuto = true;
    col.$upd.fieldAutoArr = _auto;
    col.fieldAuto = "";
  } else if (!col.$upd.fieldAutoArr.find(r => r.svalue === col.fieldAuto)) {
    col.fieldAuto = "";
  }
  if (col.fieldAuto !== "H") {
    col.fieldAutoNumo = "";
    col.fieldAutoNumoName = "";
  }
}

/**
 * 设置控件字段-赋值
 */
function setCtrlFieldMove(col) {
  const _ctrlCurr = _.cloneDeep(col.ctrlParam);
  col.ctrlParam = _.cloneDeep(c_colCtrlParam.val); //设置值初始化
  col.$upd.ctrlParam = _.cloneDeep(c_colCtrlParam.upd); //设置状态初始化

  switch (col.ctrlType) {
    case "input":
      setCtrlInput(col, _ctrlCurr);
      break;
    case "input-number":
      setCtrlInputNumber(col, _ctrlCurr);
      break;
    case "date":
      setCtrlDate(col, _ctrlCurr);
      break;
    case "time":
      setCtrlTime(col, _ctrlCurr);
      break;
    case "checkbox":
      setCtrlCheckbox(col, _ctrlCurr);
      break;
    case "radio":
      setCtrlRadio(col, _ctrlCurr);
      break;
    case "select":
      setCtrlSelect(col, _ctrlCurr);
      break;
    case "textarea":
      setCtrlTextarea(col, _ctrlCurr);
      break;
    case "password":
      setCtrlPassword(col, _ctrlCurr);
      break;
    case "upload":
      setCtrlUpload(col, _ctrlCurr);
      break;
  }
  //form和col参数
  setCtrlFormCol(col, _ctrlCurr);
}

function setCtrlInput(col, _ctrlCurr) {
  if (col.fieldType === "number") {
    col.$upd.ctrlParam.numDot = false; //千分位符
    col.ctrlParam.numDot = _ctrlCurr.numDot;
    col.$upd.ctrlParam.numDec = false; //小数位数
    col.ctrlParam.numDec = _ctrlCurr.numDec;
    col.$upd.ctrlParam.numMax = false; //最大值
    col.ctrlParam.numMax = _ctrlCurr.numMax;
    col.$upd.ctrlParam.numMin = false; //最小值
    col.ctrlParam.numMin = _ctrlCurr.numMin;
    col.$upd.ctrlParam.noZero = false; //不显示0
    col.ctrlParam.noZero = _ctrlCurr.noZero;
  } else {
    col.$upd.ctrlParam.maxlength = false; //最大长度
    col.ctrlParam.maxlength = _ctrlCurr.maxlength;
    if (!col.fieldAuto) {
      col.$upd.ctrlParam.format = false; //格式化
      col.ctrlParam.format = _ctrlCurr.format;
      col.ctrlParam.formatObj = _ctrlCurr.formatObj;
    }
  }
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.clearable = false; //显示清除
  col.ctrlParam.clearable = _ctrlCurr.clearable;
  col.$upd.ctrlParam.align = false; //对齐方式
  col.ctrlParam.align = _ctrlCurr.align;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
  col.$upd.ctrlParam.descField = false; //描述
  col.ctrlParam.descField = _ctrlCurr.descField;
}

function setCtrlInputNumber(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.max = false; //最大值
  col.ctrlParam.max = _ctrlCurr.max;
  col.$upd.ctrlParam.min = false; //最小值
  col.ctrlParam.min = _ctrlCurr.min;
  col.$upd.ctrlParam.step = false; //步进
  col.ctrlParam.step = _ctrlCurr.step;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
}

function setCtrlDate(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.clearable = false; //显示清除
  col.ctrlParam.clearable = _ctrlCurr.clearable;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
}

function setCtrlTime(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.clearable = false; //显示清除
  col.ctrlParam.clearable = _ctrlCurr.clearable;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
}

function setCtrlCheckbox(col, _ctrlCurr) {
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  if (col.fieldType === "array") {
    col.$upd.ctrlParam.max = false; //最大值
    col.ctrlParam.max = _ctrlCurr.max;
    col.$upd.ctrlParam.min = false; //最小值
    col.ctrlParam.min = _ctrlCurr.min;
    col.$upd.ctrlParam.checkboxAll = false; //多复选框 显示全选
    col.ctrlParam.checkboxAll = _ctrlCurr.checkboxAll;
  }
}

function setCtrlRadio(col, _ctrlCurr) {
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.first = false; //默认首个
  col.ctrlParam.first = _ctrlCurr.first;
}

function setCtrlSelect(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.clearable = false; //显示清除
  col.ctrlParam.clearable = _ctrlCurr.clearable;
  col.$upd.ctrlParam.first = false; //默认首个
  col.ctrlParam.first = _ctrlCurr.first;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
}

function setCtrlTextarea(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.maxlength = false; //最大长度
  col.ctrlParam.maxlength = _ctrlCurr.maxlength;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.rows = false; //行数
  col.ctrlParam.rows = _ctrlCurr.rows && _ctrlCurr.rows > 0 ? _ctrlCurr.rows : 2;
  col.$upd.ctrlParam.showWordLimit = false; //显示字数
  col.ctrlParam.showWordLimit = _ctrlCurr.showWordLimit;
}

function setCtrlPassword(col, _ctrlCurr) {
  col.$upd.ctrlParam.placeholder = false; //占位文本
  col.ctrlParam.placeholder = _ctrlCurr.placeholder;
  col.$upd.ctrlParam.maxlength = false; //最大长度
  col.ctrlParam.maxlength = _ctrlCurr.maxlength;
  col.$upd.ctrlParam.readonly = false; //仅显示
  col.ctrlParam.readonly = _ctrlCurr.readonly;
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.descSpan = false; //描述栅格列数
  col.ctrlParam.descSpan = _ctrlCurr.descSpan;
}

function setCtrlUpload(col, _ctrlCurr) {
  const _par = _ctrlCurr.uploadParam ? _ctrlCurr.uploadParam : {};
  col.$upd.ctrlParam.disabled = false; //不可用
  col.ctrlParam.disabled = _ctrlCurr.disabled;
  col.$upd.ctrlParam.uploadParam = false; //附件上传参数
  col.ctrlParam.uploadParam = {
    fileCate: _par.fileCate,
    filePath: _par.filePath,
    listType: _par.listType ? _par.listType : "text",
    limit: _par.limit,
    fileSize: _par.fileSize,
    accept: _par.accept,
    acceptTxt: _par.acceptTxt,
    extensions: _par.extensions,
    checkRepeat: _par.checkRepeat !== false,
    download: _par.download !== false,
    dimension: { dimension: false, valArr: [100, 1600, 100, 1600] },
    compress: _par.compress
      ? _par.compress
      : {
          compress: false,
          fileSize: 1024,
          quality: 0.8,
          widthMax: 1600,
          widthMin: 100
        },
    capture: _par.capture,
    cardWidthPc: _par.cardWidth,
    cardHeightPc: _par.cardHeight,
    cardWidthApp: _par.cardWidth,
    cardHeightApp: _par.cardHeight,
    previewType: _par.previewType ? _par.previewType : "B",
    showDelete: _par.showDelete === true,
    watermark: _par.watermark
      ? _par.watermark
      : {
          watermark: false,
          content: "", //内容
          fontSize: 24, //字号
          fontColor: "#000000", //字体颜色
          opacity: 0.8, //透明度
          angle: 0, //旋转角度
          position: "bottom-left" //水印位置top-left|top-center|top-right|center|bottom-left|bottom-center|bottom-right
        },
    zip: _par.zip === true
  };
}

function setCtrlFormCol(col, _ctrlCurr) {
  col.$upd.ctrlParam.span = false; //栅格列数
  col.ctrlParam.span = _ctrlCurr.span;
  col.$upd.ctrlParam.labelWidth = false; //标签宽度
  col.ctrlParam.labelWidth = _ctrlCurr.labelWidthVal && _ctrlCurr.labelWidthVal > 0 ? _ctrlCurr.labelWidthVal + _ctrlCurr.labelWidthUnit : "";
  col.ctrlParam.labelWidthVal = _ctrlCurr.labelWidthVal;
  col.ctrlParam.labelWidthUnit = _ctrlCurr.labelWidthUnit;
  col.$upd.ctrlParam.required = false; //必输
  col.ctrlParam.required = _ctrlCurr.required;
  col.$upd.ctrlParam.noShow = false; //不显示
  col.ctrlParam.noShow = _ctrlCurr.noShow;
  col.$upd.ctrlParam.helpTip = false; //帮助提示
  col.ctrlParam.helpTip = _ctrlCurr.helpTip;
  col.ctrlParam.helpTipCode = col.ctrlParam.helpTip ? _ctrlCurr.helpTipCode : "";
  if (col.ctrlType !== "textarea") col.ctrlParam.rows = undefined;
  if (col.isPk || col.fieldAuto || col.ctrlType === "upload") {
    col.$upd.ctrlParam.noCopy = true;
    col.ctrlParam.noCopy = true;
  } else {
    col.$upd.ctrlParam.noCopy = false;
    col.ctrlParam.noCopy = _ctrlCurr.noCopy;
  }
}

/**
 * 控件字段映射关系-搜索帮助、数据检查、赋值方式、穿透字段
 */
function setCtrlFieldBaseMp(col) {
  //基础字段
  if (["input", "radio", "select"].includes(col.ctrlType) || (col.ctrlType === "checkbox" && col.fieldType === "array")) {
    col.$upd.baseType = false;
  } else {
    col.$upd.baseType = true;
    col.baseType = "";
  }
  if (col.fieldAuto) {
    col.$upd.baseType = true;
    col.baseType = "";
  }
  if (
    (col.baseType === "A2" && ["input"].includes(col.ctrlType)) ||
    (col.baseType === "A1" && ["radio", "select", "checkbox"].includes(col.ctrlType))
  ) {
    col.baseType = "";
  }
  if (!col.baseType) {
    col.baseValue = "";
    col.baseParam = {};
  }

  //检查字段
  if (["input", "input-number", "radio", "select", "date", "time"].includes(col.ctrlType)) {
    col.$upd.checkType = false;
  } else {
    col.$upd.checkType = true;
    col.checkType = "";
  }
  if (col.fieldAuto) {
    col.$upd.checkType = true;
    col.checkType = "";
  }
  if (!col.checkType) {
    col.checkValue = "";
    col.checkParam = {};
  }

  //数据赋值
  if (col.fieldAuto || ["upload"].includes(col.ctrlType)) {
    col.$upd.moveType = true;
    col.moveType = "";
  } else {
    col.$upd.moveType = false;
  }
  if (!col.moveType) {
    col.moveValue = "";
    col.moveParam = {};
  }

  //穿透字段
  if (["input", "input-number"].includes(col.ctrlType)) {
    col.$upd.clickType = false;
  } else {
    col.$upd.clickType = true;
    col.clickType = "";
  }
  if (!col.clickType) {
    col.clickValue = "";
    col.clickParam = {};
  }

  //自动和赋值字段有值-设置不可用
  if (col.fieldAuto || col.moveType) {
    col.$upd.ctrlParam.disabled = true;
    col.ctrlParam.disabled = true;
  }
}

/**
 * 初始化表格列字段
 */
function setCtrlTabCatParam(col) {
  const keysD = col.tabCatParam ? Object.keys(col.tabCatParam) : [];
  for (let key in c_tabCatParam.val) {
    if (!keysD.includes(key)) col.tabCatParam[key] = c_tabCatParam.val[key];
  }
}

/**
 * 初始化查询字段
 */
function setCtrlSchCatParam(col) {
  const keysD = col.schCatParam ? Object.keys(col.schCatParam) : [];
  for (let key in c_schCatParam.val) {
    if (!keysD.includes(key)) col.schCatParam[key] = c_schCatParam.val[key];
  }
}
