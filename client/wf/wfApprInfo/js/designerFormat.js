// 格式化
export function formatLayout(nodeList) {
  // 对齐坐标
  let arrXY = calcAxisXY(nodeList);
  if (arrXY.length === 0) return;
  // 坐标重复设置
  calcAxisXYAgain(arrXY);
  // 删除空行空列
  calcAxisXYSpace(arrXY);
  // 设置坐标
  calcAxisXYSet(nodeList, arrXY);
}

//对齐坐标
function calcAxisXY(nodeList) {
  let arrXY = [];
  for (let i = 0; i < nodeList.length; i++) {
    let item = nodeList[i];
    let _aXY = {
      self_id: item.self_id,
      leftO: parseInt(item.left),
      topO: parseInt(item.top),
      addNodeSortNum: item.addNodeSortNum ? item.addNodeSortNum : 0,
      leftN: Math.round(parseInt(item.left) / 300) * 300 + 20,
      topN: Math.round(parseInt(item.top) / 120) * 120 + 20
    };
    arrXY.push(_aXY);
  }
  //排序
  arrXY.sort((a, b) => {
    if (a.leftO !== b.leftO) return a.leftO - b.leftO;
    if (a.topO !== b.topO) return a.topO - b.topO;
    return a.addNodeSortNum - b.addNodeSortNum;
  });
  return arrXY;
}

//检查坐标是否重复
function calcAxisXYAgain(arrXY) {
  let arrXCount = [];
  //统计重复坐标数量
  for (let i = 0; i < arrXY.length; i++) {
    let _aXY = arrXY[i];
    let _tempXCount = arrXCount.find(r => r.leftN === _aXY.leftN && r.topN === _aXY.topN);
    if (_tempXCount) {
      _tempXCount.count = _tempXCount.count + 1;
    } else {
      arrXCount.push({ leftN: _aXY.leftN, topN: _aXY.topN, count: 1 });
    }
  }
  let _XYAgain = arrXCount.find(r => r.count > 1);
  if (_XYAgain) {
    let flag = false;
    for (let i = 0; i < arrXY.length; i++) {
      let _aXY = arrXY[i];
      if (_aXY.leftN === _XYAgain.leftN && _aXY.topN === _XYAgain.topN) {
        if (flag) _aXY.leftN = _aXY.leftN + 300;
        flag = true;
      } else if (_aXY.leftN > _XYAgain.leftN) {
        _aXY.leftN = _aXY.leftN + 300;
      }
    }
    calcAxisXYAgain(arrXY);
  }
}

//检查行列空的单元格
function calcAxisXYSpace(arrXY) {
  let leftMin = undefined;
  let leftMax = undefined;
  let topMin = undefined;
  let topMax = undefined;
  for (let i = 0; i < arrXY.length; i++) {
    let _aXY = arrXY[i];
    if (leftMin === undefined || leftMin > _aXY.leftN) leftMin = _aXY.leftN;
    if (leftMax === undefined || leftMax < _aXY.leftN) leftMax = _aXY.leftN;
    if (topMin === undefined || topMin > _aXY.topN) topMin = _aXY.topN;
    if (topMax === undefined || topMax < _aXY.topN) topMax = _aXY.topN;
  }
  //设置起始点
  if (leftMin !== 20 || topMin !== 20) {
    for (let i = 0; i < arrXY.length; i++) {
      let _aXY = arrXY[i];
      if (leftMin !== 20) _aXY.leftN = _aXY.leftN - leftMin + 20;
      if (topMin !== 20) _aXY.topN = _aXY.topN - topMin + 20;
    }
    if (leftMin !== 20) leftMax = leftMax - leftMin + 20;
    if (topMin !== 20) topMax = topMax - topMin + 20;
  }
  //删除全空列
  let xCount = leftMax > 300 ? (leftMax - 20) / 300 + 1 : 1;
  for (let i = 0; i < xCount; i++) {
    let xPos = i * 300 + 20;
    if (!arrXY.find(r => r.leftN === xPos)) {
      for (let k = 0; k < arrXY.length; k++) {
        if (arrXY[k].leftN > xPos) arrXY[k].leftN = arrXY[k].leftN - 300;
      }
      i = i - 1;
      xCount = xCount - 1;
    }
  }
  //删除全空行
  let yCount = topMax > 120 ? (topMax - 20) / 120 + 1 : 1;
  for (let i = 0; i < yCount; i++) {
    let yPos = i * 120 + 20;
    if (!arrXY.find(r => r.topN === yPos)) {
      for (let k = 0; k < arrXY.length; k++) {
        if (arrXY[k].topN > yPos) arrXY[k].topN = arrXY[k].topN - 120;
      }
      i = i - 1;
      yCount = yCount - 1;
    }
  }
}

//设置坐标
function calcAxisXYSet(nodeList, arrXY) {
  for (let i = 0; i < nodeList.length; i++) {
    let item = nodeList[i];
    let _aXY = arrXY.find(r => r.self_id === item.self_id);
    if (_aXY) {
      item.left = _aXY.leftN + "px";
      item.top = _aXY.topN + "px";
    }
  }
}
