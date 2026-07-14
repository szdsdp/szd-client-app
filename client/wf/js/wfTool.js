import { createVNode, render } from "vue";
import { $m, $mE, $mI, $mS, $mW } from "../../common/utils/globalConfig";
import wfNextUser from "../wfNextUser/wfNextUser.vue";
import wfApprInfo from "../wfApprInfo/wfApprInfo.vue";
import wfConsume from "../wfConsume/wfConsume.vue";
import szdRouter from "../../common/utils/goRouter";
import { Snackbar } from "@varlet/ui";
import { wfInit } from "../api/wfApi.js";
import { szdShShow } from "../../components/searchHelp/serchHelp";
import { szdMsgBox } from "../../components/msgBox/msgBox";

let ctx;

const const_wfOper = {
  userId: "", //处理人
  bussId: "",
  bussDocId: "", //单据号
  routerCode: "", //业务路由
  bstp: "", //业务类型
  bstpName: "",
  dyWfId: "",
  option: "C", //C创建 U更改 V显示
  //工作流按钮
  wfBtn: {
    btn_check: "U",
    btn_save: "U",
    btn_commit: "U",
    btn_approve: "",
    btn_reject: "",
    btn_print: "",
    btn_atta: "",
    btn_image: "",
    btn_record: "",
    btn_transfer: "",
    btn_meeting: "",
    btn_preAddSign: "",
    btn_postAddSign: "",
    btn_delete: "",
    btn_dyWfId: "",
    btn_consume: "",
    btn_remind: "",
    nodeType: "",
    wfExt: "",
    wfExtBefore: "" //撤回时可能需要处理特殊逻辑
  },
  wfFst: {}, //屏幕字段状态
  wfDef: {}, //缺省值
  wfOper: {
    szdopt: "V"
  }
};

/**
 * 工作流初始化
 * @param {String} routerCode 路由代码
 * @param {String} bstp 业务类型
 * @return {Promise} 返回工作流初始对象 wfOper
 */
export function init(routerCode, bstp = "") {
  return new Promise(resolve => {
    let wfOper;
    //获取路由代码,关闭标签
    const routerObj = szdRouter.getRouterObj(routerCode);
    if (!routerObj) {
      szdRouter.closeFrameTag();
      resolve(const_wfOper);
      return;
    }
    if (routerObj.bstpCount === 0) {
      $m("CORE_CLIENT.E103", routerCode); //业务路由 & 未配置业务类型
      szdRouter.closeFrameTag();
      resolve(const_wfOper);
      return;
    }
    let _bstp = bstp ? bstp : routerObj.bstp;
    //选择业务类型
    if (_bstp) {
      wfInit(_bstp).then(res => {
        if (res.code === 200) {
          wfOper = res.data;
        } else {
          wfOper = const_wfOper;
        }
        //关闭窗口
        if (wfOper.wfOper.szdopt === "V") {
          $m("CORE_CLIENT.E104"); //无操作此业务权限
          szdRouter.closeFrameTag();
        }
        resolve(wfOper);
      });
    } else {
      szdShShow({ a: "CORE_BSTP", d: [["routerCode", routerCode]] }).then(resSh => {
        if (resSh && resSh.data.length > 0) {
          wfInit(resSh.data[0].bstp).then(resDb => {
            if (resDb.code === 200) {
              wfOper = resDb.data;
            } else {
              wfOper = const_wfOper;
            }
            //关闭窗口
            if (wfOper.wfOper.szdopt === "V") {
              $m("CORE_CLIENT.E104"); //无操作此业务权限
              szdRouter.closeFrameTag();
            }
            resolve(wfOper);
          });
        } else {
          szdRouter.closeFrameTag();
          resolve(const_wfOper);
        }
      });
    }
  });
}

/**
 * 无需检查的按钮 提交数据不需要检查的按钮 //删除、拒绝、撤回、转办可以直接处理
 * @param {Object} wfEvt 工作流事件按钮
 * @return {Boolean} true 不需要调用检查 false需要检查
 */
export function btnCheck(wfEvt) {
  return ["btn_delete", "btn_reject", "btn_revoke", "btn_transfer"].includes(wfEvt.operate);
}

/**
 * 工作流审批信息
 * @param {String} bussId 业务ID
 */
export function wfInfo(bussId) {
  return new Promise((resolve, reject) => {
    if (bussId) {
      const div = document.createElement("div");
      const vNode = createVNode(wfApprInfo, {
        bussId: bussId,
        onCloseForm: () => {
          resolve(true);
          document.body.removeChild(div);
        }
      });
      vNode.appContext = ctx;
      document.body.appendChild(div);
      render(vNode, div);
    } else {
      $mE("业务bussId不能为空");
      resolve(false);
    }
  });
}

