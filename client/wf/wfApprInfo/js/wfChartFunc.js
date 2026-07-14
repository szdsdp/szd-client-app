import { nodeMenuList } from "./designerOptions";
import { formatLayout } from "./designerFormat";

// 节点数据初始化
export function getDesignerInit(nodeList) {
  if (!nodeList || nodeList.length === 0) return;
  //节点数据初始化
  for (let i = 0; i < nodeList.length; i++) {
    let _node = nodeList[i];
    _node["self_id"] = _node["instNodeId"];
    _node["self_preId"] = _node["instPreNodeId"];
    _node["self_nodeType_ico"] = "";
    _node["el_tooltip"] = "流程节点:" + _node["instNodeId"];
    if (_node.wfDyAmt) {
      _node["el_tooltip"] += "   动态审批金额:" + _node.wfDyAmt;
    }
    nodeInit(_node);
  }
  // 流程组设置坐标
  wfGroupFormatLayout(nodeList);
}

//节点数据单行初始化
function nodeInit(node) {
  //节点图标
  let nodeMenu = nodeMenuList.find(r => r.nodeType === node.nodeType);
  if (nodeMenu) {
    node["self_nodeType_ico"] = nodeMenu.ico;
  }
}

//流程组和加签坐标初始化
function wfGroupFormatLayout(nodeList) {
  let nodeListN = [];

  //获取流程组中流程
  let arrWf = [];
  for (let i = 0; i < nodeList.length; i++) {
    let item = nodeList[i];
    if (!arrWf.find(r => (r.wfId = item.wfId))) {
      arrWf.push({ wfId: item.wfId, wfSort: item.wfSort, wfType: item.wfType });
    }
  }

  //设置流程坐标
  for (let i = 0; i < arrWf.length; i++) {
    let wfItem = arrWf[i];
    let wfNodeList = [];

    //获取本流程-流程节点
    let _dyLeft = 20;
    for (let j = 0; j < nodeList.length; j++) {
      let nodeItem = nodeList[j];
      if (nodeItem.wfId === wfItem.wfId) {
        if (wfItem.wfType === "0") {
          nodeItem.left = _dyLeft + "px";
          nodeItem.top = "20px";
          _dyLeft = _dyLeft + 300;
        }
        wfNodeList.push(nodeItem);
      }
    }

    //格式化单元格
    formatLayout(wfNodeList);

    //获取最大X坐标
    let _leftMax = 0;
    for (let j = 0; j < nodeListN.length; j++) {
      let tempLeft = parseInt(nodeListN[j].left) - 20;
      if (_leftMax < tempLeft) _leftMax = tempLeft;
    }

    //组合节点和设置X坐标
    for (let j = 0; j < wfNodeList.length; j++) {
      let nodeItem = wfNodeList[j];
      if (_leftMax > 0) {
        let tempLeft = parseInt(nodeItem.left) + _leftMax;
        nodeItem.left = tempLeft + +"px";
      }
      nodeListN.push(nodeItem);
    }
  }
}
