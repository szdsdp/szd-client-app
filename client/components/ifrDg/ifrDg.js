import { createVNode, render } from "vue";
import ifrDgVue from "./ifrDg.vue";
import szdRouter from "../../common/utils/goRouter";

let ctx;

/**
 * 动态加载路由
 * @param {String} routerCode 路由代码
 * @param {Object} params 请求参数
 * @param {Object} winSetting 窗口设置 { height高度,showClose关闭 }
 */
export function szdIfrDg(routerCode, params = {}, winSetting = {}) {
  return new Promise(resolve => {
    //获取路由对象
    const routerObj = szdRouter.getRouterObj(routerCode);

    if (routerObj && routerCode) {
      //按照优先级设置窗口参数(1.传参 2.路由配置 3.默认)
      const h = winSetting.height ? winSetting.height : "80vh"; //高度
      //加载窗口
      const div = document.createElement("div");
      const vNode = createVNode(ifrDgVue, {
        routerCode: routerCode,
        params: params,
        height: h,
        showClose: winSetting.showClose,
        onCloseDialog: () => {
          document.body.removeChild(div);
        }
      });
      vNode.appContext = ctx;
      document.body.appendChild(div);
      render(vNode, div);
    }
    resolve(true);
  });
}

/**
 * 设置上下文
 */
const setIfrDg = function (app) {
  ctx = app._context;
};

export default setIfrDg;