/**
 * 返回结果处理
 * @param {Object} wfParam
 * {
 *  1. retCodeF: Q.不启用工作流 C缺少审批人 B审批成功 S保存成功 E审批失败 W警告(业务程序可以设置)
 *  2. retMsg:提示消息
 *  3. retMsgBox：消息列表
 *  4. wfResult:  流程处理结果
 *  {
 *   4.1 retCode:返回代码
 *     B000-处理成功(流程结束);B001-处理成功;B002-处理成功,驳回到发起人;B005-审批通过,请等待其他人审批;B006-处理成功(无审批流程);B007-已作废;B008-单据已删除;B009-单据已作废
 *     C001-未找到审批人；C002-存在多个审批人;C003-审批人不存在或冻结;
 *     E001-节点不存在;E002-节点配置错误;E003-流程已更新，请刷新待办;E004-待办不存在;E005-系统错误;E006-当前节点不允许加签;
 *     E007-节点已处理，不允许撤回;E008-单据已审批，不允许重复操作;E009-选择用户不存在;E010-@用户不存在;E011-任务池不支持转办业务;
 *     E012-转办用户不能设置为处理人;E013-超过允许时间，不允许撤回;E014-动态流程未配置或未激活(请提交人处理);E015-号码段未配置;E016-会签节点不允许作废
 *     E017-单据状态不支持撤回;E018-固化流程未配置(请联系技术人员);E019-固化流程未分配到公司(请联系技术人员);E020-动态流程未分配公司和绩效组(请联系技术人员)
 *     E021-业务单据不存在;E022-业务不支持批量处理;E023-业务单据已提交，不允许重复提交;E024-业务单据被锁定
 *     E101-业务单据bussId未赋值(请联系技术人员);E102-业务单据保存失败(请联系技术人员);
 *     S000-处理成功;
 *   4.2 retCodeDesc:返回代码描述
 *   4.3 retDetailDesc:返回详情描述
 *   4.4 nextWfInst:下一节点实例信息
 *   {
 *     4.4.1 nodeId:下一节点编码
 *     4.4.2 nodeName:下一节点名称
 *   }
 *  }
 *  5.wfParamEvt:操作参数
 *  6.wfParamBuss:工作流传输core的参数，主要是流程字段
 * }
 * @param {Object} wfEvt 工作流事件按钮参数
 * {
 *    userId: 操作用户ID
 *    bussId: 业务Id
 *    bussDocId: 业务单据
 *    routerCode: 路由代码
 *    operate:操作事件
 *    operateOkayClose：操作事件成功后关闭窗口
 *    comments:  审批意见、转办意见
 *    addUserId: 加签用户ID
 *    tranUserId: 转办用户ID
 *    noticeUserIds: @用户ID
 *    operateReason: 操作原因
 *    rejectToFlag:  驳回方式[A.拒绝节点,B.发起人,C.指定节点]
 *    rejectToNodeCode:  驳回节点
 *    nextInstNodeId: 下一个处理节点Id
 *    nextUserId: 下一个处理人前端指定
 *    submitFlag：再次执行提交 true：提交 false: 不再执行, 针对警告后确认再次执行，和前端选择用户再次执行
 *    warningExec：警告后确认再次执行
 * }
 *
 *  @return {Promise} 返回Boolean或对象，返回false不需要处理、返回true刷新数据、返回其它对象重新提交
 */
export function retInfo(wfParam, wfEvt) {
  return new Promise(resolve => {
    //再次执行提交-重置
    if (wfEvt) {
      wfEvt.submitFlag = false;
      wfEvt.warningExec = false;
    }
    //消息弹框
    szdMsgBox(wfParam.retMsgBox, wfParam.retCodeF === "W").then(resMsg => {
      if (resMsg) {
        wfParam.retMsg = wfParam.retMsg || $m("CORE_CLIENT.E105", "", false, true); //技术错误，未返回任何信息
        if (wfParam.retCodeF === "Q") {
          resolve(true);
        } else if (wfParam.retCodeF === "C") {
          Snackbar.warning(wfParam.retMsg);
          nextUser(wfParam).then(resNext => {
            // 前端指定下一个处理人
            if (wfEvt && resNext !== true && resNext.nextUserId) {
              wfEvt.nextInstNodeId = wfParam.wfParamEvt && wfParam.wfParamEvt.nextInstNodeId ? wfParam.wfParamEvt.nextInstNodeId : "";
              wfEvt.nextUserId = resNext.nextUserId;
              wfEvt.submitFlag = true;
            }
            resolve(resNext);
          });
        } else if (wfParam.retCodeF === "B" || wfParam.retCodeF === "S") {
          Snackbar.success(wfParam.retMsg);
          //关闭窗口
          if ((wfParam.wfParamEvt && wfParam.wfParamEvt.operateOkayClose === true) || (wfParam.wfResult && wfParam.wfResult.retCode === "B008")) {
            szdRouter.closeFrameTag();
          }
          resolve(true);
        } else if (wfParam.retCodeF === "W") {
          Snackbar.warning(wfParam.retMsg);
          // 警告后确认，再继续处理
          if (wfEvt) {
            wfEvt.submitFlag = true;
            wfEvt.warningExec = true;
          }
          resolve(true);
        } else {
          Snackbar.error(wfParam.retMsg);
          resolve(false);
        }
      } else {
        if (wfParam.retMsg) {
          if (wfParam.retCodeF === "E") {
            Snackbar.error(wfParam.retMsg);
          } else {
            Snackbar.warning(wfParam.retMsg);
          }
        }
        resolve(false);
      }
    });
  });
}

