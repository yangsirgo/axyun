import {post, get, put, del} from "@/utils/request";
const url = "/phss";
// 获取行政机构列表
export function getTreeNode(data) {
  return post(url + "/sysRegionCode/getTreeNode", data, true);
}
// 保存添加列表
export function saveRegionNode(data) {
  return post(url + "/sysRegionCode/saveRegionNode", data, true);
}
// 删除选中列
export function deleteRegionNode(data) {
  return post(url + "/sysRegionCode/deleteRegionNode", data, true);
}
// 获取选中列详细信息
export function getNodeById(data) {
  return get(url + `/sysRegionCode/${data.id}`, true);
}
// 汇总接口
export function getCollectPopulation(data) {
  return post(url + "/sysRegionCode/getCollectPopulation", data, true);
}
// getRegionNode
export function getRegionNode(data) {
  return post(url + "/sysRegionCode/getRegionNode", data, true);
}
