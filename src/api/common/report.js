import {
  post,
  get,
  put,
  del,
  patch
} from '@/utils/request'
const url = "/common";
const urlA = "/patient";

// 人体图 患者诊断结果
export function getPatientRes(id) {
  return get(urlA +`/archInfo/diagnosis/${id}`, {}, false)
}

// 传染病报卡 获取患者基本信息
export function getPatientInfo(id) {
  return get(urlA +`/archive/${id}`, {}, false)
}
//2020/20/01  获取患者 基本信息
export function getPatientArchInfo(query) {
    return post(urlA +"/archInfo/getPatientArchInfo", query, false)
}
// 提交（旧）
export function savePatientInfoOld(data) {
  return post(url +"/infectiousDiseaseCard/save", data, false);
}
// 提交（新）
export function savePatientInfo(data) {
  return post(url +"/infectiousDiseaseCard/submitInfectiousDiseaseCard", data, false);
}
// new 报卡 左侧的接口（旧）
export function reportCardInfoByPIdOld(data) {
  return post(url +"/infectiousDiseaseCard/reportCardInfoByPId", data, false);
}
// new 报卡 左侧的接口（新）
export function reportCardInfoByPId(data) {
  return get(url +`/infectiousDiseaseCard/queryAllReportCardByTreatNo/${data.inpNo}`, "", false);
}
// /foodBorneCard/saveFoodBorneCard暂存接口
export function saveFoodBorneCard(data) {
  return post(url +"/foodBorneCard/saveFoodBorneCard", data, false);
}
// 查询报表列表数据
export function queryInfectiousDiseaseCard(data) {
  return post(url +`/infectiousDiseaseCard/queryInfectiousDiseaseCard/${data.pageNum}/${data.pageSize}`, data, false);
}
// 暂存
export function cacheInfectiousDiseaseCard(data) {
  return post(url +"/infectiousDiseaseCard/saveInfectiousDiseaseCard", data, false);
}
export function getInfectiousDiseaseCard(data) {
  return get(url +"/infectiousDiseaseCard/" + data, {}, false);
}
// 删除报卡
export function deleteInfectiousDiseaseCard(data) {
  return get(url +"/infectiousDiseaseCard/deleteInfectiousDiseaseCard/" + data.cardId, {}, false);
}
// 传染病漏报导出
export function excelInfectiousDiseaseCard(data) {
  return post(url +`/export/excelInfectiousDiseaseCard`, data, false, "", "blob");
}