/**
 * 选择下一审批用户
 * @param {Object} wfParam
 * @return {Promise} 返回对象是选择的用户
 */
export function nextUser(wfParam) {
  return new Promise((resolve, reject) => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(wfNextUser, {
      wfParam: wfParam,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
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
 * 自定义工作流按钮初始化
 * @param {Object} param 参数同返回参数
 * @return {Object} 返回对象
 * {
 * userId:用户Id,
 * bussId:业务Id,
 * bussDocId:业务单号,
 * routerCode:路由代码,
 * operate:操作事件枚举：['btn_check.检查','btn_save.保存','btn_commit.提交','btn_approve.同意','btn_reject.驳回','btn_revoke.撤回','btn_transfer.转办','btn_preAddSign.前加签','btn_postAddSign.后加签','btn_delete.作废']
 * comments:  审批意见、转办意见
 * addUserId:加签ID, addUserName:加签姓名,
 * tranUserId:转办ID, tranUserName:转办姓名,
 * noticeUserIds:@用户ID, noticeUserNames: @用户姓名,
 * operateReason: 操作原因
 * rejectToFlag:  驳回方式[A.拒绝节点,B.发起人,C.指定节点]
 * rejectToNodeCode:  驳回节点
 * nextInstNodeId: 下一个处理节点Id
 * nextUserId:下一个处理人前端指定, nextUserName: 下一审批用户姓名,
 * submitFlag：再次执行提交 true：提交 false: 不再执行, 针对警告后确认再次执行，和前端选择用户再次执行
 * warningExec：警告后确认再次执行
 * }
 * */
export function wfEvtInit(param) {
  return {
    userId: param && param.userId ? param.userId : "",
    bussId: param && param.bussId ? param.bussId : "",
    bussDocId: param && param.bussDocId ? param.bussDocId : "",
    routerCode: param && param.routerCode ? param.routerCode : "",
    operate: param && param.operate ? param.operate : "",
    comments: param && param.comments ? param.comments : "",
    addUserId: param && param.addUserId ? param.addUserId : "",
    addUserName: param && param.addUserName ? param.addUserName : "",
    tranUserId: param && param.tranUserId ? param.tranUserId : "",
    tranUserName: param && param.tranUserName ? param.tranUserName : "",
    noticeUserIds: param && param.noticeUserIds ? param.noticeUserIds : "",
    noticeUserNames: param && param.noticeUserNames ? param.noticeUserNames : "",
    operateReason: param && param.operateReason ? param.operateReason : "",
    rejectToFlag: param && param.rejectToFlag ? param.rejectToFlag : "",
    rejectToNodeCode: param && param.rejectToNodeCode ? param.rejectToNodeCode : "",
    nextInstNodeId: param && param.nextInstNodeId ? param.nextInstNodeId : "",
    nextUserId: param && param.nextUserId ? param.nextUserId : "",
    submitFlag: false,
    warningExec: false
  };
}

/**
 * 消费记录
 * @param {Object} bussParam 参数 {bussId业务Id,bstp业务类型,invList:[]已存在发票清单}
 * @return {Promise} 返回数组是选择的消费记录
 */
export function consume(bussParam) {
  return new Promise((resolve, reject) => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(wfConsume, {
      bussParam: bussParam,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
        if (!resolveFlag) {
          reject(false);
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
 * 返回消息提示
 * @param {Object} retParam 参数 {status: 状态,msg:消息,retMsgBox:消息框}
 */
export function retMsg(retParam) {
  if (retParam) {
    szdMsgBox(retParam.retMsgBox).then();
    if (retParam.msg) {
      if (retParam.status === "S") {
        $mS(retParam.msg);
      } else if (retParam.status === "E") {
        $mE(retParam.msg);
      } else if (retParam.status === "W") {
        $mW(retParam.msg);
      } else {
        $mI(retParam.msg);
      }
    }
  }
}

/**
 * 设置上下文
 */
export function setWfAppTool(app) {
  ctx = app._context;
}
