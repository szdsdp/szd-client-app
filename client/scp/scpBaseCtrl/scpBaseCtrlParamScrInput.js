import szdRouter from "../../common/utils/goRouter";
import szdTool from "../../common/tools/tool";

/**
 * 获取屏幕渲染参数
 */
export function mainScrGetInputCtrlParam(codeObj, col, dataObj) {
  let ctrlParam = {
    ctrlType: col.ctrlType, //控件类型
    fieldCode: col.fieldCode, //字段
    type: col.fieldType, //数据类型

    numDot: col.ctrlParam.numDot, //千分位符
    numDec: col.fieldPos, //小数位数
    numMax: col.ctrlParam.numMax === col.ctrlParam.numMin ? undefined : col.ctrlParam.numMax, //最大值
    numMin: col.ctrlParam.numMax === col.ctrlParam.numMin ? undefined : col.ctrlParam.numMin, //最小值
    placeholder: col.ctrlParam.placeholder, //占位文本
    maxlength: col.ctrlParam.maxlength && col.ctrlParam.maxlength > 0 ? col.ctrlParam.maxlength : col.fieldLen, //最大长度
    readonly: col.ctrlParam.readonly, //仅显示
    disabled: col.ctrlParam.disabled || !!col.fieldAuto, //不可用
    clearable: col.ctrlParam.clearable, //显示清除
    dblclick: col.clickValue ? true : false, //双击事件
    clickColor: col.clickValue ? true : false, //点击颜色
    align: col.ctrlParam.align, //对齐方式
    noZero: col.ctrlParam.noZero, //不显示0
    format: col.ctrlParam.format ? col.ctrlParam.formatObj : undefined, //格式化
    max: col.ctrlParam.max === col.ctrlParam.max ? undefined : col.ctrlParam.max, //最大值
    min: col.ctrlParam.max === col.ctrlParam.min ? undefined : col.ctrlParam.min, //最小值
    precision: col.fieldPos, //精度
    step: col.ctrlParam.step, //步进
    checkboxAll: col.ctrlParam.checkboxAll, //显示全选
    first: col.ctrlParam.first, //默认首个
    rows: col.ctrlParam.rows && col.ctrlParam.rows > 0 ? col.ctrlParam.rows : 2, //显示行数
    showWordLimit: col.ctrlParam.showWordLimit, //显示字数
    uploadParam: ctrlUploadParam(col.ctrlParam.uploadParam), //上传参数

    label: col.fieldName ? col.fieldName : col.fieldNameDb, //标签
    prop: undefined, //model键名
    span: col.ctrlParam.span || codeObj.header.dgParam.span || 12, //栅格列数
    labelWidth: col.ctrlParam.labelWidth || codeObj.header.dgParam.labelWidth, //标签宽度
    required: col.ctrlParam.required, //必输
    descField: col.ctrlParam.descField, //描述
    descSpan: col.ctrlParam.descSpan ? col.ctrlParam.descSpan : col.ctrlParam.descField ? codeObj.header.dgParam.descSpan : undefined, //描述栅格列数
    helpTip: col.ctrlParam.helpTip ? col.ctrlParam.helpTipCode : undefined, //帮助提示

    baseField: col.baseValue, //基础字段
    showHelp: false,
    help: undefined //显示搜索帮助
  };
  //设置搜索帮助
  if (ctrlParam.baseField && ctrlParam.ctrlType === "input") {
    ctrlParam.showHelp = true;
    let _help_c = ctrlHelpBaseMapping(col.baseParam); //映射关系 ['字段(目标)-字段(源)']
    let _help_d = ctrlHelpBaseSelect(col.baseParam, dataObj); //查询条件 [['字段',值],['字段',值]]
    if (dataObj) {
      ctrlParam.help = {
        a: col.baseValue, //基础字段
        b: dataObj, //更改的数据
        c: _help_c, //映射关系 ['字段(目标)-字段(源)']
        d: _help_d //查询条件 [['字段',值],['字段',值]]
      };
    }
  }

  return ctrlParam;
}

/**
 * 上传参数
 */
function ctrlUploadParam(params = {}) {
  return {
    fileCate: params.fileCate,
    filePath: params.filePath,
    listType: params.listType,
    limit: params.limit && params.limit > 0 ? params.limit : 0,
    fileSize: params.fileSize && params.fileSize > 0 ? params.fileSize : 0,
    accept: params.accept,
    acceptTxt: params.acceptTxt,
    extensions: szdTool.convertStrToArr(params.extensions),
    checkRepeat: params.checkRepeat,
    download: params.download,
    dimension: params.dimension && params.dimension.dimension ? params.dimension.valArr : undefined,
    compress: params.compress && params.compress.compress ? params.compress : undefined,
    capture: params.capture,
    cardWidth: params.cardWidthPc,
    cardHeight: params.cardHeightPc,
    previewType: params.previewType,
    showDelete: params.showDelete,
    bussId: "",
    bussDocId: "",
    watermark: params.watermark && params.watermark.watermark ? params.watermark : undefined,
    zip: params.zip
  };
}

/**
 * 设置搜索帮助 映射关系 ['字段(目标)-字段(源)']
 */
function ctrlHelpBaseMapping(baseParam) {
  let baseMp = [];
  if (baseParam.retList && baseParam.retList.length > 0) {
    for (let i = 0; i < baseParam.retList.length; i++) {
      const item = baseParam.retList[i];
      baseMp.push(item.consField + "-" + item.servField);
    }
  }
  return baseMp;
}

/**
 * 设置搜索帮助 查询条件 [['字段',值],['字段',值]]
 * */
function ctrlHelpBaseSelect(baseParam, dataObj) {
  let baseMp = [];
  if (baseParam.selList && baseParam.selList.length > 0) {
    for (let i = 0; i < baseParam.selList.length; i++) {
      const item = baseParam.selList[i];
      if (item.servFix) {
        baseMp.push([item.servField, item.servDef]);
      } else if (item.consField) {
        baseMp.push([item.servField, dataObj[item.consField]]);
      }
    }
  }
  return baseMp;
}

/**
 * 点击穿透
 * */
export function clickInputLink(col, dataObj) {
  if (!col || !col.clickParam || !col.clickParam.header) return;
  const header = col.clickParam.header;
  let _routerCode = header.routerCode ? header.routerCode : dataObj[header.fieldCode];
  if (_routerCode && (header.modeSpace || dataObj[col.fieldCode])) {
    let _params = {};
    for (let i = 0; i < col.clickParam.selList.length; i++) {
      const item = col.clickParam.selList[i];
      _params[item.key] = item.servFix ? item.servDef : dataObj[item.consField];
    }
    szdRouter.goNav(_routerCode, _params, col.clickParam.mode);
  }
}
