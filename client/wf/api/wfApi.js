import request from "../../../client/common/utils/request";

//新增初始化
export function wfInit(bussType) {
  return request({
    url: "/core/wf/service/init/" + bussType,
    method: "get"
  });
}

//电子影像
export function wfEisImg(params) {
  return request({
    url: "/core/wf/service/eis/img",
    method: "post",
    data: params
  });
}

//评审
export function wfAddMeeting(bussId) {
  return request({
    url: "/core/wf/per/meet/send/add/" + bussId,
    method: "post"
  });
}

//接口调用流程审批
export function wfApproveRemote(wfEvt) {
  return request({
    url: "/core/wf/service/approveRemote",
    method: "post",
    data: wfEvt
  });
}

//审批信息
export function wfApprInfo(bussId) {
  return request({
    url: "/core/wf/service/apprInfo/" + bussId,
    method: "get"
  });
}

//评审消息详情
export function wfMsgList(bussId, nodeDoc) {
  return request({
    url: "/core/wf/per/meet/msg/list/" + bussId + "/" + nodeDoc,
    method: "get"
  });
}

//根据业务单号、路由、业务类型 查询业务主体
export function wfGetBussObj(data) {
  return request({
    url: "/core/wf/service/get/bussDocId",
    method: "post",
    data: data
  });
}

// 查询默认业务小类
export function getDefaultBsub(bstp, struct) {
  return request({
    url: "/core/sys/bussType/defaultBsub/" + bstp + "/" + struct,
    method: "get"
  });
}

// 业务类型配置的业务小类
export function getBstpBsub(bstp) {
  return request({
    url: "/core/sys/bussType/bussSubType/" + bstp,
    method: "get"
  });
}

// 单据催办
export function wfRemind(data) {
  return request({
    url: "/core/wf/service/remind",
    method: "post",
    data: data
  });
}

// 查询抄送人
export function getWfCcUser(data) {
  return request({
    url: "/core/wf/fixed/node/cc/person",
    method: "post",
    data: data
  });
}

// 保存抄送人
export function saveWfCcUser(data) {
  return request({
    url: "/core/wf/fixed/node/cc/person/save",
    method: "post",
    data: data
  });
}
