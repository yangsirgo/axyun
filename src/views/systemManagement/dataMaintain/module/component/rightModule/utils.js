import {
    getsonDoctorAdviceList
} from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import Vue from "vue";
let vObject = new Vue();

export function getsonDoctorAdviceListFunc(ajax) {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        data,
        code,
        msg
      } = await getsonDoctorAdviceList(ajax);
      if (code == 1) {
        resolve(data || []);
      } else {
        vObject.$message.error(msg || "获取医嘱子类列表失败！");
        reject(false);
      }
    } catch (error) {
      reject(false);
      vObject.$message.error("获取医嘱子类列表失败！");
    }
  })
}
