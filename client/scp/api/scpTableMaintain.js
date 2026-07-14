import request from "../../common/utils/request";

//查询表配置
export function getTableConfig(sysCode, tableCode) {
  return request({
    url: "/core/dev/table/config/" + sysCode + "/" + tableCode,
    method: "get"
  });
}

// 查询详细
// {  func: {}, dataObj: {} }
export function getTableMaintain(sysCode, data) {
  return request({
    url: "/" + sysCode.toLowerCase() + "/scp/table/maintain/get",
    method: "post",
    data: data
  });
}

// 新增
// { func: {}, dataObj: {}, tr:{} }
export function addTableMaintain(sysCode, data) {
  return request({
    url: "/" + sysCode.toLowerCase() + "/scp/table/maintain/add",
    method: "post",
    data: data
  });
}

// 修改
// { func: {}, dataObj: {}, tr:{} }
export function updTableMaintain(sysCode, data) {
  return request({
    url: "/" + sysCode.toLowerCase() + "/scp/table/maintain/upd",
    method: "post",
    data: data
  });
}
