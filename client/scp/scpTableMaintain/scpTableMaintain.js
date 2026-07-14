import { createVNode, render } from "vue";
import { $mE } from "../../common/utils/globalConfig";
import szdRouter from "../../common/utils/goRouter";
import scpTableMaintainDg from "./scpTableMaintainDg.vue";

let ctx;

/**
 * 表维护
 * @param {Object} params 调用参数
 * {
 *   sysCode: 应用系统代码,
 *   program: 数据库表,
 *   routerCode: 路由代码,
 *   option: 操作标识 C-创建 U-更新 V-显示
 * }
 * 注：【应用系统代码、数据库表】 或 路由代码 必须维护其中之一
 * @param {Object} dataObj 数据对象 U和 V时必传
 *
 * @return Object 以下是对象说明 {trCode:请求号,operRemark:请求摘要}
 */
export function szdScpTableMaintain(params, dataObj = undefined) {
  return new Promise(resolve => {
    if (!params || !["C", "U", "V"].includes(params.option)) {
      $mE("调用参数维护错误,操作类型必须是C-创建 U-更新 V-显示");
      resolve(false);
      return;
    }
    let _params = { option: params.option };
    if (params.routerCode) {
      const routerObj = szdRouter.getRouterObj(params.routerCode);
      if (routerObj && routerObj.program) {
        _params.sysCode = routerObj.sysCode;
        _params.program = routerObj.program;
        _params.routerCode = routerObj.routerCode;
      } else {
        $mE("调用参数维护错误,路由代码不存在或维护错误");
        resolve(false);
        return;
      }
    } else if (params.sysCode && params.program) {
      _params.sysCode = params.sysCode;
      _params.program = params.program;
      _params.routerCode = "";
    } else {
      $mE("调用参数维护错误[应用系统代码、数据库表] 或 路由代码 必须维护其中之一");
      resolve(false);
      return;
    }
    // 加载屏幕
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(scpTableMaintainDg, {
      codeParams: _params,
      rowObj: dataObj,
      onOkay: resObj => {
        resolve(resObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
        if (!resolveFlag) {
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

/**
 * 设置上下文
 */
const setScpTableMaintain = function (app) {
  ctx = app._context;
};

export default setScpTableMaintain;
