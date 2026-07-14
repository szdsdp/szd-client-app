import { createVNode, render } from "vue";
import fileViewPopup from "./fileViewPopup.vue";
import { $m } from "../../common/utils/globalConfig";
import szdFile from "../../common/tools/fileTool";

let ctx;

/**
 * 文件预览
 * {
 *  @param {String} src 文件地址
 *  @param {String} fileName 文件名称或后缀
 *  @param {String} title 预览标题
 *  @param {Boolean} download 下载文件
 *  @param {Array} fileList 文件列表{src:文件地址,fileName文件名称或后缀}
 *  @param {Number} fileIndex 文件索引
 * }
 */
export function szdFileView({ src = "", fileName = "", title = "", download = true, fileList = [], fileIndex = 0 }) {
  let _fileList = [];
  let _fileIndex = -1;
  if (Array.isArray(fileList) && fileList.length > 0) {
    for (let i = 0; i < fileList.length; i++) {
      let item = fileList[i];
      if (!item.src) {
        $m("CORE_CLIENT.E018"); //src地址不能为空
        return;
      }
      let _fileName = item.fileName ? item.fileName : item.src;
      if (szdFile.getFileViewType(_fileName)) {
        _fileList.push({ src: item.src, fileName: item.fileName });
        if (i <= fileIndex) _fileIndex++;
      } else if (i === fileIndex) {
        $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
        return;
      }
    }
    if (_fileList.length === 0) {
      $m("CORE_CLIENT.E019"); //未存在可预览的文件或不支持在线预览
      return;
    }
    if (_fileList.length !== fileList.length) {
      $m("CORE_CLIENT.W117", [fileList.length, _fileList.length]); //预览的&个文件，有&个支持在线预览，其它文件请下载预览
    }
  } else {
    if (!src) {
      $m("CORE_CLIENT.E018"); //src地址不能为空
      return;
    }
    let _fileName = fileName ? fileName : src;
    //检查文件类型是否可以在线打开
    if (!szdFile.getFileViewType(_fileName)) {
      if (download) {
        szdFile.downloadFile(src, fileName);
      } else {
        $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
      }
      return;
    }
    _fileList.push({ src: src, fileName: fileName });
    _fileIndex = 0;
  }
  //预览文件
  return new Promise(resolve => {
    const div = document.createElement("div");
    const vNode = createVNode(fileViewPopup, {
      fileList: _fileList,
      fileIndex: _fileIndex,
      title: title,
      download: download,
      onCloseForm: () => {
        resolve(true);
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

/**
 * 设置上下文
 */
const setFileView = function (app) {
  ctx = app._context;
};

export default setFileView;
