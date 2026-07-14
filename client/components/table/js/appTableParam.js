import { initTableLay } from "./tableParam";

const const_app_toolbar = ["$add", "$copy", "$del"];

export function appInitTableLay(layout, fieldCat, toolbar, sortRule) {
  let pcLay = initTableLay(layout, fieldCat, toolbar, sortRule);

  let appLay = {
    layout: pcLay.layout,
    fCatCol: [],
    fCatUse: pcLay.fCatUse,
    tBar: {},
    sortRule: [],
    fRanges: {},
    viewLay: pcLay.viewLay
  };
  //工具栏按钮
  appLay.tBar = appTableBar(pcLay.tBar);
  //表格列目录
  appTableFCat(appLay, pcLay.fCatCol);

  return appLay;
}

//表格列目录
function appTableFCat(appLay, pcFCatCol) {
  //去除多表头，只要最后输出列
  for (let i = 0; i < pcFCatCol.length; i++) {
    let item = pcFCatCol[i];
    if (item.$SZDCol) {
      if (item.ctrlParam) {
        item.ctrlParam.label = item.label;
      }
      if (item.field === "$SZDBtnLinkNav") {
        item.label = "";
        for (let j = 0; j < item.ctrlParam.length; j++) {
          item.ctrlParam[j].link = false;
        }
      }
      appLay.fCatCol.push(item);
    } else if (item.children && item.children.length > 0) {
      appTableFCat(appLay, item.children);
    }
  }
}

//工具栏按钮
function appTableBar(pcTBar) {
  let appTBar = {
    hide: pcTBar.hide,
    edit: pcTBar.edit,
    btnHide: pcTBar.btnHide,
    btnDisabled: pcTBar.btnDisabled,
    btns: [],
    btnsMore: []
  };
  appTableBarBtns(appTBar.btns, appTBar.btnsMore, pcTBar.btns, false);
  return appTBar;
}

//工具栏按钮-添加
function appTableBarBtns(appBtns, appBtnsMore, pcBtns, isMore) {
  if (pcBtns.length === 0) return;
  for (let i = 0; i < pcBtns.length; i++) {
    let item = pcBtns[i];
    if (item.children && item.children.length > 0) {
      appTableBarBtns(appBtns, appBtnsMore, item.children, true);
    } else {
      if (!item.more) item.more = isMore;
      if (!item.label) item.label = item.tip;
      if (!item.fCode.startsWith("$") || const_app_toolbar.includes(item.fCode)) {
        if (item.more === true) {
          appBtnsMore.push(item);
        } else {
          appBtns.push(item);
        }
      }
    }
  }
}

 