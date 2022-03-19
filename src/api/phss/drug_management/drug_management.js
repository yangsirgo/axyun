import {post, get, put, del} from "@/utils/request";
const url = "/phss";
// 保存药品
export function saveSysDrugManager(data) {
  return post(url + "/sysDrugManager/saveSysDrugManager", data, true);
}
// getBaseDrugData获取药品的下拉框内容
export function getBaseDrugData(data) {
  return post(url + "/sysDrugManager/getBaseDrugData", data, true);
}
//获取药品列表
// getDrugData
export function getDrugData(data) {
  return post(url + "/sysDrugManager/getDrugData", data, true);
}
//删除  药品
export function delSysDrugManager(data) {
  return del(url + `/sysDrugManager/${data.id}`, data, true);
}
