import request from "../../../client/common/utils/request";

/**
 * 消费记录-本单发票
 */
export function wfEisConsumeImg(data) {
  return request({
    url: "/core/wf/service/eis/consume/img",
    method: "post",
    data: data
  });
}

/**
 * 消费记录-个人票夹
 */
export function wfEisConsumeFol(data) {
  return request({
    url: "/core/wf/service/eis/consume/fol",
    method: "post",
    data: data
  });
}

/**
 * 消费记录-票夹到影像
 */
export function wfEisConsumeFolToImg(data) {
  return request({
    url: "/core/wf/service/eis/consume/fol/moveToImg",
    method: "post",
    data: data
  });
}

