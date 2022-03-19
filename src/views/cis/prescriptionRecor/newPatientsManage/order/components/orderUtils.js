/* eslint-disable consistent-return */
import baseApi from "@/api/hmm/base.js";
import { getTextFromCode } from "@/api/cis/order/order.js";

//频次code 转 text
export function frequencyCodeToText(fCode) {
  if (typeof fCode === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    baseApi.getFrequencyPageList({pageSize: 50}).then((res) => {
      let {
        data,
        msg,
        code
      } = res;
      if (code === 1 && data.length > 0) {
        let codeObject = data.find((item) => {
          return item.frequencyCode === fCode
        });
        if (codeObject) {
          resolve(codeObject.frequencyName);
        } else {
          reject("频次code 转 text 错误！");
        }
      } else {
        this.$message.error(msg || "频次数据获取失败！");
        reject("频次code 转 text 错误！");
      }
    }).catch((error)=>{
        this.$message.error("频次数据获取失败！");
        reject("频次code 转 text 错误！");
    });
  });
}

//用法code 转 text
export function useWayCodeToText(uCode) {
  if (typeof uCode === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    getTextFromCode({pageSize: 50}, "MedicationRouteCode").then((res) => {
      let {
        data,
        msg,
        code
      } = res;
      if (code === 1 && data.length > 0) {
        let codeObject = data.find((item) => {
          return item.code === uCode
        });
        if (codeObject) {
          resolve(codeObject.name);
        } else {
          reject("用法code 转 text 错误！");
        }
      } else {
        this.$message.error(msg || "用法数据获取失败！");
        reject("用法code 转 text 错误！");
      }
    }).catch((error)=>{
        this.$message.error("用法数据获取失败！");
        reject("用法code 转 text 错误！");
    });
  });
}

//性别code 转 text
export function sexCodeToText(sCode) {
  if (typeof sCode === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    getTextFromCode({pageSize: 50}, "GENDER_CODE").then((res) => {
      let {
        data,
        msg,
        code
      } = res;
      if (code === 1 && data.length > 0) {
        let codeObject = data.find((item) => {
          return item.code === sCode
        });
        if (codeObject) {
          resolve(codeObject.name);
        } else {
          reject("用法code 转 text 错误！");
        }
      } else {
        this.$message.error(msg || "用法数据获取失败！");
        reject("用法code 转 text 错误！");
      }
    }).catch((error)=>{
        this.$message.error("用法数据获取失败！");
        reject("用法code 转 text 错误！");
    });
  });
}


//性别code 转 text
export function getTextFromCodeFunc(sCode, tCode) {
  if (typeof sCode === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    getTextFromCode({pageSize: 50}, tCode).then((res) => {
      let {
        data,
        msg,
        code
      } = res;
      if (code === 1 && data.length > 0) {
        let codeObject = data.find((item) => {
          return item.code === sCode
        });
        if (codeObject) {
          resolve(codeObject.name);
        } else {
          reject("code 转 text 错误！");
        }
      } else {
        this.$message.error(msg || "数据获取失败！");
        reject("code 转 text 错误！");
      }
    }).catch((error)=>{
        this.$message.error("数据获取失败！");
        reject("code 转 text 错误！");
    });
  });
}
