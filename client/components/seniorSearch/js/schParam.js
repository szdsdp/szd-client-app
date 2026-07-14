import store from "~store";
import _ from "lodash";
import szdStoreSession from "../../../common/store/storeSession";

const const_type = ["string", "number", "boolean", "date", "datetime", "time", "year", "month"]; //数据类型
const const_btn_type = ["", "primary", "success", "warning", "danger", "info"]; //按钮样式
//默认样式
const const_btns = [
  { fCode: "$search", label: "搜索" },
  { fCode: "$reset", label: "重置" }
];

//布局
export function initSchLay(schLay) {
  let _lay = {
    layout: {}, //布局样式
    schCat: [], //搜索目录
    schBtn: [], //功能按钮
    schBtnMore: [] //更多按钮
  };
  //表格样式
  _lay.layout = initLayout(schLay.layout);
  //搜索条件目录
  _lay.schCat = initSchCat(schLay.schCat);
  //工具栏按钮
  _lay.schBtn = initSchBtn(_lay.layout, schLay.schBtn);
  //更多按钮
  _lay.schBtnMore = initSchBtnMore(_lay.layout, schLay.schBtn);
  //输出规则
  if (_lay.layout.showRule) initShowRule(_lay);

  return _lay;
}

//表格样式
function initLayout(params) {
  if (!params) params = {};
  return {
    report: params.report ? params.report : "", //程序名称
    varMode: params.varMode === "A" ? "A" : "U", //变式模式：U.仅自己可用，A.所有人可用，默认
    hideBtn: _.isBoolean(params.hideBtn) ? params.hideBtn : false, //隐藏按钮
    reset: _.isBoolean(params.reset) ? params.reset : true, //重置自动查询
    showRule: params.showRule, //输出规则
    //内部参数
    $SZDUserId: store.state.loginUser.user.userId,
    $SZDVar: {}
  };
}

//搜索条件目录
function initSchCat(fCat) {
  if (!_.isArray(fCat)) fCat = [];
  let _schCat = [];
  for (let i = 0; i < fCat.length; i++) {
    const item = fCat[i];
    //列字段键值尾款和重复检查
    const _temp = _schCat.find(schItem => schItem.field === item.field);
    if (_temp) {
      console.error("字段代码field不能重复和为空，且名称label不能为空:" + item.field);
      continue;
    }
    _schCat.push({
      field: item.field, //字段
      label: item.label, //标签
      placeholder: item.placeholder, //提示名称
      type: const_type.includes(item.type) ? item.type : "string", //数据类型
      numDot: item.type === "number" ? (_.isBoolean(item.numDot) ? item.numDot : true) : false, //千分位符
      numDec: item.type === "number" && !isNaN(item.numDec) ? item.numDec : undefined, //小数位位数
      help: item.help, //搜索帮助
      noTo: item.noTo, //无范围
      noExt: item.noExt, //无多选
      disabled: item.disabled,
      readonly: item.readonly,
      clearable: item.clearable,
      clearSpace: _.isBoolean(item.clearSpace) ? item.clearSpace : false,
      selectOpt: item.selectOpt,
      whereOpt: item.whereOpt,
      required: item.required
    });
  }

  return _schCat;
}

//工具栏按钮
function initSchBtn(layout, btns) {
  if (layout.hideBtn) return [];
  if (!Array.isArray(btns)) btns = [];
  let _schBtn = [];
  //扩展按钮 //自定义按钮不允许以$开始
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].fCode && !btns[i].fCode.startsWith("$") && !btns[i].more) {
      initSchBtnAdd(_schBtn, btns[i]);
    }
  }
  //标准按钮
  for (let i = 0; i < const_btns.length; i++) {
    initSchBtnAdd(_schBtn, const_btns[i]);
  }
  return _schBtn;
}

function initSchBtnAdd(_schBtn, item) {
  //隐藏按钮直接返回
  if (item.hide) return;
  //添加按钮
  _schBtn.push({
    type: const_btn_type.includes(item.type) ? item.type : "primary",
    fCode: item.fCode,
    label: item.label,
    color: item.color,
    disabled: _.isBoolean(item.disabled) ? item.disabled : false
  });
}

//工具栏按钮-更多
function initSchBtnMore(layout, btns) {
  if (layout.hideBtn || !Array.isArray(btns)) return [];
  let _schBtn = [];
  //扩展按钮 //自定义按钮不允许以$开始
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].fCode && !btns[i].fCode.startsWith("$") && btns[i].more) {
      initSchBtnAdd(_schBtn, btns[i]);
    }
  }
  return _schBtn;
}

function initShowRule(_lay) {
  let sParam = szdStoreSession.getWebParams(_lay.layout.showRule, false);
  if (!sParam) return;
  //输出位置
  if (sParam.schCat && Array.isArray(sParam.schCat) && sParam.schCat.length > 0) {
    let _schCat = [];
    let _ck = [];
    for (let i = 0; i < sParam.schCat.length; i++) {
      const item = sParam.schCat[i];
      if (!item) continue;
      if (_.isObject(item)) {
        if (item.field && _ck.includes(item.field)) continue;
        _ck.push(item.field);
        let fCat = _lay.schCat.find(r => r.field === item.field);
        if (fCat) {
          for (let key in item) {
            if (["noTo", "noExt", "disabled", "readonly", "clearable", "clearSpace", "selectOpt", "required"].includes(key)) {
              if (item[key] === true || item[key] === "true") {
                fCat[key] = true;
              } else {
                fCat[key] = false;
              }
            } else if (["whereOpt"].includes(key) && ["EQ", "SP"].includes(item[key])) {
              fCat[key] = item[key];
            }
          }
          _schCat.push(fCat);
        }
      } else {
        if (_ck.includes(item)) continue;
        _ck.push(item);
        let fCat = _lay.schCat.find(r => r.field === item);
        if (fCat) {
          _schCat.push(fCat);
        }
      }
    }
    if (_schCat.length > 0) _lay.schCat = _schCat;
  }
}
