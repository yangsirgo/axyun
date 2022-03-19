import {post, get, put, del} from "@/utils/request";
const url = "/phss";
// const url = "";
// getBaseHomDoc获取建档医生
export function getBaseHomDoc(data) {
  return post(url + "/homeDoc/getBaseHomDoc", data, true);
}
// 查询居民信息
export function getAllDocByAge(data) {
  return post(url + "/docIndex/getAllDocByAge", data, true);
}

// 保存家庭基本信息
export function saveBaseHomDoc(data) {
  return post(url + "/homeDoc/saveBaseHomDoc", data, true);
}

// 查看家庭关系
export function viewBaseHomDoc(data) {
  return post(url + "/homeDoc/viewBaseHomDoc", data, true);
}

// 解散

export function disBandHomDoc(data) {
  return post(url + "/homeDoc/disBandHomDoc", data, true);
}

// 删除
export function deleteHomDoc(data) {
  return post(url + "/homeDoc/deleteHomDoc", data, true);
}
//getHomeDocByPage获取家庭列表
export function getHomeDocByPage(data) {
  return post(url + "/homeDoc/getHomeDocByPage", data, true);
}
