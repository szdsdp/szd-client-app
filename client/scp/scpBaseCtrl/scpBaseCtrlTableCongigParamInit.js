import { ctrlSetParamInit } from "./scpBaseCtrlParamInit";
import { c_colParam } from "./scpBaseCtrlParamBean";

/**
 * 列字段
 * */
const colParam = c_colParam;

/**
 * 初始化参数
 */
export function initParam(codeObj) {
  // 初始化抬头参数
  initParamHeader(codeObj.header);
  // 初始化列字段
  for (let i = 0; i < codeObj.itemList.length; i++) {
    let col = codeObj.itemList[i];
    initParamItem(col);
    ctrlSetParamInit(col);
  }
}

/**
 * 初始化抬头参数
 */
function initParamHeader(header) {
  header.tableExists = header.tableExists === true;
  header.actAdd = header.actAdd === true;
  header.actEdit = header.actEdit === true;
  header.actDel = header.actDel ? header.actDel : "";
  header.actTr = header.actTr === true;
  header.actCache = header.actCache === true;
  header.cacheCode = header.cacheCode ? header.cacheCode : "";
  header.pcWidth = header.pcWidth && header.pcWidth > 0 ? header.pcWidth : 1000;
  header.pcHeight = header.pcHeight && header.pcHeight > 0 ? header.pcHeight : 600;
  header.pcPercentUnit = header.pcPercentUnit === true;
  if (!header.dgParam) header.dgParam = { span: 12, descSpan: 12, pageSizes: {}, pageSizesApp: {} };
  if (!header.dgParam.pageSizes) header.dgParam.pageSizes = {};
  if (!header.dgParam.pageSizesApp) header.dgParam.pageSizesApp = {};
}

/**
 * 列字段参数初始化
 */
function initParamItem(col) {
  col.fieldCodeDb = col.fieldCodeDb ? col.fieldCodeDb : "";
  col.fieldCode = col.fieldCode ? col.fieldCode : "";
  col.fieldNameDb = col.fieldNameDb ? col.fieldNameDb : "";
  col.fieldName = col.fieldName ? col.fieldName : "";
  col.fieldTypeDb = col.fieldTypeDb ? col.fieldTypeDb : "";
  col.fieldType = col.fieldType ? col.fieldType : "";
  col.fieldLen = col.fieldLen && col.fieldLen > 0 ? col.fieldLen : 0;
  col.fieldPos = col.fieldPos && col.fieldPos > 0 ? col.fieldPos : 0;
  col.isPk = col.isPk === true;
  col.fieldSortDb = col.fieldSortDb && col.fieldSortDb > 0 ? col.fieldSortDb : 0;
  col.fieldSort = col.fieldSort && col.fieldSort > 0 ? col.fieldSort : 1;
  col.fieldAuto = col.fieldAuto ? col.fieldAuto : "";
  col.fieldAutoNumo = col.fieldAutoNumo ? col.fieldAutoNumo : "";
  col.fieldAutoNumoName = col.fieldAutoNumoName ? col.fieldAutoNumoName : "";
  col.fieldCache = col.fieldCache ? col.fieldCache : "";
  col.fieldSch = col.fieldSch === true;
  col.fieldExists = col.fieldExists === true;
  col.ctrlType = col.ctrlType ? col.ctrlType : "";
  col.ctrlParam = col.ctrlParam ? col.ctrlParam : {};
  col.tabCatParam = col.tabCatParam ? col.tabCatParam : {};
  col.schCatParam = col.schCatParam ? col.schCatParam : {};
  col.baseType = col.baseType ? col.baseType : "";
  col.baseValue = col.baseValue ? col.baseValue : "";
  col.baseParam = col.baseParam ? col.baseParam : {};
  col.moveType = col.moveType ? col.moveType : "";
  col.moveValue = col.moveValue ? col.moveValue : "";
  col.moveParam = col.moveParam ? col.moveParam : {};
  col.checkType = col.checkType ? col.checkType : "";
  col.checkValue = col.checkValue ? col.checkValue : "";
  col.checkParam = col.checkParam ? col.checkParam : {};
  col.clickType = col.clickType ? col.clickType : "";
  col.clickValue = col.clickValue ? col.clickValue : "";
  col.clickParam = col.clickParam ? col.clickParam : {};
}

/**
 * 添加行初始化化
 */
export function initAddFieldParam(col) {
  initParamItem(col);
  ctrlSetParamInit(col);
}
