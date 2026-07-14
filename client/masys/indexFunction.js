//电子影像
import setSeis, { szdSeisEatt } from "./seis/js/seis";

const installMasysFunction = app => {
  //电子影像
  setSeis(app);
  app.config.globalProperties.szdSeisEatt = szdSeisEatt;
};

export default installMasysFunction;
