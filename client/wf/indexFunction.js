import { btnCheck, consume, init, nextUser, retInfo, retMsg, setWfAppTool, wfEvtInit, wfInfo } from "./js/wfTool";
import { shBsubDef, shBsubList, shBT, shBTS, shDyId } from "./js/wfShHelp";
import { eisAtt, eisImg, goDoc, goDocId, goPrint, goPrintBatch, getUrlParams, replaceUrl } from "./js/wfRouter";
import { goNav, goNavDg } from "../common/utils/goRouter";

export const szdWf = {
  init,
  btnCheck,
  wfInfo,
  retInfo,
  nextUser,
  wfEvtInit,
  consume,
  retMsg,
  //路由相关
  getUrlParams,
  goDoc,
  goDocId,
  goPrint,
  goPrintBatch,
  eisImg,
  eisAtt,
  replaceUrl,
  //搜索帮助
  shBT,
  shBTS,
  shDyId,
  shBsubDef,
  shBsubList,
  //路由
  goNav,
  goNavDg
};

const installWfFunction = app => {
  setWfAppTool(app);
  app.config.globalProperties.szdWf = szdWf;
};

export default installWfFunction;