import upload from "./upload.vue";
import { createVNode, render } from "vue";

let ctx;

/**
 * 上传组件
 *  @param {Object}  updParams:{
 *    limit: 1, //最大上传文件数
 *    fileSize: undefined, //文件大小-KB
 *    dimension: [],  //尺寸[宽-最小，宽-最大，高-最小，高-最大]
 *    accept: "", //上传文件类型 ".xls,.xlsx"
 *    acceptTxt: "", //提示信息
 *    extensions: [], //文件后缀
 *    uploadUrl: "", //上传地址
 *    fileCate: "", //附件类别-根目录
 *    filePath: "", //文件路径
 *    bussId: "", //业务id
 *    showMsgBox: true, //显示消息
 *    //压缩图片
 *    compress: {
 *      compress: false, //是否压缩
 *      fileSize: 1024,  //超过多大进行压缩KB
 *      quality: 0.8, //压缩质量
 *      widthMax: 1600, //压缩最大宽度
 *      widthMin: 100   //压缩最小宽度
 *    }
 * }
 * @return {Promise} 返回参数说明
 * [{
 *    light 指示灯	Number、String	枚举：1.红灯 2.黄灯 3.绿灯 其它灰灯
 *    retCode 错误代码	string
 *    retMsg 错误消息	string
 *    bussId 业务id	String
 *    fileName 文件名	String
 *    filePath 文件路径	String
 * }]
 *
 */
export function szdUpload(updParams) {
  return new Promise(resolve => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(upload, {
      updParams: updParams,
      onUploadResult: res => {
        resolve(res);
        resolveFlag = true;
      },
      onCloseDialog: () => {
        if (!resolveFlag) {
          resolve(false);
        }
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
const setShUpload = function (app) {
  ctx = app._context;
};

export default setShUpload;
