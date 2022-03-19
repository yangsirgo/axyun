import {post, get, put, del} from "@/utils/request";
const url = "/phss";
// 档案删除的列表查询
export function docIndexAllByPage(data) {
  return post(url + "/docIndex/docIndexAllByPage", data, true);
}
// 档案删除的记录页表
export function docDeleteRestoreList(data) {
  return post(url + "/docIndex/docDeleteRestoreList", data, true);
}

// 家庭档案删除与回复保存接口
export function deleteOrRecover(data) {
  return post(url + "/docIndex/deleteOrRecover", data, true);
}
// 查询机构
export function baseDocData(data) {
  return post(url + "/docIndex/baseDocData", data, true);
}
