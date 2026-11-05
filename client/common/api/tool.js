import request from "../utils/request";

// 数据加锁
export function toolCheckAuth(data) {
  return request({
    url: "/core/common/tool/check/auth",
    method: "post",
    data: data
  });
}

// 全局参数-列表
export function toolGetGlobalList(data) {
  return request({
    url: "/core/common/tool/global/list",
    method: "post",
    data: data
  });
}

// 全局参数-键值对象
export function toolGetGlobalParam(data) {
  return request({
    url: "/core/common/tool/global/param",
    method: "post",
    data: data
  });
}
