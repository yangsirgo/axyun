import { getListAlert } from "@/api/third/third.js";
import { cancelSuspendAjax } from "@/api/cis/visit/visit";

import vueObj from "vue";
let newVueObj = new vueObj();

// 查询患者代办信息
export function getTodoList(ajaxData) {
  return new Promise(async (resolve, reject) => {
    try {
      let { data, code, success, msg } = await getListAlert(ajaxData);
      if (success) {
        if (data && data.length > 0) {
          resolve(data);
        } else {
          reject(false);
        }
      } else {
        if (msg) {
          // newVueObj.$message.error(msg || "查询患者代办信息失败！");
        }
        reject(false);
      }
    } catch (error) {
      newVueObj.$message.error("查询患者代办信息失败！");
      reject(false);
    }
  });
}

export function getActiveName(visitStatus) {
  // 待诊1 已诊 2
  let activeName = "first";
  //待诊1 诊中2 结束3
  switch (visitStatus) {
    case "1":
      activeName = "first";
      break;
    case "2":
      activeName = "second";
      break;
    case "3":
      activeName = "third";
      break;
    default:
      activeName = "first";
  }

  return activeName;
}

// 取消暂挂状态
export function cancelSuspend(visitId) {
  return new Promise(async (resolve, reject) => {
    try {
      let { data, code, success, msg } = await cancelSuspendAjax(visitId);
      if (success) {
        resolve(data);
        newVueObj.$message.success(msg || "取消暂挂成功");
      } else {
        newVueObj.$message.error(msg || "取消暂挂失败");
        reject(false);
      }
    } catch (error) {
      newVueObj.$message.error("取消暂挂失败");
      reject(false);
    }
  });
}
