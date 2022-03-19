import { post, get, put, del } from "@/utils/request";
const url = "/phss";
// 获取网格列表
export function getRegionGridList(data) {
  return post(url + "/sysGridMaintenance/getRegionGridList", data, true);
}
// 保存添加网格
export function saveRegionGridList(data) {
  return post(url + "/sysGridMaintenance/saveRegionGridList", data, true);
}

//删除
// export function delHosRegionNode(data) {
//   return del(`/sysGridMaintenance/${data.id}`, data, true);
// }
export function deleteHospitalGridNode(data) {
  return post(url + "/sysGridMaintenance/deleteHospitalGridNode", data, true);
}
// 根据id获取数据
export function getNodeById(data) {
  return get(url + `/sysGridMaintenance/${data.id}`, data, true);
}
// 停用网格信息
export function disableHospitalGridNode(data) {
  return post(url + "/sysGridMaintenance/disableHospitalGridNode", data, true);
}
// 获取网格信息接口 （在 档案迁移，档案综合管理，家庭关系维护，里使用,）
export function queryRegionAndGridByHospitalId(data) {
  return get(url + "/sysGridMaintenance/getRegionAndGridByHospitalId", data, true);
}
