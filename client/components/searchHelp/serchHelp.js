import _ from "lodash";
import searchHelpCommon from "./searchHelpCommon.vue";
import { createVNode, render } from "vue";
import { $m } from "../../common/utils/globalConfig";

let ctx;

/**
 * 搜索帮助弹出框
 *
 * @param {Object} shPar 以下是对象说明
 * a:baseField[基础字段] 必填
 * b:dataObj[更改的数据(对象或数组)] :help="{}" 可选 @help="szdSh({})" 必填
 * c:baseMapping[映射关系] 如：['字段(目标)-字段(源)','字段(目标和源相同)','字段(目标)-*（*代表默认字段或第一字段）'] :help="{}" 可选 @help="szdSh({})" 必填
 * d:baseSelect[查询条件] 如：[['字段',值],['字段',值]] 可选
 * e:disabled[不能赋值] true 不可以赋值
 * f:moveType[类型]  可选 默认单选 [1单选 2多选 5多选用逗号分隔赋值-附加 6多选用逗号分隔赋值-替换]
 * g:rowIndex [多行赋值时的行号]（行赋值必传）如：scope.$index 可选
 * h:chgFields[触发change的字段] 可选 如：['字段(目标)','字段(目标)'] 可选
 * i:selectField[类型] 选中字段 可选(仅多选支持) 如：'字段(目标)-字段(源)' 或 '字段(目标和源相同)'
 * j:autoCompleteDescField[自动补全描述字段]
 *
 * @returns {Promise<res>} 返回参数说明
 * 返回对象 {data:[选中的行数据],param:{参数如默认字段},chgValue 选择的值,chgFlag:bool值 true更改 false未更改,chgField:{更改字段:{新值,旧值}}};
 * 返回boolean 直接关闭窗口返回false
 *
 * 使用说明
 * <szd-input show-help :help="{}">
 * <szd-input show-help @help="szdSh({})">
 */
