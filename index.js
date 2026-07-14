//监听路由跳转
import "./client/common/utils/permission";
//common组件
import installCommonFunction from "./client/common/indexFunction";
//components组件
import installComponent from "./client/components/indexComponent";
import installComponentFunction from "./client/components/indexFunction";
//工作流
import installWfComponent from "./client/wf/indexComponent";
import installWfFunction from "./client/wf/indexFunction";
//微应用组件
import installMasysFunction from "./client/masys/indexFunction";

//固定svg图标加载
const req = require.context("./client/assets/icons/svg", false, /.svg$/);
req.keys().forEach(svg => {
  req(svg);
});

const installDependency = app => {
  installCommonFunction(app);
  installComponent(app);
  installComponentFunction(app);
  installWfComponent(app);
  installWfFunction(app);
  installMasysFunction(app);
};

export default installDependency;