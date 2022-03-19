import {post, get, put, del} from "@/utils/request";
const url = "/phss";
// 获取管辖列表
export function getHospitalDistrictNode(data) {
  return post(url + "/sysHosRegionRelation/getHospitalDistrictNode", data, true);
}
// 保存新添加管辖区域
export function saveHospitalDistrictNode(data) {
  return post(url + "/sysHosRegionRelation/saveHospitalDistrictNode", data, true);
}
// 医院管辖停用
export function disableHospitalDistrictNode(data) {
  return post(url + "/sysHosRegionRelation/disableHospitalDistrictNode", data, true);
}
//删除
export function delHosRegionNode(data) {
  return del(url + `/sysHosRegionRelation/${data.id}`, data, true);
}
//删除
export function deleteSignGroupMember(data) {
  return post(url + "/sysSignGroupMember/deleteSignGroupMember", data, true);
}
// 根据id获取数据
export function getNodeById(data) {
  return get(url + `/sysHosRegionRelation/${data.id}`, data, true);

}
