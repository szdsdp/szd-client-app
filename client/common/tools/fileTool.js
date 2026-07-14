import sDate from "./date";
import { $m } from "../utils/globalConfig";
import { downloadFileUrl, downloadZipUploadViewFile } from "../../components/api/upload";
import { szdFileView as fileView } from "../../components/fileView/fileView";

/**
 * 下载文件-地址方式
 * @param {String} scr 文件地址
 * @param {String} fileName 下载的文件名称
 */
function downloadFile(scr, fileName = "") {
  if (!scr) return $m("CORE_CLIENT.E018"); //src地址不能为空
  if (scr.toString().startsWith("blob:")) {
    downloadFileA(scr, fileName).then();
  } else {
    try {
      downloadFileUrl(scr).then(res => {
        const fileExt = getFileExtension(fileName || scr);
        downloadFileBlob(res, fileExt, fileName);
      });
    } catch (err) {
      downloadFileA(scr, fileName).then();
    }
  }
}

//不打开浏览器，直接下载文件
async function downloadFileA(url, fileName) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName || sDate.format(undefined, "YYYYMMDDHHmmss"); // 自定义文件名;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    // $m("CORE_CLIENT.S010"); //导出文件成功
  } catch (err) {
    console.warn("跨域问题，文件下载失败：", err);
    downloadFileB(url, fileName);
  }
}

//a标签下载模式
function downloadFileB(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || sDate.format(undefined, "YYYYMMDDHHmmss"); // 自定义文件名;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // $m("CORE_CLIENT.S010"); //导出文件成功
}

/**
 * 下载文件-字节流方式
 * @param {Blob} fileStream 文件流
 * @param {String} fileExt 文件后缀或文件名
 * @param {String} fileName 下载的文件名称
 */
function downloadFileBlob(fileStream, fileExt = "", fileName = "") {
  let blob = new Blob([fileStream], { type: getFileMimeType(fileExt || fileName) });
  let blobUrl = URL.createObjectURL(blob); // 创建URL
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName || sDate.format(undefined, "YYYYMMDDHHmmss"); // 自定义文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
  // $m("CORE_CLIENT.S010"); //导出文件成功
}

/**
 * 根据对象号-下载文件-zip格式
 * @param {Array || String} fileObjIds 文件对象号
 * @param {Boolean} fileDel 是否下载删除文件
 */
function downloadFileZip(fileObjIds, fileDel = false) {
  if (!fileObjIds || (Array.isArray(fileObjIds) && fileObjIds.length === 0)) return;
  let _fileObjIds = Array.isArray(fileObjIds) ? fileObjIds : [fileObjIds];
  downloadZipUploadViewFile(_fileObjIds, fileDel).then(res => {
    downloadFileBlob(res, "zip");
  });
}

/**
 * 获取文件后缀
 * @param {String} scr 文件地址或文件名
 */
function getFileExtension(scr) {
  if (!scr) return "";
  let _ext = scr.split("/").pop().split("?")[0];
  return _ext.includes(".") ? _ext.split(".").pop() : "";
}

/**
 * 常用文件图标
 * @return {Object} 返回常用图片对象
 */
function getFileTypeIcon() {
  return {
    pdf: require("../../assets/icons/pdf.png"),
    doc: require("../../assets/icons/doc.png"),
    docx: require("../../assets/icons/doc.png"),
    xls: require("../../assets/icons/xls.png"),
    xlsx: require("../../assets/icons/xls.png"),
    ppt: require("../../assets/icons/ppt.png"),
    pptx: require("../../assets/icons/ppt.png"),
    csv: require("../../assets/icons/csv.png"),
    html: require("../../assets/icons/html.png"),
    txt: require("../../assets/icons/txt.png"),
    xml: require("../../assets/icons/xml.png"),
    json: require("../../assets/icons/json.png"),
    video: require("../../assets/icons/video.png"),
    zip: require("../../assets/icons/zip.png"),
    obj: require("../../assets/icons/obj.png")
  };
}

/**
 * 根据文件名获取 Mime Type
 * @return {String} 返回文件类型MIME
 */
function getFileMimeType(fileName) {
  if (!fileName) return "application/octet-stream";
  let ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) ext = fileName.toLowerCase();
  const map = {
    //文本类
    html: "text/html",
    htm: "text/html",
    xml: "application/xml",
    json: "application/json",
    txt: "text/plain",
    md: "text/markdown",
    css: "text/css",
    js: "application/javascript",
    csv: "text/csv",
    yaml: "text/yaml",
    yml: "text/yaml",
    //图片类
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    avif: "image/avif",
    tiff: "image/tiff",
    tif: "image/tiff",
    //Office 文档 & PDF
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    pdf: "application/pdf",
    //压缩类
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    gz: "application/gzip",
    tar: "application/x-tar",
    sevenz: "application/x-7z-compressed",
    bz2: "application/x-bzip2",
    xz: "application/x-xz",
    //视频类
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    avi: "video/x-msvideo",
    wmv: "video/x-ms-wmv",
    mov: "video/quicktime",
    flv: "video/x-flv",
    mkv: "video/x-matroska",
    webm: "video/webm",
    ogg: "video/ogg",
    "3gp": "video/3gpp",
    //音频类型
    mp3: "audio/mpeg",
    wav: "audio/wav",
    flac: "audio/flac",
    m4a: "audio/mp4",
    wma: "audio/x-ms-wma",
    oga: "audio/ogg",
    weba: "audio/webm",
    //字体类
    ttf: "font/ttf",
    woff: "font/woff",
    woff2: "font/woff2",
    eot: "application/vnd.ms-fontobject",
    otf: "font/otf",
    //其他常用/二进制
    exe: "application/octet-stream",
    bin: "application/octet-stream",
    wasm: "application/wasm",
    manifest: "application/manifest+json"
  };
  return map[ext] || "application/octet-stream"; // 未知类型用默认值
}

/**
 * 支持在线预览的文件类型
 * @param {String} fileName 地址或文件名称
 * @return  {String} 文件类型
 */
function getFileViewType(fileName) {
  if (!fileName) return "";
  const fileExt = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "svg", "avif", "tiff", "tif"].includes(fileExt)) {
    return "img";
  } else if (fileExt === "xls") {
    return "xls";
  } else if (fileExt === "xlsx") {
    return "xlsx";
  } else if (fileExt === "docx") {
    return "docx";
  } else if (fileExt === "pdf") {
    return "pdf";
  } else if (fileExt === "txt") {
    return "txt";
  } else if (["html", "htm", "xhtml"].includes(fileExt)) {
    return "html";
  } else if (["xml"].includes(fileExt)) {
    return "xml";
  } else if (["json", "js", "css", "yaml", "yml"].includes(fileExt)) {
    return "json";
  } else if (["mp4", "mpeg", "mpg", "avi", "wmv", "mov", "flv", "mkv", "webm", "ogg", "3gp"].includes(fileExt)) {
    return "video";
  } else if (["mp3", "wav", "flac", "m4a", "wma", "oga", "weba"].includes(fileExt)) {
    return "video";
  } else {
    return "";
  }
}

const szdFile = {
  downloadFile,
  downloadFileBlob,
  downloadFileZip,
  getFileExtension,
  getFileTypeIcon,
  getFileMimeType,
  getFileViewType,
  fileView
};

export default szdFile;
