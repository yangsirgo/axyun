import axcommon from "axcommon";
import storePhss from "@/store/modules/phss.js";
import Base64 from "@/utils/base64.js";
import { getPamars, getUserId, getUserName, getRole } from "@/utils/auth";

// 日期转换
export function dateConversion(time) {
  let format = "CCCC-CC-CC";
  const timeStr = String(time);
  let index = 0;
  let retDate = "";
  for (let i = 0, l = format.length; i < l; i++) {
    if (format[i] === "C") {
      retDate += timeStr[index++];
    } else {
      retDate += format[i];
    }
  }
  return retDate;
}
// 自适应高度
export function adaptiveHeight() {
  // console.log('storePhss', storePhss)
  let appHeight = storePhss.state.appHeight;
  let mainHeight = storePhss.state.mainHeight;
  let headerHeight = storePhss.state.headerHeight;
  console.log("appHeight", appHeight);
  console.log("mainHeight", mainHeight);
  console.log("headerHeight", headerHeight);
  let end = appHeight - mainHeight - headerHeight - 70;
  // console.log('endHeight', end)
  return end;
}
export function saveHeaderHeight(height) {
  const store = axcommon.store();
  store.dispatch("phss/saveHeaderHeight", height);
}
export function getBasicDetail() {
  let userName = Base64.decode(getUserName());
  let userId = Base64.decode(getUserId());
  let hos = getPamars();
  let role = getRole();
  let jsonData = {
    hos: hos,
    userName: userName,
    role: role,
    userId: userId
  };
  return jsonData;
}
export function getCurrentTime_() {
  let today = new Date();
  let submitTime =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return submitTime;
}
