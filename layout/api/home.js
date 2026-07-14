import request from "../../client/common/utils/request";

//交通灯信息
export function getTodoLight() {
  return request({
    url: "/core/sys/home/light/stat",
    method: "get"
  });
}

//获取条码配置，自动跳转页面
export function getByBarCode(barCode) {
  return request({
    url: `/core/dev/pro/qrCode/${barCode}`,
    method: "GET"
  });
}