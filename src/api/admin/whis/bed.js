import { get, post, del, put } from "../../../utils/request";

const url = "/admin";

// 床位分页查询
export function getBedAll(data) {
  return get(url + '/wbed/page', data, true)
}
// 保存数据
// export function addBed(data) {
//     return post('/wbed',data,true)
// }
// 修改数据
export function editBed(data) {
  return put(url + `/wbed/${data.bedId}`, data, true)
}
// 删除数据
export function removeBed(data) {
  return del(url + `/wbed/batch`, data, true)
}
// 已经关联的病区
export function getSelectBed(data) {
  let par = { bedId: data.bedId }
  return get(url + '/wbed/params', par, true)
}

//配置管理页面查询床位
export function getBed(data) {
  return get(url + '/bedInfo/getBed', data, true)
}

//配置管理页面查询收费项目信息
export function getItem(data) {
  return get(url + '/finance-pub/chargeItem/getChargeItem', data, true)
}

//配置管理页面新增床位信息
export function addBed(data) {
  return post(url + '/bedInfo/addBed', data, true)
}


//配置管理页面修改床位信息
export function updateBed(data) {
  return post(url + '/bedInfo/updateBed', data, true)
}

//配置管理页面根据床位id查询床位收费项目
export function getCharItemByBedId(data) {
  return get(url + '/bedInfo/getCharItemByBedId', data, true)
}

//配置管理页面删除床位信息
export function deleteBed(data) {
  return del(url + '/bedInfo/deleteBed', data, true)
}
