//搜索帮助
import setShApp, { szdSh, szdShShow } from "./searchHelp/serchHelp";
//消息提醒
import setMsgBox, { szdMsgBox } from "./msgBox/msgBox";
//iframe弹窗
import setIfrDg, { szdIfrDg } from "./ifrDg/ifrDg.js";
//上传文件
import setShUpload, { szdUpload } from "./upload/upload";
//文件预览
import setFileView, { szdFileView } from "./fileView/fileView";
//TR请求
import setTr, { szdTr } from "./tr/tr";

const installComponentFunction = app => {
  //搜索帮助
  setShApp(app);
  app.config.globalProperties.szdSh = szdSh;
  app.config.globalProperties.szdShShow = szdShShow;
  //消息提醒
  setMsgBox(app);
  app.config.globalProperties.szdMsgBox = szdMsgBox;
  //iframe弹窗
  setIfrDg(app);
  app.config.globalProperties.szdIfrDg = szdIfrDg;
  //上传文件
  setShUpload(app);
  app.config.globalProperties.szdUpload = szdUpload;
  //文件预览
  setFileView(app);
  app.config.globalProperties.szdFileView = szdFileView;
  //TR请求
  setTr(app);
  app.config.globalProperties.szdTr = szdTr;
};

export default installComponentFunction;
