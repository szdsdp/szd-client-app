/**
 * 获取控件状态
 * @param {String} szdfst 字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
 * @param {String}szdopt 操作 V显示 U编辑
 * @param {Boolean} disabled 不能编辑
 * @param {Boolean} readonly 仅显示
 * @return {Object} 返回对象
 * {
 *   readonly: 仅显示,
 *   disabled: 不能编辑,
 *   hide: 隐藏
 * }
 */
function getCompFst(szdfst, szdopt, disabled = false, readonly = false) {
  let fst = {
    readonly: readonly,
    disabled: disabled,
    hide: false
  };
  //字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
  if (szdfst === "1") {
    fst.readonly = false;
    fst.disabled = false;
  } else if (szdfst === "2") {
    fst.readonly = false;
    fst.disabled = false;
  } else if (szdfst === "3") {
    fst.readonly = true;
    fst.disabled = true;
  } else if (szdfst === "4" || szdfst === "5") {
    fst.readonly = true;
    fst.disabled = true;
    fst.hide = true;
  }
  //仅显示
  if (szdopt === "V") {
    fst.readonly = true;
    fst.disabled = true;
  }
  return fst;
}

function getCompFstForm(szdfst, required = false) {
  let fst = {
    required: required,
    hide: false
  };
  //字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
  if (szdfst === "1") {
    fst.required = false;
  } else if (szdfst === "2") {
    fst.required = true;
  } else if (szdfst === "3") {
  } else if (szdfst === "4" || szdfst === "5") {
    fst.hide = true;
  }
  return fst;
}

const szdComp = {
  getCompFst,
  getCompFstForm
};

export default szdComp;