export function szdSh(shPar) {
  return new Promise(resolve => {
    szdShShow(shPar).then(res => {
      if (shPar.e !== true && res && res.data.length > 0) {
        //映射关系转化为数组
        let arrMapping = [];
        if (shPar.c) {
          for (let i = 0; i < shPar.c.length; i++) {
            let temp_arr = shPar.c[i].split("-");
            if (temp_arr.length > 1 && temp_arr[1]) {
            } else {
              temp_arr[1] = temp_arr[0];
            }
            //设置缺省值字段
            if (temp_arr[1] === "*") {
              temp_arr[1] = res.param.defFieldId;
            }
            arrMapping.push(temp_arr);
          }
        }
        //添加更改状态
        res["chgFlag"] = false;
        res["chgField"] = {};
        res["chgValue"] = undefined;
        //赋值
        if (shPar.f === 2) {
          //多选赋值
          szdSh2(shPar.b, arrMapping, res, shPar.g, shPar.h);
        } else if (shPar.f === 5 || shPar.f === 6) {
          //多选用逗号分隔赋值
          szdSh6(shPar.b, arrMapping, res, shPar.h, shPar.f);
        } else {
          //单选赋值
          szdSh1(shPar.b, arrMapping, res, shPar.h);
        }
        resolve(res);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * 调用搜索帮助窗口
 *
 * @param {Object} shPar 以下是对象说明
 * a:baseField[基础字段] 必填
 * b:dataObj[更改的数据(对象或数组)] 可选
 * d:baseSelect[查询条件] 如：[['字段',值],['字段',值]] 可选
 * f:moveType[类型]  可选 默认单选 [1单选 2多选 5多选用逗号分隔赋值-附加 6多选用逗号分隔赋值-替换]
 * i:selectField[类型] 选中字段 可选(仅多选支持) 如：'字段(目标)-字段(源)' 或 '字段(目标和源相同)'
 *
 * @returns {Promise<res>} 返回参数说明
 * 返回对象 {data:[选中的行数据],param:{参数如默认字段}}
 * 返回boolean 直接关闭窗口返回false
 */
export function szdShShow(shPar) {
  return new Promise(resolve => {
    shPar.f = Number(shPar.f) || 1;
    const div = document.createElement("div");
    const baseField = shPar.a;
    const multipleChoice = [2, 5, 6].includes(shPar.f) ? 2 : 1;
    const baseSelect = shPar.d;
    const selectKeys = szdShGetSelectKeys(shPar); // 获取选中数据的key
    const vNode = createVNode(searchHelpCommon, {
      baseField,
      multipleChoice,
      baseSelect,
      selectKeys,
      onHandleSH: retObj => {
        resolve(retObj);
      },
      onCloseDialog: type => {
        if (type !== "okay") {
          resolve(false);
        }
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

//单选赋值
function szdSh1(dataObj, arrMapping, res, chgFields = []) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!_.isObject(dataObj)) {
    $m("CORE_CLIENT.E075"); //参数b的数据类型错误，应为对象类型
    return;
  }
  for (let i = 0; i < arrMapping.length; i++) {
    if (i === 0) {
      res.chgValue = res.data[0][arrMapping[i][1]];
    }
    if (dataObj[arrMapping[i][0]] !== res.data[0][arrMapping[i][1]]) {
      if (i === 0 || (chgFields && chgFields.length > 0 && chgFields.includes(arrMapping[i][0]))) {
        res.chgFlag = true;
      }
      res.chgField[arrMapping[i][0]] = {
        oVal: dataObj[arrMapping[i][0]],
        nVal: res.data[0][arrMapping[i][1]]
      };
      dataObj[arrMapping[i][0]] = res.data[0][arrMapping[i][1]];
    }
  }
}

//2 多选赋值
function szdSh2(dataObj, arrMapping, res, rowIndex, chgFields = []) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!Array.isArray(dataObj) || rowIndex === undefined || !dataObj[rowIndex]) {
    $m("CORE_CLIENT.E076"); //参数b的数据类型错误，应为数组类型，且索引必须存在
    return;
  }
  //当前点击行赋值
  let rowData = dataObj[rowIndex];
  for (let i = 0; i < arrMapping.length; i++) {
    if (i === 0) {
      res.chgValue = res.data[0][arrMapping[i][1]];
    }
    if (rowData[arrMapping[i][0]] !== res.data[0][arrMapping[i][1]]) {
      if (i === 0 || (chgFields && chgFields.length > 0 && chgFields.includes(arrMapping[i][0]))) {
        res.chgFlag = true;
      }
      res.chgField[arrMapping[i][0]] = {
        oVal: rowData[arrMapping[i][0]],
        nVal: res.data[0][arrMapping[i][1]]
      };
      rowData[arrMapping[i][0]] = res.data[0][arrMapping[i][1]];
    }
  }
  //多行赋值，克隆当前点击行，同时清空值
  if (res.data && res.data.length > 1) {
    res.chgFlag = true;
    for (let i = 1; i < res.data.length; i++) {
      let tempRow = {};
      for (let key in rowData) {
        tempRow[key] = "";
      }
      for (let j = 0; j < arrMapping.length; j++) {
        tempRow[arrMapping[j][0]] = res.data[i][arrMapping[j][1]];
      }
      dataObj.push(tempRow);
    }
  }
}

//6 多选赋值以逗号分隔
function szdSh6(dataObj, arrMapping, res, chgFields = [], moveType) {
  if (arrMapping.length === 0) {
    res.chgValue = res.data[0][res.param.defFieldId];
    return;
  }
  //检查数据对象
  if (!_.isObject(dataObj)) {
    $m("CORE_CLIENT.E075"); //参数b的数据类型错误，应为对象类型
    return;
  }
  //组合数据
  let jsonTemp = {};
  for (let i = 0; i < res.data.length; i++) {
    for (let j = 0; j < arrMapping.length; j++) {
      const _f0 = arrMapping[j][0];
      const _f1 = arrMapping[j][1];
      if (!jsonTemp[_f0]) jsonTemp[_f0] = [];
      jsonTemp[_f0].push(res.data[i][_f1]);
    }
  }
  //赋值数据
  for (let j = 0; j < arrMapping.length; j++) {
    const _f0 = arrMapping[j][0];
    let _nValArr = [];
    if (moveType === 5) {
      _nValArr = dataObj[_f0] ? dataObj[_f0].split(",") : [];
      for (let k = 0; k < jsonTemp[_f0].length; k++) {
        if (!_nValArr.includes(jsonTemp[_f0][k])) _nValArr.push(jsonTemp[_f0][k]);
      }
    } else {
      _nValArr = jsonTemp[_f0];
    }
    //转化为字符串
    let _nVal = "";
    for (let k = 0; k < _nValArr.length; k++) {
      if (k === 0) {
        _nVal = _nValArr[k];
      } else {
        _nVal = _nVal + "," + _nValArr[k];
      }
    }
    //赋值
    if (j === 0) {
      res.chgValue = _nVal;
    }
    if (dataObj[_f0] !== _nVal) {
      if (j === 0 || (chgFields && chgFields.length > 0 && chgFields.includes(_f0))) {
        res.chgFlag = true;
      }
      res.chgField[_f0] = { oVal: dataObj[_f0], nVal: _nVal };
      dataObj[_f0] = _nVal;
    }
  }
}

/***
 * 获取选中数据转化为数组
 */
function szdShGetSelectKeys(shPar) {
  let _selectKeys = { f: shPar.f, fKeyD: "", fKeyS: "", keys: [] };
  if (shPar.b && shPar.i) {
    const temp_arr = shPar.i.split("-");
    _selectKeys.fKeyD = temp_arr[0];
    _selectKeys.fKeyS = temp_arr.length > 1 && temp_arr[1] ? temp_arr[1] : temp_arr[0];
    if (shPar.f === 2 && Array.isArray(shPar.b)) {
      _selectKeys.keys = _.map(shPar.b, item => item[_selectKeys.fKeyD]);
    } else if ([5, 6].includes(shPar.f) && _.isObject(shPar.b)) {
      _selectKeys.keys = shPar.b[_selectKeys.fKeyD].split(",");
    }
    _selectKeys.keys = _selectKeys.keys.filter(v => v !== null && v !== undefined && v !== "");
  }
  if (_selectKeys.keys && _selectKeys.keys.length > 0) {
    return _selectKeys;
  } else {
    return false;
  }
}

/**
 * 设置上下文
 */
const setShApp = function(app) {
  ctx = app._context;
};

export default setShApp;
