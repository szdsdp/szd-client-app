//区域
import area from "./area/area.vue";
import areaCtrl from "./area/areaCtrl.vue";
//小数位和千分位符
import dot from "./dot/dot.vue";
//分页组件
import pagination from "./pagination/pagination.vue";
//input输入框
import input from "./input/input.vue";
import inputCtrl from "./input/inputCtrl.vue";
//inputNumber输入框
import inputNumber from "./inputNumber/inputNumber.vue";
import inputNumberCtrl from "./inputNumber/inputNumberCtrl.vue";
//date输入框
import date from "./date/date.vue";
import dateCtrl from "./date/dateCtrl.vue";
//time输入框
import time from "./time/time.vue";
import timeCtrl from "./time/timeCtrl.vue";
//扫码
import scanInput from "./scan/scanInput.vue";
import scanPopup from "./scan/scanPopup.vue";
//text文本
import text from "./text/text.vue";
//titleLabel标题标签
import titleLabel from "./title/titleLabel.vue";
//textArea多行文本
import textarea from "./textarea/textarea.vue";
import textareaCtrl from "./textarea/textareaCtrl.vue";
//password输入框
import password from "./password/password.vue";
import passwordCtrl from "./password/passwordCtrl.vue";
//下拉框
import select from "./select/select.vue";
import selectCtrl from "./select/selectCtrl.vue";
//单选
import radio from "./radio/radio.vue";
import radioCtrl from "./radio/radioCtrl.vue";
//复选框
import checkbox from "./checkbox/checkbox.vue";
import checkboxCtrl from "./checkbox/checkboxCtrl.vue";
import checkboxAll from "./checkbox/checkboxAll.vue";
//按钮
import button from "./button/button.vue";
import buttonCtrl from "./button/buttonCtrl.vue";
//高级搜索帮助
import seniorSch from "./seniorSearch/seniorSearch.vue";
import seniorSchArea from "./seniorSearch/seniorSearchArea.vue";
//card卡片
import cardA from "./card/cardA.vue";
import cardRowSpan from "./card/cardRowSpan.vue";
import cardRowTitle from "./card/cardRowTitle.vue";
//svg图标
import svgIcon from "./svgIcon/svgIcon.vue";
//list清单
import list from "./list/list.vue";
//list清单
import table from "./table/table.vue";
//nothing 无数据
import nothing from "./nothing/nothing.vue";
//dialog
import dialogTitle from "./dialog/dialogTitle.vue";
//iframe或组件渲染
import ifr from "./ifr/ifr.vue";
//文件预览
import fileView from "./fileView/fileView.vue";
//文件上传
import uploadView from "./upload/uploadView.vue";
import uploadViewCtrl from "./upload/uploadViewCtrl.vue";
//回退按钮
import topBack from "./topBack/topBack.vue";
//交通灯
import light from "./light/light.vue";

const installComponent = app => {
  app.component("szd-area", area);
  app.component("szd-area-ctrl", areaCtrl);
  app.component("szd-dot", dot);
  app.component("szd-pagination", pagination);
  app.component("szd-input", input);
  app.component("szd-input-ctrl", inputCtrl);
  app.component("szd-input-number", inputNumber);
  app.component("szd-input-number-ctrl", inputNumberCtrl);
  app.component("szd-date", date);
  app.component("szd-date-ctrl", dateCtrl);
  app.component("szd-time", time);
  app.component("szd-time-ctrl", timeCtrl);
  app.component("szd-scan", scanInput);
  app.component("szd-scan-popup", scanPopup);
  app.component("szd-text", text);
  app.component("szd-title-label", titleLabel);
  app.component("szd-textarea", textarea);
  app.component("szd-textarea-ctrl", textareaCtrl);
  app.component("szd-password", password);
  app.component("szd-password-ctrl", passwordCtrl);
  app.component("szd-select", select);
  app.component("szd-select-ctrl", selectCtrl);
  app.component("szd-radio", radio);
  app.component("szd-radio-ctrl", radioCtrl);
  app.component("szd-checkbox", checkbox);
  app.component("szd-checkbox-ctrl", checkboxCtrl);
  app.component("szd-checkbox-all", checkboxAll);
  app.component("szd-button", button);
  app.component("szd-button-ctrl", buttonCtrl);
  app.component("szd-sch", seniorSch);
  app.component("szd-sch-area", seniorSchArea);
  app.component("szd-card-a", cardA);
  app.component("szd-card-row-span", cardRowSpan);
  app.component("szd-card-row-title", cardRowTitle);
  app.component("szd-svg", svgIcon);
  app.component("szd-list", list);
  app.component("szd-table", table);
  app.component("szd-nothing", nothing);
  app.component("szd-dialog-title", dialogTitle);
  app.component("szd-ifr", ifr);
  app.component("szd-file-view", fileView);
  app.component("szd-upload-view", uploadView);
  app.component("szd-upload-view-ctrl", uploadViewCtrl);
  app.component("szd-top-back", topBack);
  app.component("szd-light", light);
};
export default installComponent;
