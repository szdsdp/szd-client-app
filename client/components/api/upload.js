import request from "../../common/utils/request";

//下载模板
export function downloadTemplate(fileName) {
  return request({
    url: "/core/dev/pro/template/download?fileName=" + fileName,
    method: "get",
    responseType: "blob"
  });
}

/**
 * 上传文件-Base64上传
 * @param {String} uploadUrl 上传地址 默认上传地址 /core/common/file/upload
 * @param {Object} data 上传数据 {bussId,fileCate,filePath,fileUpload:[{fileName,fileBase64}]}
 */
export function uploadFile(uploadUrl = "/core/common/file/upload", data) {
  return request({
    url: uploadUrl,
    method: "post",
    data: data
  });
}

/**
 * 根据Url地址下载文件-附件流
 */
export function downloadFileUrl(url) {
  return request({
    url: "/core/common/file/view",
    method: "get",
    params: { url },
    responseType: "blob"
  });
}

/***
 * 标签组件文件处理、预览、上传、删除、更新单号
 * */

//查询文件 fileObjId
export function getUploadViewList(fileObjId, showDelete) {
  return request({
    url: "/core/file/uploadView/" + fileObjId + "/" + showDelete,
    method: "get"
  });
}

//上传文件-程序内职级使用 requestUpload
export function uploadUploadViewFile(data) {
  return request({
    url: "/core/file/uploadView",
    method: "post",
    data: data
  });
}

//更新对象号下所有业务单号 {fileObjId, bussId，bussDocId }
export function updUploadViewFileBuss(data) {
  return request({
    url: "/core/file/uploadView/update/buss",
    method: "post",
    data: data
  });
}

//更新文件 {fileObjId, fileId, fileName, fileDel }
export function updUploadViewFileById(data) {
  return request({
    url: "/core/file/uploadView/update/file",
    method: "post",
    data: data
  });
}

//压缩下载 [文件对象号,文件对象号]
export function downloadZipUploadViewFile(fileObjIds, fileDel) {
  return request({
    url: "/core/file/uploadView/downloadZip",
    method: "post",
    data: { fileObjIds: fileObjIds, fileDel: fileDel },
    responseType: "blob"
  });
}
