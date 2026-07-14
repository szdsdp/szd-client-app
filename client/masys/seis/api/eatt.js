import request from "../../../common/utils/request";

//详情
export function getApiEatt(eisId, szdopt) {
  return request({
    url: "/seis/eatt/api/" + eisId + "/" + szdopt,
    method: "get"
  });
}

//更新文件名称和备注 {eisId，fieldId，fileName,remark}
export function updApiFile(data) {
  return request({
    url: "/seis/eatt/api",
    method: "post",
    data: data
  });
}

//删除文件  {eisId,fileIds}
export function delApiFile(data) {
  return request({
    url: "/seis/eatt/api/delete",
    method: "post",
    data: data
  });
}

//导出文件  {eisId, fileId}
export function exportApiFile(data) {
  return request({
    url: "/seis/eatt/api/export",
    method: "post",
    data: data,
    responseType: "blob"
  });
}
