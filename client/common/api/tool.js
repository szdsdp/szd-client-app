import request from "../utils/request";

// 数据加锁
export function toolCheckAuth(data) {
  return request({
    url: "/core/common/tool/check/auth",
    method: "post",
    data: data
  });
}

// 全局参数
export function toolGetGlobalParam(data) {
  return request({
    url: "/core/common/tool/global/param",
    method: "post",
    data: data
  });
}
