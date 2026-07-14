import { Dialog } from "@varlet/ui";
import { $mR, $t } from "../utils/globalConfig";

/**
 * 确认提示
 * @param {String|Array} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPop(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let _msgR = $mR(msgText, true);
    let msg = _msgR ? _msgR : $t("请确认?");
    Dialog({
      title: $t("请确认"),
      message: msg,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      dialogStyle: { background: "#fff" }
    })
      .then(act => {
        if (act === "confirm") {
          resolve(true);
        } else if (catchFlag) {
          reject(false);
        }
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}

/**
 * 保存确认提示
 * @param {String|Array} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPopSave(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let _msgR = $mR(msgText, true);
    let msg = _msgR ? _msgR : $t("数据保存，请确认?");
    Dialog({
      title: $t("警告"),
      message: msg,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      dialogStyle: { background: "#fff" }
    })
      .then(act => {
        if (act === "confirm") {
          resolve(true);
        } else if (catchFlag) {
          reject(false);
        }
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}

/**
 * 删除确认提示
 * @param {String|Array} msgText 消息
 * @param {Boolean} catchFlag 关闭触发catch
 */
export function szdPopDel(msgText = "", catchFlag = false) {
  return new Promise((resolve, reject) => {
    let _msgR = $mR(msgText, true);
    let msg = _msgR ? _msgR : $t("数据将被删除，请确认?");
    Dialog({
      title: $t("警告"),
      message: msg,
      confirmButtonText: $t("确定"),
      cancelButtonText: $t("取消"),
      dialogStyle: { background: "#fff" }
    })
      .then(act => {
        if (act === "confirm") {
          resolve(true);
        } else if (catchFlag) {
          reject(false);
        }
      })
      .catch(action => {
        if (catchFlag) {
          reject(false);
        }
      });
  });
}
