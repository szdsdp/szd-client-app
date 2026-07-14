import request from "../../common/utils/request";
// 新增请求
export function addTr(data) {
  return request({
    url: "/core/tr",
    method: "post",
    data: data
  });
}

// 查询未释放的请求列表
export function listTrNoRelease() {
  return request({
    url: "/core/tr/list/no/release",
    method: "get"
  });
}

