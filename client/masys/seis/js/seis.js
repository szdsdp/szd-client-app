import { createVNode, render } from "vue";
import eatt from "../eatt/eatt.vue";
import { $mE } from "../../../common/utils/globalConfig";

let ctx;

/**
 * 上传组件
 *  @param {String}  eisId: 文件id
 *  @param {String}  szdopt: 操作权限
 *  @param {Object}  uplParams: 文件参数{
 *    limit: 9, //最大上传文件数
 *    accept: "", //上传文件类型 ".xls,.xlsx"
 *    fileSize: undefined, //文件大小-KB
 * }
 */
export function szdSeisEatt(eisId, szdopt, uplParams = {}) {
  return new Promise((resolve, reject) => {
    if (eisId) {
      const div = document.createElement("div");
      const vNode = createVNode(eatt, {
        eisId: eisId,
        szdopt: szdopt,
        uplParams: uplParams,
        onCloseForm: () => {
          resolve(true);
          document.body.removeChild(div);
        }
      });
      vNode.appContext = ctx;
      document.body.appendChild(div);
      render(vNode, div);
    } else {
      $mE("文件Id不能为空");
      resolve(false);
    }
  });
}

/**
 * 设置上下文
 */
const setSeis = function (app) {
  ctx = app._context;
};

export default setSeis;
