import store from "~store";
import { $m } from "../../common/utils/globalConfig";
import { szdSh } from "../../components/searchHelp/serchHelp";
import { getBstpBsub, getDefaultBsub } from "../api/wfApi";

/**
 * 业务类型搜索帮助
 * @param {String} routerCode 业务路由
 * @param {Object} objData 数据对象
 */
export function shBT(routerCode, objData) {
  if (routerCode) {
    szdSh({
      a: "CORE_BSTP",
      b: objData,
      c: ["bstp", "bstpName"],
      d: [["routerCode", routerCode]]
    }).then();
  }
}

/**
 * 业务小类搜索帮助
 * @param {String} bussType 业务类型
 * @param {String} structCode 数据结构代码
 * @param {Object} objData 数据对象
 */
export function shBTS(bussType, structCode, objData) {
  if (!bussType) {
    $m("CORE_CLIENT.W007"); //请先维护业务类型
    return;
  }
  szdSh({
    a: "CORE_BSUB01",
    b: objData,
    c: ["bsub", "bsubName"],
    d: [
      ["bstp", bussType],
      ["structCode", structCode]
    ]
  }).then();
}

/**
 * 动态工作流搜索帮助
 * @param {String} bussType 业务类型
 * @param {Object} objData 数据对象
 * @param {String} userId 用户Id
 */
export function shDyId(bussType, objData, userId = "") {
  if (!bussType) {
    $m("CORE_CLIENT.W007"); //请先维护业务类型
    return;
  }
  let _userId = userId || store.state.loginUser.user.userId;
  szdSh({
    a: "CORE_WFDY",
    b: objData,
    c: ["wfDyId", "wfDyName"],
    d: [
      ["bstp", bussType],
      ["userId", _userId]
    ]
  }).then();
}

/**
 * 查询默认业务小类
 * @param {String} bussType 业务类型编码
 * @param {String} struct 结构编码
 * @return {Promise} 返回默认业务小类对象
 */
export function shBsubDef(bussType, struct) {
  return new Promise(resolve => {
    //检查vuex是否存在
    let defBsubArr = store.state.vuexData.group["$SZD_DEF_BSUB"];
    if (!defBsubArr) defBsubArr = [];
    const defTemp = defBsubArr.find(r => r.bussType === bussType && r.struct === struct);
    if (defTemp) {
      resolve(defTemp.data);
    } else {
      getDefaultBsub(bussType, struct).then(res => {
        if (res && res.data) {
          defBsubArr.push({ bussType: bussType, struct: struct, data: res.data });
          store.dispatch("setVuexDataGroup", { key: "$SZD_DEF_BSUB", value: defBsubArr }).then();
          resolve(res.data);
        }
        resolve("");
      });
    }
  });
}

/**
 * 获取业务小类
 * @param {String} bussType 业务类型编码
 * @return {Promise} 返回业务小类列表
 */
export function shBsubList(bussType) {
  return new Promise(resolve => {
    getBstpBsub(bussType).then(res => {
      if (res.code === 200) {
        resolve(res.data);
      } else {
        resolve([]);
      }
    });
  });
}
