import szdRouter from "../utils/goRouter";
import { range } from "./range";
import { lockOff, lockOn } from "./lock";
import { $t } from "../utils/globalConfig";
import { toolCheckAuth, toolGetGlobalParam } from "../api/tool";

/**
 * 根据权限对象和权限字段值 检查是否具有对应数据权限
 * @param {String}  authObjCode 权限对象编码
 * @param {String}  authVal 业务数据值，多个用逗号分隔 说明： 可以包含多个字段，用逗号分割，格式为：字段编码1=字段值1,字段编码2=字段值2
 * @return {Promise} 检查通过返回true 否则false
 */
function checkAuth(authObjCode, authVal = "") {
  return new Promise(resolve => {
    toolCheckAuth({ authObjCode: authObjCode, authVal: authVal }).then(auth => {
      resolve(auth);
    });
  });
}

/**
 * 获取全局参数-键值对象
 * @param {String}  configType 全局参数-配置类
 * @param {String}  configKey 全局参数-参数键
 * @return {Promise} {参数键值、参数名、参数值、参数排序、备注}
 */
function getGlobalParam(configType, configKey = "") {
  return new Promise(resolve => {
    toolGetGlobalParam({ configType: configType, configKey: configKey }).then(resConfig => {
      resolve(resConfig);
    });
  });
}

/**
 * 构造树型结构数据
 * @param {Array} data 数据源
 * @param {String} id id字段
 * @param {String} parentId 父节点字段
 * @param {String} children 子节点字段
 * @param {String} rootId 根Id
 */
function getTree(data, id = "id", parentId = "parentId", children = "children", rootId = "") {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId = rootId || "";
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

/**
 * 获取联动最终值
 * @param {*} cascaders 联动选择的值
 * @return {String} 返回周后一个节点
 * */
function getCascader(cascaders) {
  if (cascaders && Array.isArray(cascaders)) {
    if (cascaders.length === 0) {
      return "";
    } else {
      return cascaders[cascaders.length - 1];
    }
  } else {
    return cascaders;
  }
}

/**
 * 复制Excel粘贴
 * @return {Array} 返回表数据，列数据通过"\t"分割
 */
async function getPaste() {
  const res = await navigator.clipboard.readText();
  return res
    .replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm, function (match, p1) {
      return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
    })
    .split(/\r\n|\n\r|\n|\r/g);
}

/**
 * 标题操作文本
 * @param option 操作类型 C新增 U更改 V显示
 * @return {String} 返回操作描述
 */
function getTitle(option) {
  if (option === "C") return $t("新增");
  if (option === "U") return $t("更改");
  if (option === "V") return $t("显示");
  return "";
}

/**
 * 转驼峰
 * @param {String} str
 */
function toCamelCase(str) {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

/**
 * 字符串转化为数组
 * @param {String||Array} value 待转化的字符串或数组
 * @param {String} split 拆分规则
 * @param {Boolean} trim 去除空格
 * @return {Array} 处理后的纯数组
 */
function convertStrToArr(value, split = ",", trim = true) {
  if (value) {
    let _val = [];
    if (Array.isArray(value)) {
      _val = value;
    } else if (typeof value === "string") {
      _val = value
        .replace(/^\[|\]$/g, "") // 移除首尾的[]
        .split(split); // 按逗号分割
    } else {
      return [];
    }
    if (trim) {
      return _val
        .map(item => item.trim()) // 去除每个元素的首尾空格
        .filter(item => item); // 过滤空字符串
    } else {
      return _val;
    }
  } else {
    return [];
  }
}

/**
 * 帮助文档
 * @param {String} docId 帮助文档id 命名规则：建议路由代码+表+字段 或 表+字段
 * @param {String} docName 帮助文档名称
 * @param {Boolean} docIdDisabled 禁止编辑docId
 */
function helpDoc(docId, docName = "", docIdDisabled = false) {
  szdRouter.goNav("SKIS_05B", { docId: docId, docName: docName, docIdDisabled: docIdDisabled });
}

const szdTool = {
  range,
  checkAuth,
  getGlobalParam,
  getTree,
  getCascader,
  getPaste,
  getTitle,
  toCamelCase,
  convertStrToArr,
  helpDoc,
  lockOn,
  lockOff
};

export default szdTool;
