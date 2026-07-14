import { createVNode, render } from "vue";
import tr from "./tr.vue";
import szdStoreSession from "../../common/store/storeSession";

let ctx;

/**
 * 传输请求弹窗
 * @param {Object} trObj 已选的请求号 {trCode:请求号,operRemark:请求摘要,noAct:false 启用 true不启用}
 *
 * @return Object 以下是对象说明 {trCode:请求号,operRemark:请求摘要}
 */
export function szdTr(trObj = {}) {
  return new Promise(resolve => {
    if (trObj && (trObj.trCode || trObj.noAct === true)) {
      resolve(trObj);
    } else {
      const trCtrl = szdStoreSession.getWebParams("tr_ctrl");
      if (trCtrl && trCtrl === "off") {
        let resTr = {};
        resolve(resTr);
      } else {
        let resolveFlag = false;
        const div = document.createElement("div");
        const vNode = createVNode(tr, {
          onOkay: resTr => {
            resolve(resTr);
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
      }
    }
  });
}

/**
 * 设置上下文
 */
const setTr = function (app) {
  ctx = app._context;
};

export default setTr;
